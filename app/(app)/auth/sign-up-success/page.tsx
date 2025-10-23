import {
  CheckIcon,
  Container,
  Paper,
  ThemeIcon,
  Title,
  Text,
} from "@mantine/core";

export default function Page() {
  return (
    <div className="flex flex-row h-full w-full gap-6 bg-gradient-to-br from-offblue-100 to-offblue-700">
      <div className="flex flex-col h-full w-full">
        <Container className="w-full" my={40}>
          <Paper
            withBorder
            shadow="md"
            p={22}
            mt={30}
            radius="md"
            className="flex! flex-col gap-2"
          >
            <ThemeIcon
              color="green"
              className="shadow-md"
              radius="xl"
              size="xl"
            >
              <CheckIcon width={16} height={16} />
            </ThemeIcon>
            <Text className="uppercase font-mono" c="dimmed">
              Welcome to Code2Connect
            </Text>
            <div className="flex flex-col gap-2">
              <Title>Almost There</Title>
              <Text>
                You&apos;ve just registered for an account - congratulations!
                Check your email for instructions to activate your account.
              </Text>
            </div>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
