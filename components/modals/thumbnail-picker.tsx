"use client";
import { Anchor, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PhotosWithTotalResults } from "pexels";
import NextImage from "next/image";
import { Image } from "@mantine/core";
import Link from "next/link";

export default function ThumbnailPickerModal({
  onComplete,
  searchResults,
}: {
  onComplete: (thumbnailUrl: string) => void;
  searchResults: PhotosWithTotalResults;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 flex-wrap max-h-96 overflow-y-scroll">
        {searchResults.photos.map((photo) => (
          <div
            className="w-48 hover:bg-offblue-50 rounded-sm p-1 cursor-pointer"
            onClick={() => {
              onComplete(photo.src.medium);
              modals.closeAll();
            }}
            key={photo.id}
          >
            <div className="w-48 h-27 relative rounded-sm">
              <Image
                component={NextImage}
                src={photo.src.medium}
                fill
                alt={photo.alt ?? `Photo by ${photo.photographer}`}
              />
            </div>
            <p>
              <Anchor component={Link} href={photo.url}>
                {photo.photographer}
              </Anchor>{" "}
              on{" "}
              <Anchor component={Link} href="https://pexels.com">
                Pexels
              </Anchor>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
