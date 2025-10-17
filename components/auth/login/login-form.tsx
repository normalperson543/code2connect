"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import signInWithGoogle from "@/app/lib/oauth";
import OAuthButtons from "../oauth-buttons";

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
      router.push("/protected");
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
              {error}
              <TextInput
                label="Email"
                placeholder="name@example.com"
                required
                radius="md"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
              <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  <Anchor size="sm">Forgot password?</Anchor>
                </Link>
              </Group>
              <Button
                fullWidth
                mt="xl"
                radius="sm"
                type="submit"
                loading={isLoading}
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
