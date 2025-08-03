"use client";
import { Avatar, Title, Text, Anchor } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export default function Comment({
  username,
  profilePicture,
  content,
  dateCreated,
}: {
  username: string;
  profilePicture: string;
  content: string;
  dateCreated: Date;
}) {
  return (
    <div className="flex flex-row gap-2 w-full">
      <Avatar src={profilePicture} size="md" />
      <div className="flex flex-col gap-1  bg-[var(--mantine-color-gray)]">
        <Link href={`/profile/${username}`}>
          <Anchor component="button">
            <Title order={5}>{username}</Title>
          </Anchor>
        </Link>
        <Text>{content}</Text>
        <Text c="dimmed">{dateCreated.toLocaleString()}</Text>
      </div>
    </div>
  );
}
