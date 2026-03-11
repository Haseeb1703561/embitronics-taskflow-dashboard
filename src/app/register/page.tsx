import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Set up your workspace to start managing projects, assigning priorities, and tracking delivery."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
