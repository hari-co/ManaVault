import { SignIn } from "@clerk/nextjs";

export default function login() {
    return (
      <div className="bg-blue-200 flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-screen">
        <SignIn />
      </div>
    )
}