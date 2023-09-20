import { z } from "zod";
import { StreamingTextResponse, OpenAIStream } from "ai";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: NextRequest) {
  const bodySchema = z.object({
    videoId: z.string(),
    prompt: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
  });

  const { videoId, prompt, temperature } = bodySchema.parse(
    await request.json()
  );

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    },
  });

  if (!video.transcription) {
    return new NextResponse(
      JSON.stringify({ error: "Video transcription was not generated yet" }),
      {
        status: 400,
      }
    );
  }

  const promptMessage = prompt.replace("{transcription}", video.transcription);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature,
    messages: [
      {
        role: "user",
        content: promptMessage,
      },
    ],
    stream: true,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
