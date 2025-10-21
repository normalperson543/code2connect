import { Avatar, Button, Textarea, Title } from "@mantine/core";
import CommentComponent from "./comment";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Comment, Prisma, Profile } from "@prisma/client";
import {
  createProfileComment,
  togglePinProfileComment,
} from "@/app/lib/actions";
type CommentWithOwner = Prisma.CommentGetPayload<{ include: { owner: true } }>;
import { deleteProfileComment } from "@/app/lib/actions";

export default function CommentModule({
  comments,
  currentUser,
  accessedProfile,
  accessedUsername,
}: {
  comments: CommentWithOwner[];
  currentUser: string;
  accessedProfile: Profile;
  accessedUsername: string;
}) {
  const [comment, setComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);

  function handleSubmitComment() {
    console.log("current user: " + currentUser);
    console.log("accessedprofile id: " + accessedProfile.id);
    createProfileComment(
      currentUser,
      accessedProfile.id,
      comment,
      accessedUsername
    );
    setComment("");
  }

  function handleDeleteComment(id: string) {}

  return (
    <div>
      <Title order={4}>Add a comment</Title>
      <div className="flex flex-row gap-2 w-full mt-2">
        <Avatar src="" size="md" />
        <div className="flex flex-col gap-2 w-full">
          <Textarea
            w="100%"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <div className="flex flex-row gap-2 w-full">
            <Button
              leftSection={<PaperAirplaneIcon width={16} height={16} />}
              onClick={(e) => handleSubmitComment()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <div></div>

      {comments.map((comment) => {
        return (
          <CommentComponent
            id={comment.id}
            username={comment.owner.username}
            content={comment.contents}
            dateCreated={comment.dateCreated}
            isCreator={currentUser === comment.targetId}
            isWriter={currentUser === comment.profileId}
            handleDelete={() => deleteProfileComment(comment.id)}
            handleTogglePin={() =>
              togglePinProfileComment(comment.id, comment.isPinned)
            }
          />
        );
      })}

      <CommentComponent
        id="570abbc9-b1e1-456f-9fbf-559c584faf73"
        username="normalperson543"
        profilePicture=""
        content="This is a comment."
        dateCreated={new Date()}
        pinned
        isCreator
        handleDelete={() => {}}
        handleReport={() => {}}
        handleTogglePin={() => {}}
      >
        <CommentComponent
          id="570abbc9-b1e1-456f-9fbf-559c584faf73"
          username="normalperson543"
          profilePicture=""
          content="This is a reply!"
          dateCreated={new Date()}
          pinned
          isCreator
          handleDelete={() => {}}
          handleReport={() => {}}
          handleTogglePin={() => {}}
        ></CommentComponent>
      </CommentComponent>
      {}
    </div>
  );
}
