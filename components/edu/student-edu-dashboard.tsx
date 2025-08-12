'use client'

import { Title, Text } from "@mantine/core"

export default function StudentEduDashboardUI() {
  return (
    <div className="flex flex-col gap-2">
      <Title order={3}>
        👋 Hi, normalperson543!
      </Title>
      <Text c="dimmed">You're logged into a student account, so your experience is optimized for students. Click on <b>Return to Code2Connect</b> to return to the community site.</Text>
    </div>
  )
}