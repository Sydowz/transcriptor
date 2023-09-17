import { UploadIcon, FileIcon } from "@radix-ui/react-icons";
import { Button, Separator, TextArea } from "@radix-ui/themes";

export function VideoInputForm() {
  return (
    <form className="space-y-4">
      <label
        htmlFor="video"
        className="relative aspect-video border rounded-md flex cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-colors"
      >
        <FileIcon className="w-4 h-4" />
        Selecione um vídeo
      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" />

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
        />
      </div>

      <Button
        className="w-full data-[success=false]:bg-secondary-foreground"
        type="submit"
      >
        Carregar vídeo <UploadIcon className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
