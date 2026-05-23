import { SignupForm } from "@/components/auth/signup-form";
import { Navbar } from "@/components/layout/navbar";

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <SignupForm />
      </main>
    </>
  );
}
