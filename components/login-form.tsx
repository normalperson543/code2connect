"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MTLoginForm } from "./ui/mt-login-form";
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
} from "@mantine/core";

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Container size={420} my={40}>
        <form onSubmit={handleLogin}>
          <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
            <Title>👋</Title>
            <Title>Sign in</Title>
            <Text>
              Don't have an account? <Anchor>Create a new account</Anchor>
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
                <Anchor component="button" size="sm">
                  Forgot password?
                </Anchor>
              </Link>
            </Group>
            <Button fullWidth mt="xl" radius="sm" type="submit" disabled={isLoading}>
              Sign in
            </Button>
          </Paper>
        </form>
      </Container>
    </div>
  );
}
