import { Text, Title } from "@mantine/core";
export default function Tutorials() {
  return (
    <div className="flex flex-col gap-2 justify-center pb-12">
      <div className="pt-24 pb-24 pl-12 pr-12 spacing-between gap-4 bg-gradient-to-b from-offblue-200 to-white flex flex-row">
        <div className="flex flex-col gap-4 justify-center text-center w-full">
          <Text className="uppercase" c="dimmed">
            Learn how to use Code2Connect
          </Text>
          <Title className="text-5xl! font-extrabold text-balance inline">
            <Text
              variant="gradient"
              gradient={{ from: "blue", to: "turquoise", deg: 90 }}
              inherit
              span
            >
              Tutorials
            </Text>{" "}
            to help you learn
          </Title>
          <p>
            Confused on a feature? Want to get started using Code2Connect?
            You&apos;re at the right place. We have guides on Code2Connect that
            help you get going in no time.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 pl-12 pr-12">
        <div>
          <Title order={2}>The user interface</Title>
          <p>Learn how to use the Code2Connect code editor.</p>
          <Title order={3}>File, Edit, and View</Title>
          <p>
            On the upper left hand of the editor, you&apos;ll see three buttons
            - File, Edit and View. <b>File</b> allows you to create new files
            (which will be saved to your computer), create new projects (this
            will not overwrite your changes to the current project), save to the
            cloud immediately, upload files from your computer (which will save
            to your computer), download the project (which will export all your
            project code into a ZIP file), and change the thumbnail.
          </p>
          <p>
            The <b>Edit</b> menu allows to undo and redo, and open the Find and
            Replace pane in the editor. Clicking undo and redo will give you
            instructions on which keys to press to undo and redo changes in your
            code.
          </p>
          <p>
            The <b>View</b> menu allows you to take your project output full
            screen.
          </p>
          <Title order={3}>The Files pane</Title>
          <p>
            This pane allows you to view the files in your project, add new
            files, and upload files. You can click the plus button to create a
            new file inside your project, and the upload button to upload a file
            from your computer. The maximum file size allowed is 50 megabytes.
          </p>
          <Title order={3}>The Description pane</Title>
          <p>
            This is where you can view and edit the description of your project.
            You can add information about your project, instructions and
            credits. Others will be able to view this when viewing your project
            code.
          </p>
          <Title order={3}>The Code editor</Title>
          <p>
            You can edit the current file selected inside the code editor. You
            can also run and stop your project. Note that running your project
            will run the main.py file. When you click the three dots near the
            file name, you can rename the current file, download the current
            file, and delete the file.
          </p>
          <Title order={3}>The Output pane</Title>
          <p>
            This is the output of your project code. When you run your project,
            you&apos;ll see the output of your Python code. You can click the
            fullscreen button to take your project output fullscreen.
          </p>
          <p>
            <b>Note that HTML may also be rendered inside the output.</b>{" "}
            Don&apos;t click on any links, enter any personal information, or
            press suspicious buttons inside the output pane.
          </p>
          <Title order={3}>Sharing and saving</Title>
          <p>
            On the upper right hand corner, you can save your project
            immediately, or click Share (or Unshare) to change the visbility of
            the project.
          </p>
          <p>
            If the Save button is white, it means that changes need to be saved
            to the cloud. If there is an outline, then your project is saved.
          </p>
        </div>
        <div>
          <Title order={2}>Your first Python code</Title>
          <p>
            When you create a new project, you&apos;ll see that code has already
            been created for you - <code>print(&apos;Hello, World!&apos;)</code>
            . This prints the line &quot;Hello, World!&quot; in the output pane.
          </p>
          <p>
            To print something in the output, type <code>print(&quot;</code>,
            followed by the text you want to print, then <code>&quot;)</code>.
          </p>
        </div>
        <div>
          <Title order={2}>Share your first project</Title>
          <p>
            First, go to your project page, and click &quot;See Inside to
            Run&quot;. Then, click &quot;Share&quot;, and &quot;Publish to the
            world&quot;. Your project will then be visible using the project URL
            or the search bar.
          </p>
          <p>
            At any time, you can click the Unshare button inside your project to
            make your project private.
          </p>
        </div>
        <div>
          <Title order={2}>Clusters</Title>
          <p>
            You can also add your project to a cluster. Clusters are groups of
            projects under a specific project. To do this, go to your project
            page, click &quot;Add to cluster&quot;, and paste the link to the
            cluster.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
