"use client";

import Image from "next/image";
import styles from "./profile-picture.module.css"

export default function ProfilePicture({
  src,
  username,
  width = 18,
  height = 18,
}: {
  src: string;
  username: string;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      alt={`Profile picture of ${username}`}
      src={src}
      width={width}
      height={height}
      style={{width: width, height: height}}
      className={styles.container}
    />
  );
}
