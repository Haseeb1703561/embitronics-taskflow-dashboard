"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetcher";

type AuthFormProps = {
  mode: "login" | "register";
  callbackUrl?: string;
};

export function AuthForm({
  mode,
  callbackUrl = "/dashboard",
}: AuthFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isRegister) {
        await fetchJson("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result?.ok) {
        throw new Error("Invalid email or password.");
      }

      toast.success(
        isRegister ? "Account created successfully." : "Welcome back.",
      );

      // Use the local callback path directly so login navigation still works
      // even if an environment-specific absolute URL is returned by the auth layer.
      router.replace(callbackUrl);
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to complete your request.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="email">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </div>

      {isRegister ? (
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-200"
            htmlFor="confirm-password"
          >
            Confirm password
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting
          ? isRegister
            ? "Creating account..."
            : "Signing in..."
          : isRegister
            ? "Create account"
            : "Sign in"}
      </Button>

      <p className="text-center text-sm text-slate-400">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-medium text-cyan-300 transition hover:text-cyan-200"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}
