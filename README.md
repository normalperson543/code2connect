# Code2Connect

A platform for students to create Python projects right in their browser and share with others across the world

This codebase contains the community site, marketing pages, and IDE.

This project uses the Next.js framework and Supabase as the backend.

## Run locally

You'll need:

- A Supabase project
- A Pexels key (for thumbnails)
- Ideally, the [runner](https://github.com/normalperson543/code2connect-runner) running on your computer

First, see the `.env.local.template` file and rename it to `.env.local`, and change the variables accordingly.

Install dependencies:

```
pnpm i
```

Then run the development server:

```
pnpm run dev
```

## Building

```
pnpm build
```

## Libraries

Consistent to the CAC Rulesbook, we used the following libraries publicly available on NPM:

```
"@codemirror/autocomplete": "^6.18.6",
"@codemirror/commands": "^6.8.1",
"@codemirror/lang-python": "^6.2.1",
"@codemirror/language": "^6.11.2",
"@codemirror/lint": "^6.8.5",
"@codemirror/search": "^6.5.11",
"@codemirror/state": "^6.5.2",
"@codemirror/view": "^6.38.0",
"@heroicons/react": "^2.2.0",
"@lezer/highlight": "^1.2.1",
"@mantine/carousel": "^8.1.3",
"@mantine/core": "^8.1.3",
"@mantine/dates": "^8.3.3",
"@mantine/dropzone": "^8.1.3",
"@mantine/form": "^8.1.3",
"@mantine/hooks": "^8.1.3",
"@mantine/modals": "^8.1.3",
"@mantine/notifications": "^8.1.3",
"@mantine/nprogress": "^8.1.3",
"@prisma/client": "^6.17.1",
"@pyscript/core": "^0.6.63",
"@radix-ui/react-checkbox": "^1.3.1",
"@radix-ui/react-dropdown-menu": "^2.1.14",
"@radix-ui/react-label": "^2.1.6",
"@radix-ui/react-slot": "^1.2.2",
"@react-spring/web": "^10.0.1",
"@supabase/ssr": "latest",
"@supabase/supabase-js": "latest",
"@uiw/codemirror-theme-basic": "^4.25.2",
"@uiw/react-codemirror": "^4.24.1",
"@vercel/analytics": "^1.5.0",
"@webcontainer/api": "^1.6.1",
"@xterm/addon-fit": "^0.10.0",
"@xterm/xterm": "^5.5.0",
"class-variance-authority": "^0.7.1",
"clsx": "^2.1.1",
"dayjs": "^1.11.18",
"dom-to-image": "^2.6.0",
"embla-carousel": "^8.5.2",
"embla-carousel-autoplay": "^8.5.2",
"embla-carousel-react": "^8.5.2",
"file-saver": "^2.0.5",
"jszip": "^3.10.1",
"lucide-react": "^0.511.0",
"moment": "^2.30.1",
"next": "15.5.6",
"next-themes": "^0.4.6",
"nextjs-toploader": "^3.9.17",
"pexels": "^1.4.0",
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-use-measure": "^2.1.7",
"swr": "^2.3.6",
"tailwind-merge": "^3.3.0",
"use-debounce": "^10.0.5",
"uuid": "^13.0.0"
```
