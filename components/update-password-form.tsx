"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckIcon,
  Container,
  Paper,
  ThemeIcon,
  Title,
  Text,
  TextInput,
  Button,
} from "@mantine/core";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      if ((error as Error).message  === "Auth session missing!") {
        setError("Whoops, looks like you need to authenticate first.")
      }
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row h-full w-full gap-6 bg-gradient-to-br from-offblue-100 to-offblue-900",
        className
      )}
      {...props}
    >
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
            <ThemeIcon className="shadow-md" radius="xl" size="xl">
              <QuestionMarkCircleIcon width={16} height={16} />
            </ThemeIcon>
            <Text className="uppercase font-mono" c="dimmed">
              Update your account information
            </Text>
            <div className="flex flex-col gap-2">
              <Title>Reset Password</Title>
              <Text>
                Please enter your new password below, and make sure you remember
                it!
              </Text>
              {error}
              <form onSubmit={handleForgotPassword}>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Be sure to set a secure password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  fullWidth
                  mt="xl"
                  radius="sm"
                  type="submit"
                  loading={isLoading}
                  leftSection={<CheckIcon width={16} height={16} />}
                >
                  Reset password
                </Button>
              </form>
            </div>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
