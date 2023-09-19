import { GetObjectCommand } from "@aws-sdk/client-s3";
import FormData from "form-data";
import axios, { AxiosError } from "axios";

import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const paramsSchema = z.object({
    videoId: z.string().uuid(),
  });

  const { videoId } = paramsSchema.parse(params);

  const bodySchema = z.object({
    prompt: z.string(),
  });

  const { prompt } = bodySchema.parse(await request.json());

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    },
  });

  const [, videoName] = video.path.split("/");

  const audioFile = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: videoName,
    })
  );

  if (!audioFile.Body) {
    return;
  }

  const formData = new FormData();

  formData.append("file", audioFile.Body as any, {
    contentType: audioFile.ContentType,
    knownLength: audioFile.ContentLength,
    filename: videoName,
  });

  formData.append("model", "whisper-1");
  formData.append("response_format", "json");
  formData.append("temperature", "0");
  formData.append("language", "pt");
  formData.append("prompt", prompt);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const transcription = response.data.text;

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    });

    return NextResponse.json({ transcription });
  } catch (error) {
    return NextResponse.json(
      { error: (error as AxiosError).response?.data },
      {
        status: 500,
      }
    );
  }
}
