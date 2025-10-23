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
import { Cluster, Comment, Prisma, Profile, Project } from "@prisma/client";
type CommentWithOwnerAndReplies = Prisma.CommentGetPayload<{
  include: {
    owner: true;
    replies: { include: { owner: true; Comment: true } };
  };
}>;
import CommentTextbox from "./comment-textbox";

export default function CommentModule({
  comments,
  currentUser,
  accessedProfile,
  accessedProject,
  accessedCluster,
  commentsPerPage,
  currentUsername,
  handleCreateComment,
  handleDeleteComment,
  handleCreateCommentReply,
  handleDeleteCommentReply,
  handlePinComment,
}: {
  comments: CommentWithOwnerAndReplies[];
  currentUser: string;
  accessedProfile?: Profile;
  accessedProject?: Project;
  accessedCluster?: Cluster;
  commentsPerPage: number;
  currentUsername: string;
  handleCreateComment: (commentOwnerId: string, commentTargetId: string, content: string) => void;
  handleDeleteComment: (id: string) => void;
  handleCreateCommentReply: (commentId: string, replierId: string, content: string) => void;
  handleDeleteCommentReply: (id: string) => void;
  handlePinComment: (commentId: string, currentPinStatus: boolean) => void;
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
    if(accessedProfile) {
      handleCreateComment(currentUser, accessedProfile.id, comment)
    } else if (accessedProject) {
      handleCreateComment(currentUser, accessedProject.id, comment)
    } else if (accessedCluster) {
      handleCreateComment(currentUser, accessedCluster.id, comment)
    } else {
      throw new Error("Could not get profile, project, or cluster when making comment.")
    }
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
            isCreator={accessedProfile ? currentUser === comment.targetId : 
                      accessedProject ? currentUser === accessedProject.profileId:
                      currentUser === accessedCluster?.profileId
            }
            pinned={comment.isPinned}
            handleDelete={() => handleDeleteComment(comment.id)}
            handleTogglePin={() =>
              handlePinComment(comment.id, comment.isPinned)
            }
            handleReply={handleCreateCommentReply}
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
                        isCreator={accessedProfile ? currentUser === reply.Comment?.targetId :
                                  accessedProject ? currentUser === accessedProject.profileId :
                                  currentUser === accessedCluster?.profileId
                        }
                        isReply={true}
                        handleDelete={() => handleDeleteCommentReply(reply.id)}
                        commentId={comment.id}
                        handleReply={handleCreateCommentReply}
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
