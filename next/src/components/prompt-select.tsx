"use client";

import { api } from "@/lib/axios";
import { Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onPromptSelected(template: string): void;
}

export function PromptSelect(props: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    async function loadPrompts() {
      const response = await api.get("/prompts");

      setPrompts(response.data);
    }

    loadPrompts();
  }, []);

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) {
      return;
    }

    props.onPromptSelected(selectedPrompt.template);
  }

  return (
    <Select.Root onValueChange={handlePromptSelected}>
      <Select.Trigger placeholder="Selecione um prompt" />
      <Select.Content>
        {prompts.map((prompt) => (
          <Select.Item value={prompt.id} key={prompt.id}>
            {prompt.title}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
