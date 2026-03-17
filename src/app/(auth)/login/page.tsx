import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Welcome Back</h1>
        <p className="mb-6 text-sm text-gray-500">Login to continue</p>
        <LoginForm />
      </div>
    </main>
  );
}
