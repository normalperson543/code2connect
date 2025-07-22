import { Input } from "@mantine/core"
import styles from "./search-bar.module.css"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
export default function SearchBar() {
    return (
        <Input
            type="text"
            placeholder="Search"
            leftSection={<MagnifyingGlassIcon width={16} height={16} />}
        />
    )
}