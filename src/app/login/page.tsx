import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to access your projects, track task progress, and stay ahead of deadlines."
    >
      <AuthForm callbackUrl={params.callbackUrl} mode="login" />
    </AuthShell>
  );
}
