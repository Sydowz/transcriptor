"use client";

import { Select } from "@radix-ui/themes";

export function PromptSelect() {
  return (
    <Select.Root defaultValue="gpt3.5">
      <Select.Trigger placeholder="Selecione um prompt" />
      <Select.Content>
        <Select.Item value="title">Título do Youtube</Select.Item>
        <Select.Item value="description">Descrição do Youtube</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
