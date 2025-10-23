import {
  Avatar,
  Button,
  Collapse,
  Pagination,
  Spoiler,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import CommentComponent from "./comment";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Comment, Prisma, Profile, Project } from "@prisma/client";
import {
  createProjectComment,
  deleteProjectComment,
  togglePinProjectComment,
  deleteProjectCommentReply,
  createProjectCommentReply,
} from "@/app/lib/actions";
type CommentWithOwnerAndReplies = Prisma.CommentGetPayload<{
  include: {
    owner: true;
    replies: { include: { owner: true; Comment: true } };
  };
}>;
import CommentTextbox from "./comment-textbox";

export default function ProjectCommentModule({
  comments,
  currentUser,
  accessedProject,
  projectId,
  commentsPerPage,
  currentUsername,
}: {
  comments: CommentWithOwnerAndReplies[];
  currentUser: string;
  accessedProject: Project;
  projectId: string;
  commentsPerPage: number;
  currentUsername: string;
}) {
  const [comment, setComment] = useState("");
  const [openedReplies, setOpenedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [activePage, setActivePage] = useState(1);
  const COMMENTS_PER_PAGE = commentsPerPage;
  let commentsToDisplay = [];
  const pinnedCommentIndex = comments.findIndex((comment) => comment.isPinned);
  if (pinnedCommentIndex >= 0) {
    commentsToDisplay = [
      comments[pinnedCommentIndex],
      ...comments.slice(0, pinnedCommentIndex),
      ...comments.slice(pinnedCommentIndex + 1),
    ];
  } else {
    commentsToDisplay = [...comments];
  }

  const totalPages = Math.ceil(commentsToDisplay.length / COMMENTS_PER_PAGE);
  const startIndex = (activePage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const paginatedComments = commentsToDisplay.slice(startIndex, endIndex);

  function handleSubmitComment() {
    createProjectComment(projectId, currentUser, comment);
    setComment("");
  }

  function toggleReplies(commentId: string) {
    setOpenedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }

  return (
    <div>
      <Title order={4}>Add a comment</Title>
      <CommentTextbox
        value={comment}
        handleChangeValue={(newString: string) => setComment(newString)}
        handleSubmit={handleSubmitComment}
        profileUsername={currentUsername}
      />
      {paginatedComments.map((comment) => {
        console.log(`comment replies: ${comment.replies}`);
        return (
          <CommentComponent
            id={comment.id}
            username={comment.owner.username}
            content={comment.contents}
            dateCreated={comment.dateCreated}
            isCreator={currentUser === accessedProject.profileId}
            isWriter={currentUser === comment.profileId}
            pinned={comment.isPinned}
            handleDelete={() => deleteProjectComment(comment.id)}
            handleTogglePin={() =>
              togglePinProjectComment(comment.id, comment.isPinned)
            }
            handleReply={createProjectCommentReply}
            currentUserId={currentUser}
            currentUsername={currentUsername}
          >
            {comment.replies && comment.replies.length > 0 && (
              <div>
                <Button
                  variant="subtle"
                  size="compact-xs"
                  onClick={() => toggleReplies(comment.id)}
                >
                  {openedReplies[comment.id]
                    ? "Hide Replies"
                    : "Show Replies (" + comment.replies.length + ")"}
                </Button>
              </div>
            )}
            <Collapse in={!!openedReplies[comment.id]}>
              <Stack>
                {comment.replies &&
                  comment.replies.map((reply) => {
                    return (
                      <CommentComponent
                        id={reply.id}
                        username={reply.owner.username}
                        content={reply.contents}
                        dateCreated={reply.dateCreated}
                        isCreator={currentUser === accessedProject.profileId}
                        isWriter={currentUser === reply.profileId}
                        isReply={true}
                        handleDelete={() => deleteProjectCommentReply(reply.id)}
                        commentId={comment.id}
                        handleReply={createProjectCommentReply}
                        currentUserId={currentUser}
                        currentUsername={currentUsername}
                      />
                    );
                  })}
              </Stack>
            </Collapse>
          </CommentComponent>
        );
      })}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
          />
        </div>
      )}
    </div>
  );
}
