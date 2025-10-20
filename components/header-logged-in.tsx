import { Button } from "@mantine/core";
import { BoltIcon, FlagIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import SearchBar from "./search-bar";
import AuthLoginButton from "./auth/auth-login-button";
import Image from "next/image";
import Link from "next/link";
import { createProject } from "@/app/lib/actions";
import CreateButton from "./create";
export default function HeaderLoggedIn() {
  return (
    <div className="flex flex-row w-full h-14 pl-14 pr-14 pt-2 pb-2 items-center bg-offblue-700 border-b-2 border-b-offblue-800 fixed top-0 z-50 backdrop-blur-md">
      <div className="flex-grow flex flex-row gap-6">
        <Link href="/">
          <Image
            src="/assets/logo-white.svg"
            width={32}
            height={32}
            alt="Code2Connect logo"
          />
        </Link>
        <SearchBar bgColor="red" />
        <CreateButton />
        <Button leftSection={<FlagIcon width={16} height={16} />}>
          Tutorials
        </Button>
        <Link href="/ideas">
          <Button leftSection={<LightBulbIcon width={16} height={16} />}>
            Ideas
          </Button>
        </Link>
      </div>
      <div className="text-white">
        <AuthLoginButton />
      </div>
    </div>
  );
}
