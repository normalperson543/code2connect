"use client";

import { cn } from "@/lib/utils";
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
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  return (
    <div
      className={cn(
        "flex flex-row h-full w-full gap-6 bg-gradient-to-br from-offblue-100 to-offblue-700",
      )}
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
            <ThemeIcon className="shadow-md" radius="xl" size="xl" color="red">
              <XMarkIcon width={16} height={16} />
            </ThemeIcon>
            <div className="flex flex-col gap-2">
              <Title>Authentication Error</Title>
              <Text>
                Oops, looks like something went wrong. Please try logging in
                again.
              </Text>
              <p>
                {params?.error ? (
                  <p className="text-sm text-muted-foreground">
                    Code error: {params.error}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    An unspecified error occurred.
                  </p>
                )}
              </p>
              <Link href="/auth/login">
                <Button
                  fullWidth
                  mt="xl"
                  radius="sm"
                  type="submit"
                  leftSection={<ArrowLeftIcon width={16} height={16} />}
                >
                  Go back
                </Button>
              </Link>
            </div>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
