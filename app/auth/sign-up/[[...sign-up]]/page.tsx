import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-[#0a0a0f]">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
            <span className="text-white">efZone</span>
            <span className="text-xs align-super text-white/30 ml-0.5">&#174;</span>
          </h1>
          <p className="text-white/45">Join the referee training community</p>
        </div>
        <SignUp forceRedirectUrl="/dashboard" signInUrl="/auth/login" />
      </div>
    </div>
  )
}
