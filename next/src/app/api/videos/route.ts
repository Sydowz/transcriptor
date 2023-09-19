import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import * as uuid from "uuid";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";

// export const runtime = "edge";

function getExtname(filename: string) {
  const dotIndex = filename.lastIndexOf(".");

  return filename.slice(dotIndex);
}

export async function POST(request: Request) {
  const data = await request.formData();
  const audioFile = data.get("file") as unknown as File;

  if (!audioFile) {
    return NextResponse.json(
      {
        error: "Missing file input",
      },
      { status: 400 }
    );
  }

  const extension = getExtname(audioFile.name);

  if (extension !== ".mp3") {
    return NextResponse.json(
      { error: "invalid input type, please upload a MP3" },
      {
        status: 400,
      }
    );
  }

  const fileBaseName = audioFile.name.replace(extension, "");
  const fileUploadName = `${fileBaseName}-${uuid.v4()}${extension}`;

  const bytes = await audioFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileUploadName,
      Body: buffer,
      ContentType: "audio/mpeg",
    })
  );

  const video = await prisma.video.create({
    data: {
      name: audioFile.name,
      path: `${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${fileUploadName}`,
    },
  });

  return NextResponse.json(video);
}
