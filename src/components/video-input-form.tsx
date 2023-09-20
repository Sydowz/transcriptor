"use client";

import { api } from "@/lib/axios";
import { convertVideoToAudio } from "@/usecases/convert-video-to-audio";
import { UploadIcon, FileIcon } from "@radix-ui/react-icons";
import { Button, Separator, TextArea } from "@radix-ui/themes";
import { useState, useRef, ChangeEvent, useMemo, FormEvent } from "react";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

interface VideoInputFormProps {
  onVideoUploaded(videoId: string): void;
}

const statusMessages: Record<Status, React.ReactNode> = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
  waiting: (
    <>
      Carregar vídeo <UploadIcon className="w-4 h-4" />
    </>
  ),
};

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files || !files.length) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!prompt || !videoFile) {
      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);

    const videoId = response.data.id;

    setStatus("generating");

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus("success");

    props.onVideoUploaded(videoId);

    console.log("finalizou");
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className="space-y-4" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative aspect-video border rounded-md flex cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-colors"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0 rounded-md"
          />
        ) : (
          <>
            <FileIcon className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator size="4" />

      <div className="space-y-2">
        <label
          htmlFor="transcription_prompt"
          className="text-sm font-medium leading-none"
        >
          Prompt de transcrição
        </label>

        <TextArea
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula"
          required
          ref={promptInputRef}
        />
      </div>

      <Button
        className="w-full data-[success=false]:bg-secondary-foreground"
        type="submit"
        disabled={status !== "waiting"}
        data-success={status === "success"}
      >
        {statusMessages[status]}
      </Button>
    </form>
  );
}
