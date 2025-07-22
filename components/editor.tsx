"use client";

import {
  Anchor,
  Box,
  Button,
  ButtonGroup,
  getPrimaryShade,
  Input,
  Loader,
  Menu,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import styles from "./editor.module.css";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  DocumentIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FaceSmileIcon,
  GlobeAmericasIcon,
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
import ProfilePicture from "./ui/profile-picture";
import { useMantineTheme } from "@mantine/core";
import { useDebouncedCallback } from "use-debounce";
import { FileInfo, Files } from "@/app/lib/files";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import RenameModal from "./ui/modals/rename-modal";
import FileSaver from "file-saver";
import NewFileModal from "./ui/modals/new-file-modal";
import download from "@/app/lib/downloader";
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import {undo} from "@codemirror/commands"

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
        color={selected ? "off-blue" : "dark"}
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
  creatorImageSrc: string;
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
    title: string
  ) => Promise<{ status: string; message: string }>;
}) {
  const outputFrame = useRef(null);
  const theme = useMantineTheme();
  const [description, setDescription] = useState(dbDesc);
  const [title, setTitle] = useState(dbTitle);
  const [files, setFiles] = useState<Files>(dbFiles);
  const [currentFile, setCurrentFile] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date>();
  const iterableFiles = Object.entries(files);
  const dropzoneRef = useRef<() => void>(null);

  let frameSrc = previewUrl;

  async function save() {
    setIsSaving(true);
    const status = await handleSave(files, description, title);
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
  function refreshPreview() {
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
    dropped.forEach(file => {
      const reader = new FileReader() //https://react-dropzone.js.org/

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const data = reader.result
        createFile(file.name, data as string)
      }
      reader.readAsText(file)
    })
  }
  
  return (
    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <ProfilePicture
            src={creatorImageSrc}
            username={`${creator}'s profile picture`}
            height={36}
            width={36}
          />
          <div className={styles.userInfo}>
            {canEditInfo ? (
              <TextInput
                value={title}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  handleChangeTitle(target.value);
                }}
              />
            ) : (
              <Text fw={700}>{title}</Text>
            )}

            <Text>
              by{" "}
              <Link href={`/profile/${creator}`} target="_blank">
                <Anchor component="button">{creator}</Anchor>
              </Link>
            </Text>
          </div>
        </div>
        <Button
          color="off-blue"
          leftSection={<PlayIcon width={16} height={16} />}
          className={styles.button}
          onClick={refreshPreview}
        >
          Run
        </Button>
        <Button
          color="off-blue"
          leftSection={<StopIcon width={16} height={16} />}
          disabled
        >
          Stop
        </Button>
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

          <Button
            color="orangey.3"
            leftSection={<ShareIcon width={16} height={16} />}
            className={styles.button}
            autoContrast
          >
            Share
          </Button>
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
      </div>
      <div className={styles.content}>
        <div className={styles.leftSidebar}>
          <div className={styles.sidebarSect}>
            <div className={styles.sidebarSectTitle}>
              <Text c="dimmed" tt="uppercase">
                My files
              </Text>
              <Button>
                <ArrowUpTrayIcon onClick={() => dropzoneRef.current?.()} width={16} height={16} />
              </Button>
            </div>
            <Dropzone onDrop={handleDrop} openRef={dropzoneRef} activateOnClick={false} className={styles.files}>
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
            </Dropzone>
          </div>
          <div className={styles.sidebarSect}>
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
        </div>
        <div className={styles.workspace}>
          <div className="toolbar">
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
                  <Menu.Item leftSection={<PlusIcon width={16} height={16} />}>
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
            <Menu shadow="md" width={200} position="bottom-start">
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
                >
                  Undo
                </Menu.Item>
                <Menu.Item
                  leftSection={<ArrowUturnRightIcon width={16} height={16} />}
                >
                  Redo
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button
              variant="subtle"
              leftSection={<EyeIcon width={16} height={16} />}
            >
              View
            </Button>
          </div>
          <div className={styles.editorInfo}>
            <CodeBracketIcon width={16} height={16} />
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
            />
          ) : (
            <div className={styles.editorPlaceholder}>
              <FaceSmileIcon width={36} height={36} />
              <Text>
                Let's get started! Choose a file from the My Files pane.
              </Text>
            </div>
          )}

          <div className={styles.outputPane}>
            <div className={styles.editorInfo}>
              <WindowIcon width={16} height={16} color="off-blue" />
              <Text fw={700}>Output</Text>
            </div>
            <div className={styles.urlInfo}>
              <GlobeAmericasIcon width={16} height={16} />
              <TextInput className={styles.url} value={frameSrc} disabled />
              <Link href={frameSrc} target="_blank">
                <ArrowTopRightOnSquareIcon width={16} height={16} />
              </Link>
            </div>
            <iframe
              src={frameSrc}
              sandbox="allow-scripts allow-same-origin"
              allow="cross-origin-isolated"
              className={styles.output}
              ref={outputFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
