import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, Flex, Separator, Text } from "@radix-ui/themes";

export function AppHeader() {
  return (
    <Flex
      px="6"
      py="3"
      align="center"
      justify="between"
      className="border-b border-gray-600"
    >
      <Text className="text-xl" weight="bold">
        transcriptor.ai
      </Text>

      <Flex align="center" gap="3">
        <Text className="text-sm">
          Desenvolvido com 💗 no NLW da Rocketseat
        </Text>

        <Separator orientation="vertical" className="h-6" />

        <a href="https://github.com/Jonatan966/transcriptor" target="_blank">
          <Button variant="outline">
            <GitHubLogoIcon className="h-4 w-4" />
            Github
          </Button>
        </a>
      </Flex>
    </Flex>
  );
}
