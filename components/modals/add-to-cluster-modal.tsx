import { Button, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

export default function AddToClusterModal({
  onComplete,
}: {
  onComplete: (newName: string) => void;
}) {
  const [clusterUrl, setClusterUrl] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        type="text"
        value={clusterUrl}
        label="What's the link to the cluster?"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          console.log(e.target.value);
          setClusterUrl(target.value);
        }}
      />
      <Button
        fullWidth
        onClick={() => {
          onComplete(clusterUrl);
          modals.closeAll();
        }}
      >
        Done
      </Button>
    </div>
  );
}
