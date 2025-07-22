'use client';

import styles from "./header-logged-in.module.css"
import { Button, Menu, Text } from "@mantine/core"
import { AcademicCapIcon, BoltIcon, FlagIcon, LightBulbIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline"
import { useMantineTheme } from "@mantine/core";
import SearchBar from "./search-bar";

export default function HeaderLoggedIn() {
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <SearchBar />
      <Button leftSection={<BoltIcon width={16} height={16} />} variant="subtle" color="off-blue">
        Create
      </Button>
      <Button leftSection={<FlagIcon width={16} height={16} />} variant="subtle" color="off-blue">
        Tutorials
      </Button>
      <Button leftSection={<LightBulbIcon width={16} height={16} />} variant="subtle" color="off-blue">
        Ideas
      </Button>
      <Menu shadow="md" width={200}>
        <Button leftSection={<AcademicCapIcon width={16} height={16} />} variant="subtle" color="off-blue">
          Education
        </Button>
      </Menu>
      
    </div>
  )
}