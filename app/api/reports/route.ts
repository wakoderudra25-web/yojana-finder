import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const reportsFilePath = path.join(process.cwd(), "data", "reports.json");

interface ReportData {
  id: string;
  schemeId: string;
  schemeName: string;
  whatsWrong: string;
  email?: string;
  createdAt: string;
  resolved?: boolean;
}

function getStoredReports(): ReportData[] {
  try {
    if (!fs.existsSync(reportsFilePath)) {
      fs.writeFileSync(reportsFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const fileContent = fs.readFileSync(reportsFilePath, "utf-8");
    return JSON.parse(fileContent) || [];
  } catch (err) {
    console.error("Error reading reports file:", err);
    return [];
  }
}

function saveReports(reports: ReportData[]): void {
  try {
    const dir = path.dirname(reportsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing reports file:", err);
  }
}

// GET: Retrieve all reports (Queries Supabase with fallback to local file)
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Map database columns to application interface
        const mappedReports: ReportData[] = data.map((r: any) => ({
          id: r.id,
          schemeId: r.scheme_id || "unknown",
          schemeName: r.scheme_name,
          whatsWrong: r.message,
          email: r.email || undefined,
          createdAt: r.created_at,
          resolved: r.resolved || false,
        }));
        return NextResponse.json({ success: true, reports: mappedReports, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase fetch failed in reports API, falling back to local file:", err);
    }
  }

  const reports = getStoredReports();
  return NextResponse.json({ success: true, reports, source: "local" });
}

// POST: Submit a report (Inserts into Supabase with fallback to local file)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schemeId, schemeName, whatsWrong, email } = body;

    if (!schemeName || !whatsWrong || !whatsWrong.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide scheme name and details of what is wrong." },
        { status: 400 }
      );
    }

    const newReport: ReportData = {
      id: "rep_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      schemeId: schemeId || "unknown",
      schemeName: schemeName.trim(),
      whatsWrong: whatsWrong.trim(),
      email: email ? email.trim() : undefined,
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    // 1. Insert into Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: dbError } = await supabase.from("reports").insert([
          {
            scheme_name: schemeName.trim(),
            message: whatsWrong.trim(),
            email: email ? email.trim() : null,
            scheme_id: schemeId || null,
            resolved: false,
          },
        ]);

        if (dbError) {
          console.warn("Supabase insert report warning:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Failed to insert report into Supabase:", dbErr);
      }
    }

    // 2. Persist to local JSON for backup resilience
    const reports = getStoredReports();
    reports.unshift(newReport);
    saveReports(reports);

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Failed to save report:", error);
    return NextResponse.json({ success: false, error: "Failed to process report" }, { status: 500 });
  }
}
