"use client";
import {
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { TagIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Title,
  Text,
  Anchor,
  Badge,
  Menu,
  Button,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import CommentTextbox from "./comment-textbox";

export default function Comment({
  id,
  username,
  profilePicture,
  content,
  dateCreated,
  pinned = false,
  isCreator = false,
  isReply = false,
  handleDelete,
  handleReport,
  handleTogglePin,
  handleReply,
  children,
  currentUserId,
  commentId,
  currentUsername,
}: {
  id: string;
  username: string;
  profilePicture?: string;
  content: string;
  dateCreated: Date;
  pinned?: boolean;
  isCreator?: boolean;
  isWriter?: boolean;
  isReply?: boolean;
  handleDelete: (id: string) => void;
  handleReport?: (id: string) => void;
  handleTogglePin?: (id: string) => void;
  handleReply: (id: string, replier: string, text: string) => void;
  children?: React.ReactNode;
  currentUserId: string;
  commentId?: string;
  currentUsername: string;
}) {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  function deleteModal() {
    modals.openConfirmModal({
      title: `Delete ${username}'s comment?`,
      children: (
        <Text size="sm">
          Are you sure you would like to delete {username}&apos;s comment? This
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Yes, delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(id),
    });
  }
  function reportModal() {
    modals.openConfirmModal({
      title: `Report ${username}'s comment?`,
      children: (
        <Text size="sm">
          Are you sure you would like to report {username}&apos;s comment?
        </Text>
      ),
      labels: { confirm: "Yes, report", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleReport && handleReport(id),
    });
  }
  function pinModal() {
    modals.openConfirmModal({
      title: `Pin ${username}'s comment?`,
      children: (
        <Text size="sm">
          Are you sure you would like to pin {username}&apos;s comment?
        </Text>
      ),
      labels: { confirm: "Yes, pin", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleTogglePin && handleTogglePin(id),
    });
  }
  function unpinModal() {
    modals.openConfirmModal({
      title: `Unpin ${username}'s comment?`,
      children: (
        <Text size="sm">
          Are you sure you would like to Unpin {username}&apos;s comment?
        </Text>
      ),
      labels: { confirm: "Yes, unpin", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleTogglePin && handleTogglePin(id),
    });
  }
  async function handleSubmitReply() {
    setIsSending(true);
    if (isReply) {
      if (!commentId) {
        throw new Error(
          "Could not get parent comment id when replying to a reply",
        );
      }
      handleReply(commentId, currentUserId, replyContent);
    } else {
      handleReply(id, currentUserId, replyContent);
    }
    setReplyContent("");
    setReplying(false);
    setIsSending(false);
  }

  function handleStopReplying() {
    setReplying(false);
  }
  return (
    <div>
      <div className="flex flex-row gap-2 w-full">
        <Avatar src={profilePicture} name={username} size="md" />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 items-center">
              <Link href={`/profile/${username}`}>
                <Anchor component="button">
                  <Title order={5}>{username}</Title>
                </Anchor>
              </Link>
              {pinned && (
                <Badge leftSection={<TagIcon width={12} height={12} />}>
                  Pinned
                </Badge>
              )}
            </div>
            <div>
              <Menu position="bottom-end">
                <Menu.Target>
                  <Button color="light" variant="subtle">
                    <EllipsisHorizontalIcon width={16} height={16} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {!replying && (
                    <Menu.Item
                      leftSection={
                        <ArrowUturnLeftIcon width={16} height={16} />
                      }
                      onClick={() => setReplying(!replying)}
                    >
                      Reply
                    </Menu.Item>
                  )}

                  {isCreator && !isReply && (
                    <>
                      <Menu.Item
                        leftSection={<TagIcon width={16} height={16} />}
                        onClick={pinned ? unpinModal : pinModal}
                      >
                        {pinned ? "Unpin" : "Pin"}
                      </Menu.Item>
                    </>
                  )}
                  {isCreator && (
                    <>
                      <Menu.Item
                        leftSection={<TrashIcon width={16} height={16} />}
                        color="red"
                        onClick={deleteModal}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Item
                    leftSection={
                      <ExclamationTriangleIcon width={16} height={16} />
                    }
                    color="red"
                    onClick={reportModal}
                  >
                    Report
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>

          <Text>{content}</Text>
          <Text c="dimmed">{dateCreated.toLocaleString()}</Text>
          <div className="pl-4 flex flex-col gap-2">
            {replying && (
              <>
                <Title order={5}>Reply</Title>
                <CommentTextbox
                  value={replyContent}
                  handleChangeValue={(newString: string) =>
                    setReplyContent(newString)
                  }
                  handleSubmit={handleSubmitReply}
                  profileUsername={currentUsername}
                  stopReplying={true}
                  handleStopReplying={handleStopReplying}
                  sending={isSending}
                />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
