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