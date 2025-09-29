import { Avatar, Button, Textarea, Title } from "@mantine/core";
import Comment from "./comment";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function CommentModule() {
  return (
    <div>
      <Title order={4}>Add a comment</Title>
      <div className="flex flex-row gap-2 w-full">
        <Avatar src="" size="md" />
        <div className="flex flex-col gap-2 w-full">
          <Textarea w="100%" rows={3} />
          <div className="flex flex-row gap-2 w-full">
            <Button leftSection={<PaperAirplaneIcon width={16} height={16} />}>
              Send
            </Button>
          </div>
        </div>
      </div>
      <Comment
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
    </div>
  );
}
