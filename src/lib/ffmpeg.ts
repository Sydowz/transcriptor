import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null;

const FFMPEG_BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

export async function loadFFmpeg() {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${FFMPEG_BASE_URL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${FFMPEG_BASE_URL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  }

  return ffmpeg;
}
