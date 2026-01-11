import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: requiredEnv("R2_ENDPOINT"),
  credentials: {
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
  },
});

const r2Bucket = requiredEnv("R2_BUCKET");
const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function putObject(params: {
  key: string;
  body: Uint8Array | Buffer | string;
  contentType?: string;
  cacheControl?: string;
}) {
  const { key, body, contentType, cacheControl } = params;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    })
  );
  return { key, url: r2PublicBaseUrl ? `${r2PublicBaseUrl}/${key}` : undefined };
}

export async function getObject(key: string) {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: r2Bucket,
      Key: key,
    })
  );
  const bodyStream = response.Body;
  if (!bodyStream || !(bodyStream instanceof Readable)) {
    throw new Error("Unexpected R2 response body");
  }
  return {
    body: await streamToBuffer(bodyStream),
    contentType: response.ContentType,
    cacheControl: response.CacheControl,
    etag: response.ETag,
  };
}

export async function headObject(key: string) {
  const response = await r2Client.send(
    new HeadObjectCommand({
      Bucket: r2Bucket,
      Key: key,
    })
  );
  return {
    contentType: response.ContentType,
    cacheControl: response.CacheControl,
    contentLength: response.ContentLength,
    etag: response.ETag,
    lastModified: response.LastModified,
  };
}

export async function deleteObject(key: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: r2Bucket,
      Key: key,
    })
  );
}

export async function listObjects(params?: { prefix?: string; limit?: number }) {
  const response = await r2Client.send(
    new ListObjectsV2Command({
      Bucket: r2Bucket,
      Prefix: params?.prefix,
      MaxKeys: params?.limit ?? 1000,
    })
  );
  return response.Contents?.map((item) => ({
    key: item.Key ?? "",
    size: item.Size ?? 0,
    etag: item.ETag,
    lastModified: item.LastModified,
  })) ?? [];
}

export function getPublicUrl(key: string) {
  if (!r2PublicBaseUrl) {
    throw new Error("Missing env var: R2_PUBLIC_BASE_URL");
  }
  return `${r2PublicBaseUrl}/${key}`;
}
