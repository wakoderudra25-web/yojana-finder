import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const reportsFilePath = path.join(process.cwd(), "data", "reports.json");

interface ReportData {
  id: string;
  schemeId: string;
  schemeName: string;
  whatsWrong: string;
  email?: string;
  createdAt: string;
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

export async function GET() {
  const reports = getStoredReports();
  return NextResponse.json({ success: true, reports });
}

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

    const reports = getStoredReports();
    const newReport: ReportData = {
      id: "rep_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      schemeId: schemeId || "unknown",
      schemeName: schemeName.trim(),
      whatsWrong: whatsWrong.trim(),
      email: email ? email.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    reports.unshift(newReport); // newest first
    saveReports(reports);

    return NextResponse.json({ success: true, message: "Report saved successfully", report: newReport });
  } catch (error) {
    console.error("Failed to save report:", error);
    return NextResponse.json({ success: false, error: "Failed to process report" }, { status: 500 });
  }
}
