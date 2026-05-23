import { LoginForm } from "@/components/auth/login-form";
import { Navbar } from "@/components/layout/navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </>
  );
}
