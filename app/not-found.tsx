import MTWrapper from "@/components/mt-wrapper";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Paper, ThemeIcon, Title } from "@mantine/core";

export default function Error() {
  return (
    <div className="w-full h-full">
      <MTWrapper includeExtraPadding={true}>
        <div className="flex w-full h-full items-center justify-center -my-14">
          <Paper
            withBorder
            shadow="md"
            p={22}
            mt={30}
            radius="md"
            className="flex! flex-col gap-2 w-fit"
          >
            <ThemeIcon color="red" radius="xl">
              <XMarkIcon width={64} height={64} />
            </ThemeIcon>
            <Title order={1}>404 Not Found</Title>
            <p>
              We couldn&apos;t find what you were looking for... Maybe you can
              try searching what you need?
            </p>
          </Paper>
        </div>
      </MTWrapper>
    </div>
  );
}
