"use client";

import { Title, Text, Paper, TextInput, Button } from "@mantine/core";
import MiniClass from "./mini-class";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function StudentEduDashboardUI() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-3/4">
          <Title order={3}>Hi, normalperson543!</Title>
          <Text c="dimmed">
            You're logged into a student account, so your experience is
            optimized for students. Click on <b>Return to Code2Connect</b> to
            return to the community site.
          </Text>
          <Text c="dimmed">
            <em>Your account is managed by: Centennial HS</em>
          </Text>
        </div>
        <div className="w-1/4">
          <Title order={4}>Join a class</Title>
          <Text>If your teacher gave you a class code, enter it here.</Text>
          <Paper shadow="md" p="sm" radius="sm" withBorder>
            <div className="flex flex-col gap-2">
              <TextInput
                label="Class code"
                maxLength={6}
                styles={{
                  input: {
                    fontFamily: "'Roboto Mono', monospace",
                    textAlign: "center",
                  },
                }}
              />
              <Button leftSection={<ArrowRightIcon width={16} height={16} />}>
                Enroll
              </Button>
            </div>
          </Paper>
        </div>
      </div>

      <Title order={3}>Classes</Title>
      <div className="flex flex-row gap-2 flex-wrap">
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
        <MiniClass
          imageSrc="/assets/default-class-cover.jpg"
          name="959847 - Intro to Programming - Doe P2"
          teacherName="J. Doe"
        />
      </div>
    </div>
  );
}
