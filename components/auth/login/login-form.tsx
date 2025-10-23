"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon,
  EnvelopeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import OAuthButtons from "../oauth-buttons";
import WarningBanner from "@/components/warning-banner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row h-full w-full gap-6 bg-gradient-to-br from-offblue-100 to-offblue-700",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col w-full">
        <Container className="w-full" my={40}>
          <form onSubmit={handleLogin}>
            <Paper
              withBorder
              shadow="md"
              p={22}
              mt={30}
              radius="md"
              className="flex! flex-col gap-2"
            >
              <ThemeIcon className="shadow-md" size="xl" radius="xl">
                <ArrowRightStartOnRectangleIcon width={16} height={16} />
              </ThemeIcon>
              <Text className="uppercase font-mono" c="dimmed">
                Welcome to Code2Connect
              </Text>
              <Title>Sign In</Title>
              <Text>
                Don&apos;t have an account?{" "}
                <Anchor href="/auth/sign-up">Create a new account</Anchor>
              </Text>
              {error && <WarningBanner>{error}</WarningBanner>}
              <TextInput
                label="Email"
                placeholder="name@example.com"
                required
                radius="md"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftSection={<EnvelopeIcon width={16} height={16} />}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                radius="md"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftSection={<KeyIcon width={16} height={16} />}
              />
              <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Anchor size="sm" href="/auth/forgot-password">
                  Forgot password?
                </Anchor>
              </Group>
              <Button
                fullWidth
                mt="xl"
                radius="sm"
                type="submit"
                loading={isLoading}
                leftSection={<ArrowRightIcon width={16} height={16} />}
              >
                Sign in
              </Button>
              <OAuthButtons />
            </Paper>
          </form>
        </Container>
      </div>
    </div>
  );
}
