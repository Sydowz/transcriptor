import { MagicWandIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Separator,
  Slider,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { PromptSelect } from "./components/prompt-select";
import { ModelSelect } from "./components/model-select";
import { VideoInputForm } from "./components/video-input-form";
import { AppHeader } from "./components/app-header";

export default function Home() {
  return (
    <Flex direction="column" className="min-h-screen">
      <AppHeader />

      <Flex is="main" gap="6" p="6" className="flex-1">
        <Flex direction="column" gap="4" className="flex-1">
          <Grid rows="2" gap="4" className="flex-1">
            <TextArea
              placeholder="Inclua o prompt para a IA..."
              className="resize-none p-4 leading-relaxed"
            />

            <TextArea
              placeholder="Resultado gerado pela IA"
              readOnly
              className="resize-none p-4 leading-relaxed"
            />
          </Grid>

          <Text className="text-sm">
            Lembre-se: Você pode utilizar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> no seu
            prompt para adicionar o conteúdo do vídeo selecionado
          </Text>
        </Flex>

        <Box is="aside" className="w-80 space-y-6">
          <VideoInputForm />
          <Separator size="4" />

          <form className="space-y-6">
            <Flex direction="column" gap="2">
              <label className="text-sm font-medium leading-none">Prompt</label>
              <PromptSelect />
            </Flex>

            <Flex direction="column" gap="2">
              <label className="text-sm font-medium leading-none">Modelo</label>

              <ModelSelect />

              <Text
                is="span"
                className="block text-xs text-muted-foreground italic"
              >
                Você poderá customizar essa opção em breve
              </Text>
            </Flex>

            <Separator size="4" />

            <Flex direction="column" gap="2">
              <label className="text-sm font-medium leading-none">
                Temperatura
              </label>

              <Slider min={0} max={1} step={0.1} />

              <Text
                is="span"
                className="block text-xs text-muted-foreground italic leading-relaxed"
              >
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros
              </Text>
            </Flex>

            <Separator size="4" />

            <Button type="submit" className="w-full">
              Executar <MagicWandIcon className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
}
