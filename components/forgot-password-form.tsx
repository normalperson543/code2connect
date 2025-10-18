"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  Container,
  Paper,
  TextInput,
  ThemeIcon,
  Title,
  Text,
  Button,
} from "@mantine/core";
import { ArrowRightIcon, CheckIcon, EnvelopeIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import WarningBanner from "./warning-banner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
              color={success ? "green" : ""}
              className="shadow-md"
              radius="xl"
              size="xl"
            >
              {success ? (
                <CheckIcon width={16} height={16} />
              ) : (
                <QuestionMarkCircleIcon width={16} height={16} />
              )}
            </ThemeIcon>
            <Text className="uppercase font-mono" c="dimmed">
              Get back into your account
            </Text>
            {success ? (
              <div className="flex flex-col gap-2">
                <Title>Email Sent</Title>
                <Text>
                  If this email address is associated with an account, you'll
                  receive an email to reset your password.
                </Text>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Title>Reset Password</Title>
                <Text>
                  If you forgot your password, enter your email and we'll try to
                  recover your password.
                </Text>
                {error && <WarningBanner>{error}</WarningBanner>}
                <form onSubmit={handleForgotPassword}>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftSection={<EnvelopeIcon width={16} height={16} />}
                  />
                  <Button
                    fullWidth
                    mt="xl"
                    radius="sm"
                    type="submit"
                    loading={isLoading}
                    leftSection={<ArrowRightIcon width={16} height={16} />}
                  >
                    Send reset email
                  </Button>
                </form>
              </div>
            )}
          </Paper>
        </Container>
      </div>
    </div>
  );
}
