import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SAMPLE_SCHEMES } from "@/data/schemes";

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

// GET: Return all schemes
export async function GET() {
  const schemes = getStoredSchemes();
  return NextResponse.json({ success: true, schemes });
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

    const schemes = getStoredSchemes();
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
      lastVerified: getCurrentMonthYear(), // Automatically set current month & year
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

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Scheme with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    // Automatically update lastVerified to the current month & year
    const updatedScheme = {
      ...schemes[index],
      ...updates,
      id, // protect ID from alteration
      lastVerified: getCurrentMonthYear(), // Automatically updated on edit
      documentsNeeded: Array.isArray(updates.documentsNeeded)
        ? updates.documentsNeeded.filter(Boolean)
        : typeof updates.documentsNeeded === "string"
        ? updates.documentsNeeded.split("\n").map((d: string) => d.trim()).filter(Boolean)
        : schemes[index].documentsNeeded,
    };

    schemes[index] = updatedScheme;
    saveSchemes(schemes);

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

    const schemes = getStoredSchemes();
    const index = schemes.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Scheme with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const removed = schemes.splice(index, 1);
    saveSchemes(schemes);

    return NextResponse.json({
      success: true,
      message: `Scheme '${removed[0]?.name || id}' deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Failed to delete scheme:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete scheme" },
      { status: 500 }
    );
  }
}
