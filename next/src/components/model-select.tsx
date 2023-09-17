"use client";

import { Select } from "@radix-ui/themes";

export function ModelSelect() {
  return (
    <Select.Root defaultValue="gpt3.5" disabled>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="gpt3.5">GPT 3.5-turbo 16k</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
