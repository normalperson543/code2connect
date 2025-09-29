import { Button } from "@mantine/core";

export default function HeaderLoggedOut() {
  return (
    <div className="flex flex-row w-full h-14 pl-14 pr-14 pt-2 pb-2 items-center bg-offblue-700 border-b-2 border-b-offblue-800 fixed top-0 z-50 backdrop-blur-md" >
      <div className="flex-grow flex flex-row gap-6">
        <Button>
          Product
        </Button>
        <Button
        >
          Tutorials
        </Button>
        <Button
          leftSection={<LightBulbIcon width={16} height={16} />}
        >
          Ideas
        </Button>
        <Menu shadow="md" width={200}>
          <Button
            leftSection={<AcademicCapIcon width={16} height={16} />}
          >
            Education
          </Button>
        </Menu>
      </div>
      <div className="text-white">
        <AuthLoginButton />
      </div>
    </div>
  );
}