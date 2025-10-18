"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Container,
  Title,
  Text,
  Paper,
  Input,
  Anchor,
  TextInput,
  PasswordInput,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import OAuthButtons from "./auth/oauth-buttons";
import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "@/app/lib/db";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("")
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;

      const user = await prisma.profile.create({
        data: {
          username: username
        }
      })

      router.push("/auth/sign-up-success");
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
          <form onSubmit={handleSignUp}>
            <Paper
              withBorder
              shadow="md"
              p={22}
              mt={30}
              radius="md"
              className="flex! flex-col gap-2"
            >
              <ThemeIcon className="shadow-md" size="xl" radius="xl">
                <SparklesIcon width={16} height={16} />
              </ThemeIcon>
              <Text className="uppercase font-mono" c="dimmed">
                Welcome to Code2Connect
              </Text>
              <Title>Register</Title>
              {error}
              <TextInput
                label="Username"
                placeholder="Your username"
                required
                radius="md"
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextInput
                label="Email"
                description="If you're creating a student account, make sure to enter your school email. Otherwise, you may not be able to enroll into a class!"
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
              <PasswordInput
                label="Repeat password"
                placeholder="Repeat password"
                required
                mt="md"
                radius="md"
                id="repeat-password"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <Button
                fullWidth
                mt="xl"
                radius="sm"
                type="submit"
                loading={isLoading}
              >
                Register
              </Button>
              <OAuthButtons />
            </Paper>
          </form>
        </Container>
      </div>
    </div>
  );
}
