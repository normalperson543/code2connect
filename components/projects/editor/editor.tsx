"use client";

import {
  Anchor,
  AppShell,
  Avatar,
  Badge,
  Burger,
  Button,
  ButtonGroup,
  Divider,
  Kbd,
  LoadingOverlay,
  Menu,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import styles from "./editor.module.css";
import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3CenterLeftIcon,
  CheckIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  DocumentIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FaceSmileIcon,
  GlobeAmericasIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PencilSquareIcon,
  PlayIcon,
  PlusCircleIcon,
  PlusIcon,
  ShareIcon,
  StopIcon,
  TrashIcon,
  WindowIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CodeEditor from "./code-editor";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { FileInfo, Files } from "@/app/lib/files";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import RenameModal from "../../modals/rename-modal";
import FileSaver from "file-saver";
import NewFileModal from "../../modals/new-file-modal";
import download from "@/app/lib/downloader";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { UserPlusIcon } from "lucide-react";
import { EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import UndoRedoModal from "../../modals/undo-redo-modal";
import CtrlCmd from "../../ctrl-cmd";
import { openSearchPanel } from "@codemirror/search";
import domtoimage from "dom-to-image";
import StoppedProject from "../../stopped-project";
import { useDisclosure, useForceUpdate } from "@mantine/hooks";
import { createClient } from "@/lib/supabase/client";
import { ProjectSessionToken } from "@prisma/client";
import {
  getFirstProjectSession,
  getProjectFiles,
  getProjectSession,
  newProjectSession,
  renewProjectSession,
} from "@/app/lib/data";
import moment from "moment";
import Image from "next/image";
import RenameProjectModal from "@/components/modals/rename-project-modal";
import { createProject, renameProject } from "@/app/lib/actions";

function getExtension(filename: string) {
  const splitFn = filename.split(".");
  return splitFn[splitFn.length - 1];
}
function SidebarFile({
  desc,
  name,
  selected,
  onClick,
  onDeleteConfirm,
  onRename,
  onDownload,
}: {
  desc?: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
  onDeleteConfirm?: () => void;
  onRename?: () => void;
  onDownload?: () => void;
}) {
  const [contextMenuShown, setContextMenuShown] = useState(false);
  return (
    <div
      className={`p-1 w-full flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-offblue-50`}
      onClick={onClick}
      onContextMenu={() => setContextMenuShown(true)}
    >
      <div className="flex flex-row w-full gap-2 items-center">
        <CodeBracketIcon width={16} height={16} />
        <div className="flex flex-row">
          {desc && (
            <div className="flex flex-row gap-2">
              <Text fw={700}>{desc} </Text> <Text>(</Text>
            </div>
          )}
          <Text fw={400}>{name}</Text>
          {desc && <Text>)</Text>}
        </div>
      </div>
      <Menu>
        <Menu.Target>
          <div>
            <EllipsisVerticalIcon width={16} height={16} />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<PencilIcon width={16} height={16} />}
            onClick={onRename}
          >
            Rename
          </Menu.Item>
          <Menu.Item
            leftSection={<ArrowDownTrayIcon width={16} height={16} />}
            onClick={onDownload}
          >
            Download
          </Menu.Item>
          <Menu.Item
            leftSection={<TrashIcon width={16} height={16} />}
            color="red"
            onClick={onDeleteConfirm}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
export default function Editor({
  creatorImageSrc,
  creator,
  canEditInfo,
  description: dbDesc,
  previewUrl,
  id,
  title: dbTitle,
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  description: string;
  previewUrl: string;
  id: string;
  title: string;
}) {
  const outputFrame = useRef<HTMLIFrameElement>(null);
  const [description, setDescription] = useState(dbDesc);
  const [title, setTitle] = useState(dbTitle);
  const [files, setFiles] = useState<Files>({});
  const [currentFile, setCurrentFile] = useState(Object.keys(files)[0]);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date>();
  const dropzoneRef = useRef<() => void>(null);
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const [outputFullScreened, setOutputFullScreened] = useState(false);
  const [currThumb, setCurrThumb] = useState<Blob>();
  const [isStopped, setIsStopped] = useState(true);
  const [thumbUrl, setThumbUrl] = useState("");
  const [filesLoaded, setFilesLoaded] = useState(false); // TODO: fix behavior
  const [opened, { toggle }] = useDisclosure();
  const forceUpdate = useForceUpdate();
  const [activeSession, setActiveSession] = useState<ProjectSessionToken>();
  const [isStarting, setIsStarting] = useState(false);

  let frameSrc = "";

  const supabase = createClient();

  async function loadFiles() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    let fileArr: (
      | string
      | {
          name: string;
          contents: string;
        }
    )[][] = [];

    const { data: projectFiles } = await getProjectFiles(userId as string, id);

    console.log(projectFiles);
    if (!projectFiles || projectFiles.length === 0) setFilesLoaded(true);
    projectFiles?.forEach(async (file) => {
      if (!(file.name === ".emptyFolderPlaceholder")) {
        console.log(file);
        const { data: dataUrl } = supabase.storage
          .from("projects")
          .getPublicUrl(`/${userId}/${id}/${file.name}`);
        console.log("Fetching...");
        const fileContents = await fetch(
          `${dataUrl.publicUrl}?cache=${Math.random()}`,
          { cache: "no-store" }
        );
        console.log("Fetching complete!");
        let tempFileArr = [
          file.id,
          { name: file.name, contents: await fileContents.text() },
        ];
        console.log(tempFileArr);
        fileArr.push(tempFileArr);
        setFiles(Object.fromEntries(fileArr));
        console.log(fileArr.length);
        console.log(projectFiles.length);
        if (fileArr.length === projectFiles.length) {
          console.log("Done");
          setFilesLoaded(true);
        }
      }
    });
  }
  async function saveThumbnail() {
    console.log("Saving thumb");
    const dataUrl = await domtoimage.toPng(
      cmRef.current?.editor as HTMLElement
    );
    console.log("Done saving");
  }
  async function handleDelete(file: FileInfo) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    console.log("Deleting");
    console.log(file);
    try {
      const supabase = await createClient();
      const err = await supabase.storage
        .from("projects")
        .remove([`${userId}/${id}/${file.name}`]);
      if (err.error) {
        console.error(err);
        saveError(err.error?.message as string);
      }
      console.log("Deleted.");
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        saveError(e.message);
      } else {
        saveError("Unknown error");
      }
    }
  }
  function saveError(err: string) {
    popupError(
      "Your project did not save",
      "Check your Internet connection, and try again later.",
      err
    );
  }
  function popupError(title: string, message: string, err: string) {
    console.error(`${title}: ${message}`);
    console.error(err);
    notifications.show({
      position: "top-center",
      withCloseButton: true,
      autoClose: false,
      title: title,
      message: `${message} | Error info: ${err}`,
      color: "red",
      icon: <XMarkIcon />,
    });
  }
  async function handleSave() {
    setIsSaving(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;

    try {
      const fileArr = Object.entries(files);
      fileArr.forEach(async (file) => {
        const err = await supabase.storage
          .from("projects")
          .upload(`/${userId}/${id}/${file[1].name}`, file[1].contents, {
            upsert: true,
          });
        if (err.error) {
          saveError(err.error?.message as string);
        }
      });
      notifications.clean();
      setIsChanged(false);
      setLastSave(new Date());
      forceUpdate();
    } catch (e) {
      if (e instanceof Error) {
        saveError(e.message);
      }
      saveError("Unknown error");
    }
    setIsSaving(false);
  }
  const debounceSave = useDebouncedCallback(() => {
    handleSave();
  }, 2000);

  async function handleChangeTitle(newTitle: string) {
    setIsChanged(true);
    setTitle(newTitle);
    try {
      await renameProject(id, newTitle);
    } catch (error: unknown) {
      popupError(
        "Couldn't rename your project",
        "",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
  function handleChangeDescription(newDesc: string) {
    setIsChanged(true);
    setDescription(newDesc);
    debounceSave();
  }
  function handleChangeCurrentFile(newContent: string) {
    let newFiles = files;
    newFiles[currentFile].contents = newContent;
    setFiles(newFiles);
    setIsChanged(true);
    debounceSave();
  }
  function handleSwitchFile(id: string) {
    setCurrentFile(id);
  }
  function deleteFile(id: string) {
    let newFiles = files;
    handleDelete(files[id]);
    delete newFiles[id];
    console.log("okay I deleted it from the new dataset");
    setFiles(newFiles);
    console.log(files);
    setCurrentFile("");
    forceUpdate();
  }
  function checkDuplicateNames(id: string, name: string) {
    console.log("checking");
    let isDuplicate = false;
    Object.entries(files).forEach((file) => {
      if (file[1].name.toLowerCase() == name.toLowerCase() && file[0] !== id) {
        isDuplicate = true;
      }
    });
    console.log("I'm returning FALSE");
    return isDuplicate;
  }
  function renameFile(id: string, newName: string) {
    let unduplicatedName = newName;
    if (unduplicatedName.replace(/\s/g, "").length === 0) {
      //https://stackoverflow.com/questions/10800355/remove-whitespaces-inside-a-string-in-javascript
      unduplicatedName = "file";
    }
    console.log("r");
    console.log(checkDuplicateNames(id, unduplicatedName));
    while (checkDuplicateNames(id, unduplicatedName)) {
      console.log("b");
      let splitName = unduplicatedName.split(".");
      splitName[0] += " copy";
      unduplicatedName = splitName.join(".");
      console.log("beep");
      console.log(splitName.join("."));
    }
    let newFiles = files;
    newFiles[id].name = unduplicatedName;
    setFiles(newFiles);
    setIsChanged(true);
    debounceSave();
  }
  function createFile(filename: string, contents: string = "") {
    let unduplicatedName = filename;
    if (unduplicatedName.replace(/\s/g, "").length === 0) {
      //https://stackoverflow.com/questions/10800355/remove-whitespaces-inside-a-string-in-javascript
      unduplicatedName = "file";
    }
    console.log("r");
    console.log(checkDuplicateNames(id, unduplicatedName));
    while (checkDuplicateNames(id, unduplicatedName)) {
      console.log("b");
      let splitName = unduplicatedName.split(".");
      splitName[0] += " copy";
      unduplicatedName = splitName.join(".");
      console.log("beep");
      console.log(splitName.join("."));
    }
    let newFiles = files;
    const uuid = crypto.randomUUID();
    newFiles[uuid] = { name: unduplicatedName, contents: contents };
    setFiles(newFiles);
    setIsChanged(true);
    debounceSave();
  }
  function deleteConfirm(id: string) {
    modals.openConfirmModal({
      title: `Delete ${files[id].name}?`,
      children: (
        <Text size="sm">
          Are you sure you would like to delete the file {files[id].name}? This
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Yes, delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteFile(id),
    });
  }
  function renameModal(id: string) {
    modals.open({
      title: `Rename ${files[id].name}`,
      children: (
        <RenameModal
          defaultValue={files[id].name}
          onComplete={(newName: string) => renameFile(id, newName)}
        />
      ),
    });
  }
  function newFileModal() {
    modals.open({
      title: "New file",
      children: (
        <NewFileModal onComplete={(newName: string) => createFile(newName)} />
      ),
    });
  }
  function undoRedoModal() {
    //undo({state: cmRef.current?.state as EditorState, dispatch: (t) => cmRef.current?.view?.dispatch(t)})
    modals.open({
      title: "How to undo and redo",
      children: <UndoRedoModal />,
    });
  }
  function renameProjectModal() {
    modals.open({
      title: "Rename project",
      children: (
        <RenameProjectModal
          defaultValue={title}
          onComplete={(newName: string) => {
            handleChangeTitle(newName);
          }}
        />
      ),
    });
  }
  async function refreshPreview() {
    setIsStopped(false);
    setIsStarting(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;

    let session = activeSession;
    if (moment(new Date()).isAfter(moment(activeSession?.date).add("0", "m"))) {
      //validate session ID
      console.log("Renewing");
      const renewedSession = await renewProjectSession(id);
      setActiveSession(renewedSession);
      console.log("Renewed!");
      console.log(renewedSession);
      session = renewedSession;
      forceUpdate();
    }
    console.log("Moving on");
    console.log(session);
    frameSrc = `${previewUrl}/?project=${id}&user=${userId}&session=${session?.id}`;
    console.log(frameSrc);
    if (outputFrame.current) {
      const frame = outputFrame.current as HTMLIFrameElement;
      frame.src = frameSrc;
      frame.src = frame.src;
    }
    setIsStarting(false);
  }
  function saveFile(id: string) {
    const file = new File([files[id].contents], files[id].name, {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(file);
  }
  function handleDrop(dropped: FileWithPath[]) {
    dropped.forEach((file) => {
      const reader = new FileReader(); //https://react-dropzone.js.org/

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const data = reader.result;
        createFile(file.name, data as string);
      };
      reader.readAsText(file);
    });
  }
  async function stop() {
    setIsStopped(true);
  }

  async function syncSession() {
    // TODO: Add logic to validate if project owner is correct
    // This code will only run if:
    // A) the code is private, and
    // B) the owner or mods are viewing the project.
    // This is to allow the runner to only download files
    // pertaining to that session.
    const session = await getFirstProjectSession(id); // gets recent project sessions
    if (session) {
      const newSession = await renewProjectSession(id);
      setActiveSession(newSession);
    } else {
      const newSession = await newProjectSession(id);
      setActiveSession(newSession);
    }
  }

  useEffect(() => {
    syncSession();
    loadFiles();
    return;
  }, []);

  return (
    <AppShell
      header={{ height: 78 }}
      padding={12}
      navbar={{ width: 300, breakpoint: 768, collapsed: { mobile: !opened } }}
    >
      <AppShell.Header zIndex={49}>
        <div className="flex items-center gap-2 flex-row p-3 bg-offblue-800 text-white">
          <div className={styles.headerLeft}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <div className="hidden items-center flex-row gap-2 md:flex">
              <Image
                src="/assets/logo-white.svg"
                width={48}
                height={48}
                alt="Code2Connect logo"
              />
              <Divider orientation="vertical" />
              <Avatar src={creatorImageSrc} size="md" />
              <div className={styles.userInfo}>
                <div className="flex flex-row gap-2">
                  <Title order={5}>{title}</Title>
                  <UnstyledButton onClick={renameProjectModal}>
                    <PencilSquareIcon width={16} height={16} />
                  </UnstyledButton>
                </div>
                <Text>
                  by{" "}
                  <Link href={`/profile/${creator}`} target="_blank">
                    <Anchor component="button" c="white">
                      {creator}
                    </Anchor>
                  </Link>
                </Text>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <Tooltip
              label={
                lastSave
                  ? `Last saved ${lastSave.toLocaleTimeString()}`
                  : "Last saved never"
              }
            >
              <Button
                leftSection={<CloudArrowUpIcon width={16} height={16} />}
                loading={isSaving}
                onClick={handleSave}
                disabled={isSaving}
                variant={isChanged ? "white" : "outline"}
                color={isChanged ? "" : "white"}
              >
                Save
              </Button>
            </Tooltip>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button
                  color="orange.3"
                  leftSection={<ShareIcon width={16} height={16} />}
                  autoContrast
                >
                  Share
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<GlobeAmericasIcon width={16} height={16} />}
                >
                  Publish to the world
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Education</Menu.Label>
                <Menu.Item
                  leftSection={<UserPlusIcon width={16} height={16} />}
                >
                  Add collaborator from your class
                </Menu.Item>
                <Menu.Item
                  leftSection={<AcademicCapIcon width={16} height={16} />}
                >
                  Send to teacher
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Link href={`/projects/${id}`}>
              <Button
                variant="white"
                autoContrast
                leftSection={<EyeIcon width={16} height={16} />}
              >
                Preview Public Page
              </Button>
            </Link>
          </div>
        </div>
      </AppShell.Header>
      <AppShell.Navbar zIndex={51} className="bg-[var(--c2c-dark-off-blue)]!">
        <div className="flex flex-col gap-2 p-2 h-full">
          <AppShell.Section>
            <div className="flex-1">
              <Menu shadow="md" width={200} position="bottom-start">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    leftSection={<DocumentIcon width={16} height={16} />}
                  >
                    File
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<PlusIcon width={16} height={16} />}
                    onClick={newFileModal}
                  >
                    New file
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<PlusIcon width={16} height={16} />}
                    onClick={createProject}
                  >
                    New project
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<CloudArrowUpIcon width={16} height={16} />}
                    onClick={handleSave}
                  >
                    Save to the cloud
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<ArrowUpTrayIcon width={16} height={16} />}
                    onClick={() => dropzoneRef.current?.()}
                  >
                    Upload file
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<ArrowDownTrayIcon width={16} height={16} />}
                    onClick={() => download(files, title)}
                  >
                    Download project
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu shadow="md" position="bottom-start">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    leftSection={<PencilIcon width={16} height={16} />}
                  >
                    Edit
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<ArrowUturnLeftIcon width={16} height={16} />}
                    onClick={undoRedoModal}
                    rightSection={
                      <div>
                        <CtrlCmd />+<Kbd>Z</Kbd>
                      </div>
                    }
                  >
                    Undo
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<ArrowUturnRightIcon width={16} height={16} />}
                    onClick={undoRedoModal}
                    rightSection={
                      <div>
                        <CtrlCmd />+<Kbd>Shift</Kbd>+<Kbd>Z</Kbd>
                      </div>
                    }
                  >
                    Redo
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<MagnifyingGlassIcon width={16} height={16} />}
                    onClick={() =>
                      openSearchPanel(cmRef.current?.view as EditorView)
                    }
                    rightSection={
                      <div>
                        <CtrlCmd />+<Kbd>F</Kbd>
                      </div>
                    }
                  >
                    Find and Replace
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu shadow="md" position="bottom-start">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    leftSection={<EyeIcon width={16} height={16} />}
                  >
                    View
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <ArrowsPointingOutIcon width={16} height={16} />
                    }
                    onClick={() => setOutputFullScreened(true)}
                  >
                    Open output in full screen
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </AppShell.Section>
          <AppShell.Section className="h-3/4 flex flex-col gap-2">
            <div className="w-full flex flex-row justify-between gap-2 items-center">
              <div className="flex flex-row gap-2 flex-1">
                <ThemeIcon radius="xl" className="shadow-md">
                  <DocumentIcon width={16} height={16} />
                </ThemeIcon>
                <Text fw={700}>Files</Text>
              </div>
              <div className="flex flex-row gap-2">
                <Button variant="outline">
                  <ArrowUpTrayIcon
                    onClick={() => dropzoneRef.current?.()}
                    width={16}
                    height={16}
                  />
                </Button>
                <Button onClick={() => newFileModal()}>
                  <PlusIcon width={16} height={16} />
                </Button>
              </div>
            </div>
            <div className="h-3/4 overflow-y-auto">
              <Dropzone
                onDrop={handleDrop}
                openRef={dropzoneRef}
                activateOnClick={Object.entries(files).length === 0}
                className="h-full"
                styles={{
                  inner: {
                    height: "100%",
                  },
                }}
              >
                <div className="flex flex-col gap-2 flex-1 h-full">
                  {Object.entries(files).length === 0 && (
                    <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center p-2 border-dashed border-offblue-200 border-4 bg-offblue-50 rounded-sm h-full cursor-pointer">
                      <PlusCircleIcon
                        width={64}
                        height={64}
                        className="opacity-50"
                      />
                      <Text c="dimmed">
                        Drag files here, click here to upload, or click the plus
                        button to create a new file.
                      </Text>
                    </div>
                  )}
                  {Object.entries(files).map((file) => {
                    const fileId = file[0];
                    const fileInfo: FileInfo = file[1] as FileInfo;
                    return (
                      <SidebarFile
                        desc={fileInfo.name === "main.py" ? "Code" : ""}
                        name={fileInfo.name}
                        onClick={() => {
                          handleSwitchFile(fileId);
                        }}
                        selected={fileId === currentFile}
                        key={fileId}
                        onDeleteConfirm={() => deleteConfirm(fileId)}
                        onRename={() => renameModal(fileId)}
                        onDownload={() => saveFile(fileId)}
                      />
                    );
                  })}
                </div>
              </Dropzone>
            </div>
          </AppShell.Section>
          <AppShell.Section className="h-1/4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 flex-1">
                <ThemeIcon radius="xl" className="shadow-md">
                  <Bars3CenterLeftIcon width={16} height={16} />
                </ThemeIcon>
                <Text fw={700}>Description</Text>
              </div>
              <Textarea
                rows={6}
                placeholder="What is your project about? What are the instructions? Any credits?"
                value={description}
                onChange={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  handleChangeDescription(target.value);
                }}
              />
            </div>
          </AppShell.Section>
        </div>
        <LoadingOverlay visible={!filesLoaded} />
      </AppShell.Navbar>
      <AppShell.Main>
        <div className={styles.workspace}>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-2 flex-1">
              <ThemeIcon radius="xl" className="shadow-md">
                <CodeBracketIcon width={16} height={16} />
              </ThemeIcon>
              <Text fw={700}>Code</Text>
              {files[currentFile] && (
                <Text fw={400}>({files[currentFile].name})</Text>
              )}
            </div>

            <div className="flex flex-row gap-2">
              <Button
                color="off-blue"
                leftSection={<PlayIcon width={16} height={16} />}
                onClick={refreshPreview}
                loading={isStarting}
              >
                Run
              </Button>
              <Button
                color="off-blue"
                leftSection={<StopIcon width={16} height={16} />}
                disabled={isStopped}
                onClick={stop}
              >
                Stop
              </Button>
            </div>
          </div>
          {files[currentFile] ? (
            <CodeEditor
              className={styles.editorWrapper}
              value={files[currentFile].contents}
              onChange={(value: string) => handleChangeCurrentFile(value)}
              ref={cmRef}
            />
          ) : (
            <div className={styles.editorPlaceholder}>
              <Image
                src="/assets/logo-black.svg"
                width={240}
                height={240}
                alt="Code2Connect logo"
                className="opacity-25"
              />
              <Text c="dimmed">Choose a file from the My Files pane</Text>
            </div>
          )}
        </div>
        {!filesLoaded && <LoadingOverlay visible={!filesLoaded} />}
      </AppShell.Main>
      <AppShell.Aside w="25%" className="bg-[var(--c2c-dark-off-blue)]!">
        <div
          className={`${styles.outputPane} ${outputFullScreened && styles.fullScreened}`}
        >
          <div className="flex flex-row gap-2 w-full flex-nowrap justify-between items-center">
            <div className="flex flex-row gap-2">
              <ThemeIcon radius="xl" className="shadow-md">
                <WindowIcon width={16} height={16} />
              </ThemeIcon>
              <Text fw={700}>Output</Text>
            </div>
            {outputFullScreened ? (
              <div className="flex flex-row gap-2">
                <Button
                  color="off-blue"
                  leftSection={<PlayIcon width={16} height={16} />}
                  onClick={refreshPreview}
                >
                  Run
                </Button>
                <Button
                  color="off-blue"
                  leftSection={<StopIcon width={16} height={16} />}
                  disabled={isStopped}
                  onClick={stop}
                >
                  Stop
                </Button>
                <Button onClick={() => setOutputFullScreened(false)}>
                  <ArrowsPointingInIcon width={16} height={16} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setOutputFullScreened(true)}>
                <ArrowsPointingOutIcon width={16} height={16} />
              </Button>
            )}
          </div>
          <div className="flex flex-row gap-2 w-full flex-nowrap items-center">
            <GlobeAmericasIcon width={16} height={16} />
            <TextInput value={frameSrc} disabled className="flex-1" />
            <Link href={frameSrc} target="_blank">
              <ArrowTopRightOnSquareIcon width={16} height={16} />
            </Link>
          </div>
          {isStopped && <StoppedProject />}
          <iframe
            src={isStopped ? "about:blank" : frameSrc}
            sandbox="allow-scripts allow-same-origin"
            allow="cross-origin-isolated"
            className={`rounded-sm h-full ${isStopped && "hidden"}`}
            ref={outputFrame}
          />
        </div>
      </AppShell.Aside>
    </AppShell>
  );
}
