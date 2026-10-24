import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SAMPLE_SCHEMES } from "@/data/schemes";
import {
  supabase,
  isSupabaseConfigured,
  mapDatabaseRowToScheme,
  mapSchemeToDatabaseRow,
} from "@/lib/supabase";

const schemesFilePath = path.join(process.cwd(), "data", "schemes.json");
const ADMIN_PASSCODE = process.env.ADMIN_PASSWORD || "admin123";

function getStoredSchemes(): any[] {
  try {
    if (!fs.existsSync(schemesFilePath)) {
      const sanitized = SAMPLE_SCHEMES.map(({ getQualificationReason, ...rest }) => rest);
      fs.writeFileSync(schemesFilePath, JSON.stringify(sanitized, null, 2), "utf-8");
      return sanitized;
    }
    const fileContent = fs.readFileSync(schemesFilePath, "utf-8");
    return JSON.parse(fileContent) || [];
  } catch (err) {
    console.error("Error reading schemes file:", err);
    return SAMPLE_SCHEMES.map(({ getQualificationReason, ...rest }) => rest);
  }
}

function saveSchemes(schemes: any[]): void {
  try {
    const dir = path.dirname(schemesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(schemesFilePath, JSON.stringify(schemes, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing schemes file:", err);
  }
}

function getCurrentMonthYear(): string {
  const d = new Date();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${month} ${year}`;
}

function verifyAdminAuth(request: Request): boolean {
  const adminKey = request.headers.get("x-admin-key");
  return adminKey === ADMIN_PASSCODE;
}

// GET: Return all schemes (Queries Supabase with fallback to local storage)
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        const schemes = data.map(mapDatabaseRowToScheme);
        return NextResponse.json({ success: true, schemes, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase fetch failed in API route, falling back to local file:", err);
    }
  }

  // Graceful offline/local fallback
  const schemes = getStoredSchemes();
  return NextResponse.json({ success: true, schemes, source: "local" });
}

// POST: Add new scheme (Protected)
export async function POST(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid admin credentials" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      hindiName,
      tagline,
      ministry,
      categoryTag,
      badgeColor,
      shortDescription,
      benefitAmount,
      status,
      lastDateToApply,
      officialSourceUrl,
      applyUrl,
      documentHelp,
      documentsNeeded,
      criteria,
    } = body;

    if (!name || !ministry || !benefitAmount) {
      return NextResponse.json(
        { success: false, error: "Scheme Name, Ministry, and Benefit Amount are required." },
        { status: 400 }
      );
    }

    const generatedId =
      body.id?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now().toString(36).substring(4);

    const newScheme = {
      id: generatedId,
      name: name.trim(),
      hindiName: hindiName?.trim() || "",
      tagline: tagline?.trim() || "",
      ministry: ministry.trim(),
      categoryTag: categoryTag?.trim() || "General Support",
      badgeColor: badgeColor || "bg-emerald-100 text-emerald-800 border-emerald-300",
      shortDescription: shortDescription?.trim() || "",
      benefitAmount: benefitAmount.trim(),
      status: status || "Open",
      lastDateToApply: lastDateToApply?.trim() || "Ongoing / Open throughout the year",
      lastVerified: getCurrentMonthYear(),
      officialSourceUrl: officialSourceUrl?.trim() || "",
      applyUrl: applyUrl?.trim() || "",
      documentHelp: documentHelp?.trim() || "",
      documentsNeeded: Array.isArray(documentsNeeded)
        ? documentsNeeded.filter(Boolean)
        : typeof documentsNeeded === "string"
        ? documentsNeeded.split("\n").map((d: string) => d.trim()).filter(Boolean)
        : [],
      criteria: criteria || {},
    };

    // 1. Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const rowData = mapSchemeToDatabaseRow(newScheme);
        const { error: dbError } = await supabase.from("schemes").upsert([rowData]);
        if (dbError) {
          console.warn("Supabase insert warning:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Failed to insert into Supabase:", dbErr);
      }
    }

    // 2. Keep local storage synced for fallback
    const schemes = getStoredSchemes();
    schemes.unshift(newScheme);
    saveSchemes(schemes);

    return NextResponse.json({
      success: true,
      message: "Scheme added successfully",
      scheme: newScheme,
    });
  } catch (error: any) {
    console.error("Failed to add scheme:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add scheme" },
      { status: 500 }
    );
  }
}

// PUT: Edit existing scheme (Protected) - Automatically updates "lastVerified"
export async function PUT(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid admin credentials" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Scheme ID is required for editing." },
        { status: 400 }
      );
    }

    const schemes = getStoredSchemes();
    const index = schemes.findIndex((s) => s.id === id);

    const existingScheme = index !== -1 ? schemes[index] : { id };
    const updatedScheme = {
      ...existingScheme,
      ...updates,
      id,
      lastVerified: getCurrentMonthYear(),
      documentsNeeded: Array.isArray(updates.documentsNeeded)
        ? updates.documentsNeeded.filter(Boolean)
        : typeof updates.documentsNeeded === "string"
        ? updates.documentsNeeded.split("\n").map((d: string) => d.trim()).filter(Boolean)
        : existingScheme.documentsNeeded || [],
    };

    // 1. Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const rowData = mapSchemeToDatabaseRow(updatedScheme);
        const { error: dbError } = await supabase
          .from("schemes")
          .update(rowData)
          .eq("id", id);
        if (dbError) {
          console.warn("Supabase update warning:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Failed to update in Supabase:", dbErr);
      }
    }

    // 2. Keep local storage synced
    if (index !== -1) {
      schemes[index] = updatedScheme;
      saveSchemes(schemes);
    }

    return NextResponse.json({
      success: true,
      message: "Scheme updated successfully and 'Last verified' date refreshed.",
      scheme: updatedScheme,
    });
  } catch (error: any) {
    console.error("Failed to update scheme:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update scheme" },
      { status: 500 }
    );
  }
}

// DELETE: Delete scheme (Protected)
export async function DELETE(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid admin credentials" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Scheme ID is required for deletion." },
        { status: 400 }
      );
    }

    // 1. Delete from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: dbError } = await supabase.from("schemes").delete().eq("id", id);
        if (dbError) {
          console.warn("Supabase delete warning:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Failed to delete from Supabase:", dbErr);
      }
    }

    // 2. Delete from local storage
    const schemes = getStoredSchemes();
    const index = schemes.findIndex((s) => s.id === id);
    let removedName = id;
    if (index !== -1) {
      const removed = schemes.splice(index, 1);
      removedName = removed[0]?.name || id;
      saveSchemes(schemes);
    }

    return NextResponse.json({
      success: true,
      message: `Scheme '${removedName}' deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Failed to delete scheme:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete scheme" },
      { status: 500 }
    );
  }
}
