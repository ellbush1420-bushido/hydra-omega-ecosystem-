import fs from 'node:fs';
import path from 'node:path';

export function readManifest({ manifestBasePath, manifestVersion }) {
  const filePath = path.join(manifestBasePath, `${manifestVersion}.json`);
  const data = fs.readFileSync(filePath, 'utf8');
  return { filePath, json: JSON.parse(data) };
}

export function computeS3Path({ userEmail, tier, manifestVersion }) {
  const safeEmail = String(userEmail).toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
  return `private/${tier}/${safeEmail}/${manifestVersion}.json`;
}

// Stub for private S3 delivery: we log the destination path.
export async function deliverToPrivateS3({ s3Path, manifest }) {
  return {
    ok: true,
    s3Path,
    bytes: Buffer.byteLength(JSON.stringify(manifest)),
  };
}

