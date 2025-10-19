import { Avatar, Button, Textarea, Title } from "@mantine/core";
import CommentComponent from "./comment";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Comment, Profile } from "@prisma/client";

export default function CommentModule({comments, currentUser, accessedProfile} : {comments: Comment[], currentUser: string, accessedProfile: Profile}) {
  const [comment, setComment] = useState("")

  async function createComment() {
    
  }

  return (
    <div>
      <Title order={4}>Add a comment</Title>
      <div className="flex flex-row gap-2 w-full mt-2">
        <Avatar src="" size="md" />
        <div className="flex flex-col gap-2 w-full">
          <Textarea w="100%" rows={3} value={comment} onChange={(e) => setComment(e.currentTarget.value)} />
          <div className="flex flex-row gap-2 w-full">
            <Button leftSection={<PaperAirplaneIcon width={16} height={16} />}>
              Send
            </Button>
          </div>
        </div>
      </div>
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
      />
      {}
    </div>
  );
}
