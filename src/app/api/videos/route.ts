import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as uuid from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";

export const runtime = "edge";
export const dynamic = 'force-dynamic';

function getExtname(filename: string) {
  const dotIndex = filename.lastIndexOf(".");
  return filename.slice(dotIndex);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const audioFile = data.get("file") as unknown as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Missing file input" },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const extension = getExtname(audioFile.name);
    if (extension !== ".mp3") {
      return NextResponse.json(
        { error: "Invalid file type. Only .mp3 files are allowed." },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const fileBaseName = audioFile.name.replace(extension, "");
    const fileUploadName = `${fileBaseName}-${uuid.v4()}${extension}`;
    const bytes = await audioFile.arrayBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileUploadName,
        Body: Buffer.from(bytes),
        ContentType: "audio/mpeg",
      })
    );

    const video = await prisma.video.create({
      data: {
        name: audioFile.name,
        path: `${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${fileUploadName}`,
      },
    });

    return NextResponse.json(
      { video },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error: any) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
