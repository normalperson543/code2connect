import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

let endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Missing R2 storage environment variables");
}

// Accept either `https://<account>.r2.cloudflarestorage.com` or
// `https://<account>.r2.cloudflarestorage.com/<bucket>` and normalize to the
// account endpoint so the SDK does not double the bucket name in the path.
endpoint = endpoint.replace(new RegExp(`/${bucketName}/?$`), "");

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

function isMissingError(error: unknown): boolean {
  const code = (error as { Code?: string; name?: string }).Code ??
    (error as { name?: string }).name;
  return code === "NoSuchKey" || code === "NoSuchBucket";
}

function fileKey(userId: string, projectId: string, fileName: string) {
  return `${userId}/${projectId}/${fileName}`;
}

export async function listProjectFiles(userId: string, projectId: string) {
  const prefix = `${userId}/${projectId}/`;
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  try {
    const response = await s3.send(command);

    if (!response.Contents) {
      return [];
    }

    return response.Contents.map((object) => {
      const fullKey = object.Key ?? "";
      const name = fullKey.replace(prefix, "");
      return { id: name, name };
    }).filter((file) => file.name && file.name !== ".emptyFolderPlaceholder");
  } catch (error) {
    if (isMissingError(error)) {
      console.warn(
        `listProjectFiles: bucket or prefix not found for ${prefix}`,
        error,
      );
      return [];
    }
    throw error;
  }
}

export async function getProjectFileUrl(
  _userId: string,
  _projectId: string,
  _fileName: string,
) {
  // Files are private and served through the session-token-protected /api/project-files route.
  // This helper is kept for compatibility with the old Supabase storage API shape.
  return "";
}

export async function getProjectFileContent(
  userId: string,
  projectId: string,
  fileName: string,
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey(userId, projectId, fileName),
  });

  try {
    const response = await s3.send(command);
    const body = await response.Body?.transformToString();
    return body ?? "";
  } catch (error) {
    if (isMissingError(error)) {
      console.warn(
        `getProjectFileContent: file not found ${fileKey(userId, projectId, fileName)}`,
        error,
      );
      return "";
    }
    throw error;
  }
}

export async function uploadProjectFile(
  userId: string,
  projectId: string,
  fileName: string,
  content: string,
) {
  await uploadProjectFileByKey(fileKey(userId, projectId, fileName), content);
}

export async function uploadProjectFileByKey(key: string, content: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: content,
    ContentType: "text/plain",
  });

  await s3.send(command);
}

export async function copyProjectFile(sourceKey: string, destinationKey: string) {
  const command = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `/${bucketName}/${sourceKey}`,
    Key: destinationKey,
  });

  await s3.send(command);
}

export async function deleteProjectFile(
  userId: string,
  projectId: string,
  fileName: string,
) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey(userId, projectId, fileName),
  });

  await s3.send(command);
}
