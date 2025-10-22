import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Textarea } from "@mantine/core";

export default function CommentTextbox({
  value,
  handleChangeValue,
  handleSubmit,
  profileUsername,
  profilePfpSrc,
}: {
  value: string;
  handleChangeValue: (newString: string) => void;
  handleSubmit: () => void;
  profileUsername: string;
  profilePfpSrc?: string;
}) {
  return (
    <div className="flex flex-row gap-2 w-full mt-2">
      <Avatar src={profilePfpSrc} name={profileUsername} size="md" />
      <div className="flex flex-col gap-2 w-full">
        <Textarea
          w="100%"
          rows={3}
          value={value}
          onChange={(e) => handleChangeValue(e.currentTarget.value)}
        />
        <div className="flex flex-row gap-2 w-full">
          <Button
            leftSection={<PaperAirplaneIcon width={16} height={16} />}
            onClick={(e) => handleSubmit()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
