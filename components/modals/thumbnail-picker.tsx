"use client"
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PhotosWithTotalResults } from "pexels";
import NextImage from "next/image"
import { Image } from "@mantine/core";

export default function ThumbnailPickerModal({
  onComplete,
  searchResults
}: {
  onComplete: (thumbnailUrl: string) => void;
  searchResults: PhotosWithTotalResults
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 flex-wrap max-h-96 overflow-y-scroll">
        {searchResults.photos.map(photo => <Image component={NextImage} src={photo.src.small} width={384} height={216} alt={photo.alt ? photo.alt : `Photo by ${photo.photographer}`} key={photo.id} />)}
      </div>
      <Button
        fullWidth
        onClick={() => {
          onComplete("");
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
