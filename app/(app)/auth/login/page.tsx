import GitHubSignIn from "@/components/auth/github-sign-in-button";

export default function Page() {
  return (
    <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-offblue-100 to-offblue-700">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Code2Connect</h1>
        <p className="text-center mb-6">Sign in or create an account with GitHub.</p>
        <GitHubSignIn label="Continue with GitHub" />
      </div>
    </div>
  );
}
