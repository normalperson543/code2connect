"use client";

import {
  Anchor,
  AppShell,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Divider,
  Kbd,
  Menu,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
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
  PlayIcon,
  PlusIcon,
  ShareIcon,
  StopIcon,
  TrashIcon,
  WindowIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CodeEditor from "./code-editor";
import { useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { FileInfo, Files } from "@/app/lib/files";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import RenameModal from "./ui/modals/rename-modal";
import FileSaver from "file-saver";
import NewFileModal from "./ui/modals/new-file-modal";
import download from "@/app/lib/downloader";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { UserPlusIcon } from "lucide-react";
import { EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import UndoRedoModal from "./ui/modals/undo-redo-modal";
import CtrlCmd from "./ctrl-cmd";
import { openSearchPanel } from "@codemirror/search";
import domtoimage from "dom-to-image";
import Image from "next/image";
import saveAs from "file-saver";
import StoppedProject from "./stopped-project";

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
  return (
    <ButtonGroup>
      <Button
        color={selected ? "off-blue" : "light"}
        leftSection={<CodeBracketIcon width={16} height={16} />}
        fullWidth
        justify="left"
        variant={selected ? "filled" : "subtle"}
        onClick={onClick}
      >
        {desc && (
          <>
            <Text fw={700}>{desc} </Text> <Text>(</Text>
          </>
        )}
        <Text fw={400}>{name}</Text>
        {desc && <Text>)</Text>}
      </Button>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            color={selected ? "off-blue" : "dark"}
            variant={selected ? "filled" : "subtle"}
          >
            <EllipsisVerticalIcon width={16} height={16} />
          </Button>
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
    </ButtonGroup>
  );
}
export default function Editor({
  creatorImageSrc,
  creator,
  canEditInfo,
  files: dbFiles,
  description: dbDesc,
  previewUrl,
  id,
  title: dbTitle,
  handleSave,
}: {
  creatorImageSrc?: string;
  creator: string;
  canEditInfo: boolean;
  files: Files;
  description: string;
  previewUrl: string;
  id: string;
  title: string;
  handleSave: (
    files: Files,
    description: string,
    title: string,
    thumbnail: Blob
  ) => Promise<{ status: string; message: string }>;
}) {
  const outputFrame = useRef<HTMLIFrameElement>(null);
  const [description, setDescription] = useState(dbDesc);
  const [title, setTitle] = useState(dbTitle);
  const [files, setFiles] = useState<Files>(dbFiles);
  const [currentFile, setCurrentFile] = useState(Object.keys(files)[0]);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date>();
  const iterableFiles = Object.entries(files);
  const dropzoneRef = useRef<() => void>(null);
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const [outputFullScreened, setOutputFullScreened] = useState(false);
  const [currThumb, setCurrThumb] = useState<Blob>();
  const [isStopped, setIsStopped] = useState(true);
  const [thumbUrl, setThumbUrl] = useState("");

  let frameSrc = previewUrl;

  async function saveThumbnail() {
    console.log("Saving thumb");
    const dataUrl = await domtoimage.toPng(
      cmRef.current?.editor as HTMLElement
    );
    console.log("Done saving");
  }
  async function save() {
    setIsSaving(true);
    await saveThumbnail();
    const status = await handleSave(
      files,
      description,
      title,
      currThumb as Blob
    );
    setIsSaving(false);
    if (status.status === "error") {
      console.error(status.message);
      notifications.show({
        position: "top-center",
        withCloseButton: true,
        autoClose: false,
        title: "Your project did not save",
        message: `Check your Internet connection, and try again later. Error info: ${status.message}`,
        color: "red",
        icon: <XMarkIcon />,
      });
      setIsChanged(true);
    }
    if (status.status === "success") {
      notifications.clean();
      setIsChanged(false);
      setLastSave(new Date());
    }
  }
  const debounceSave = useDebouncedCallback(() => {
    save();
  }, 2000);

  function handleChangeTitle(newTitle: string) {
    setIsChanged(true);
    setTitle(newTitle);
    debounceSave();
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
    delete newFiles[id];
    setFiles(newFiles);
    setIsChanged(true);
    debounceSave();
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
  function refreshPreview() {
    setIsStopped(false);
    if (outputFrame.current) {
      const frame = outputFrame.current as HTMLIFrameElement;
      frame.src = frame.src;
    }
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

  return (
    <AppShell
      header={{ height: 72 }}
      padding={12}
      navbar={{ width: 300, breakpoint: 0 }}
    >
      <AppShell.Header className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <Badge size="lg" tt="capitalize">
            Editor
          </Badge>
          <Divider orientation="vertical" />
          <Avatar src={creatorImageSrc} size="md" />
          <div className={styles.userInfo}>
            <Title order={5}>{title}</Title>

            <Text>
              by{" "}
              <Link href={`/profile/${creator}`} target="_blank">
                <Anchor component="button">{creator}</Anchor>
              </Link>
            </Text>
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
              leftSection={
                !isChanged ? (
                  <CheckIcon width={16} height={16} />
                ) : (
                  <CloudArrowUpIcon width={16} height={16} />
                )
              }
              loading={isSaving}
              onClick={save}
              disabled={isSaving}
              variant="outline"
              color="off-blue"
            >
              Save
            </Button>
          </Tooltip>
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button
                color="orangey.3"
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
              <Menu.Item leftSection={<UserPlusIcon width={16} height={16} />}>
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
              color="off-blue"
              autoContrast
              leftSection={<EyeIcon width={16} height={16} />}
            >
              Preview Public Page
            </Button>
          </Link>
        </div>
      </AppShell.Header>
      <AppShell.Navbar>
        <div className="flex flex-col gap-2 p-2 h-full">
          <AppShell.Section className="h-1/2 flex flex-col gap-2">
            <div className="w-full flex flex-row justify-between gap-2 items-center">
              <Text c="dimmed" tt="uppercase">
                My files
              </Text>
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
            <Dropzone
              onDrop={handleDrop}
              openRef={dropzoneRef}
              activateOnClick={false}
            >
              <div className="flex flex-col gap-2">
                {iterableFiles.map((file) => {
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
          </AppShell.Section>
          <AppShell.Section className="h-1/2">
            <div className="flex flex-col gap-2">
              <Text c="dimmed" tt="uppercase">
                Description
              </Text>
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
      </AppShell.Navbar>
      <AppShell.Main>
        <div className={styles.workspace}>
          <div className="flex flex-row gap-2">
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
                  <Link href="/projects/new" target="_blank">
                    <Menu.Item
                      leftSection={<PlusIcon width={16} height={16} />}
                    >
                      New project
                    </Menu.Item>
                  </Link>
                  <Menu.Item
                    leftSection={<CloudArrowUpIcon width={16} height={16} />}
                    onClick={save}
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
                  {cmRef.current && cmRef.current.view && (
                    <Menu.Item
                      leftSection={
                        <MagnifyingGlassIcon width={16} height={16} />
                      }
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
                  )}
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
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="p-1 rounded-full bg-[var(--mantine-primary-color-filled)] ">
              <CodeBracketIcon
                width={16}
                height={16}
                className="text-[var(--mantine-color-white)]"
              />
            </div>
            <Text fw={700}>Code</Text>
            {files[currentFile] && (
              <Text fw={400}>({files[currentFile].name})</Text>
            )}
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
              <FaceSmileIcon width={36} height={36} />
              <Text>
                Let's get started! Choose a file from the My Files pane.
              </Text>
            </div>
          )}
        </div>
      </AppShell.Main>
      <AppShell.Aside w="25%">
        <div
          className={`${styles.outputPane} ${outputFullScreened && styles.fullScreened}`}
        >
          <div className="flex flex-row gap-2 w-full flex-nowrap justify-between items-center">
            <div className="flex flex-row gap-2">
              <div className="p-1 rounded-full bg-[var(--mantine-primary-color-filled)] h-min">
                <WindowIcon
                  width={16}
                  height={16}
                  className="text-[var(--mantine-color-white)]"
                />
              </div>
              <Text fw={700}>Output</Text>
            </div>
            {outputFullScreened ? (
              <div className="flex flex-row">
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
          {isStopped ? (
            <StoppedProject />
          ) : (
            <iframe
              src={frameSrc}
              sandbox="allow-scripts allow-same-origin"
              allow="cross-origin-isolated"
              className="rounded-sm h-full"
              ref={outputFrame}
            />
          )}
        </div>
      </AppShell.Aside>
    </AppShell>
  );
}
