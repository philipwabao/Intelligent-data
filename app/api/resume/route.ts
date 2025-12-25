import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

// Max 10MB
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = new Set(["pdf", "doc", "docx"]);

// Role-based auth (Amplify Compute Role). No access keys needed.
const REGION = process.env.S3_REGION || "ap-northeast-1";
const BUCKET = process.env.S3_BUCKET || "auxerta-careers-uploads";

const s3 = new S3Client({ region: REGION });

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function getExt(name: string) {
  const parts = name.split(".");
  return (parts.length > 1 ? parts[parts.length - 1] : "").toLowerCase();
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const jobTitle = String(form.get("jobTitle") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const linkedin = String(form.get("linkedin") ?? "").trim();
    const portfolio = String(form.get("portfolio") ?? "").trim();
    const note = String(form.get("note") ?? "").trim();

    const file = form.get("resume");

    if (!jobTitle) return NextResponse.json({ error: "Missing job title." }, { status: 400 });
    if (!name || !email) return NextResponse.json({ error: "Missing name or email." }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing resume file." }, { status: 400 });
    if (file.size <= 0) return NextResponse.json({ error: "Empty resume file." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Resume too large (max 10MB)." }, { status: 413 });

    const originalName = file.name || "resume";
    const ext = getExt(originalName);
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type. Use PDF/DOC/DOCX." }, { status: 400 });
    }

    const applicationId = makeId();
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const storedName = `${ts}__${applicationId}__${safeFilename(originalName)}`;

    const resumeKey = `resumes/${storedName}`;
    const metaKey = `applications/${ts}__${applicationId}.json`;

    // Upload resume to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: resumeKey,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type || "application/octet-stream",
      })
    );

    // Upload metadata JSON (FULL NAME / EMAIL / LINKEDIN / PORTFOLIO / NOTE, etc.)
    const record = {
      applicationId,
      createdAt: new Date().toISOString(),
      jobTitle,
      name,
      email,
      linkedin,
      portfolio,
      note,
      resumeKey,
      originalFilename: originalName,
      sizeBytes: file.size,
      mimeType: file.type,
    };

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: metaKey,
        Body: JSON.stringify(record, null, 2),
        ContentType: "application/json",
      })
    );

    return NextResponse.json({ ok: true, applicationId, resumeKey, metaKey });
  } catch (err) {
    console.error("resume upload failed:", err);
    return NextResponse.json({ error: "Server error while saving resume." }, { status: 500 });
  }
}
