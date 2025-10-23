import { Divider, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import signInWithGoogle from "@/app/lib/oauth";
export default function OAuthButtons() {
  return; // until we fix OAuth for google, this will not be rendered :(

  return (
    <div className="flex flex-col gap-2">
      <Divider orientation="horizontal" />
      <Text c="dimmed" className="text-center">
        Or, sign in with your social platform
      </Text>
      <div className="flex flex-row gap-2 items-center justify-center">
        <UnstyledButton onClick={signInWithGoogle}>
          <Image
            src="/assets/continue-with-google.svg"
            alt="Continue with Google"
            width={192}
            height={192}
          />
        </UnstyledButton>
      </div>
    </div>
  );
}
