import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

export function MTLoginForm() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">
        Welcome back!
      </Title>

      <Text>
        Do not have an account yet? <Anchor>Create account</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30}>
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="sm" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" >
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl">
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}