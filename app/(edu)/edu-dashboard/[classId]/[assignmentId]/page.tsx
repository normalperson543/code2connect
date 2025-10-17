import EduAssignmentUI from "@/components/edu/assignment/edu-assignment";

export default function EduAssignment() {
  return (
    <EduAssignmentUI
      assignmentName="Hello, World!"
      assignmentState={0}
      instructions="Welcome to the Intro to Programming class."
      templateProject={{
        name: "Guess the Number",
        projectId: "a",
        owner: {
          username: "normalperson543",
        },
        likes: 69,
        featured: false,
        thumbnail: "/assets/default-image.png",
      }}
      possiblePoints={10}
      finalGrade={8}
      studentSubmissionProject={{
        name: "Guess the Number",
        projectId: "a",
        owner: {
          username: "normalperson543",
        },
        likes: 69,
        featured: false,
        thumbnail: "/assets/default-image.png",
      }}
    />
  );
}
