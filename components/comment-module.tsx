import { Avatar, Button, Textarea, Title } from "@mantine/core";
import CommentComponent from "./comment";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Comment, Prisma, Profile } from "@prisma/client";
import {
  createProfileComment,
  deleteProfileCommentReply,
  togglePinProfileComment,
} from "@/app/lib/actions";
type CommentWithOwnerAndReplies = Prisma.CommentGetPayload<{ include: { owner: true, replies: { include: {owner: true, Comment: true}} } }>;
import { deleteProfileComment } from "@/app/lib/actions";
import { getCommentReplies } from "@/app/lib/data";
import CommentTextbox from "./comment-textbox";

export default function CommentModule({
  comments,
  currentUser,
  accessedProfile,
  accessedUsername,
}: {
  comments: CommentWithOwnerAndReplies[];
  currentUser: string;
  accessedProfile: Profile;
  accessedUsername: string;
}) {
  const [comment, setComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  let commentsToDisplay = []
  const pinnedCommentIndex = comments.findIndex(comment => comment.isPinned)
  const pinnedComment = comments[pinnedCommentIndex]
  if(pinnedCommentIndex >= 0) {
    commentsToDisplay = [
      comments[pinnedCommentIndex],
      ...comments.slice(0, pinnedCommentIndex),
      ...comments.slice(pinnedCommentIndex + 1)
    ]
  } else {
    commentsToDisplay = [...comments];
  }

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
      <CommentTextbox
        value={comment}
        handleChangeValue={(newString: string) => setComment(newString)}
        handleSubmit={handleSubmitComment}
      />
      {commentsToDisplay.map((comment) => {
        console.log(`comment replies: ${comment.replies}`)
        return (
          <CommentComponent
            id={comment.id}
            username={comment.owner.username}
            content={comment.contents}
            dateCreated={comment.dateCreated}
            isCreator={currentUser === comment.targetId}
            isWriter={currentUser === comment.profileId}
            pinned={comment.isPinned}
            handleDelete={() => deleteProfileComment(comment.id)}
            handleTogglePin={() =>
              togglePinProfileComment(comment.id, comment.isPinned)
            }
          >
            {comment.replies && comment.replies.map((reply) => {
              return (
                <CommentComponent
                  id={reply.id}
                  username={reply.owner.username}
                  content={reply.contents}
                  dateCreated={reply.dateCreated}
                  isCreator={currentUser === reply.Comment?.targetId}
                  isWriter={currentUser === reply.profileId}
                  isReply={true}
                  handleDelete={() => deleteProfileCommentReply(reply.id)}
                />
              )
            })}
          </CommentComponent>
          
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
