"use client";
import { Button } from "@/components/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Admin() {

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/painel",
  });

  if (error) {
    alert(error.message);
    return;
  }

  console.log("Login realizado:", data);
}

  return (
    <main className="bg-bgAll min-h-screen flex flex-col justify-center items-center px-4 text-on-background relative">
      <Link href="/" className=" absolute top-10 right-5">
        <ArrowLeft/>
      </Link>
      <div className="w-full max-w-sm flex flex-col gap-12 relative z-10">
        <header className="flex flex-col items-center text-center space-y-2">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight">
            LOGIN
          </h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.25em]">
            ADMIN
          </p>
          <div className="h-px w-12 bg-bgMilitar mt-6" />
        </header>

        {/* Login Form */}
        <form
          className="flex flex-col gap-8 w-full"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col relative">
            <label
              className="font-label-caps text-gray-600 text-on-surface-variant mb-2 transition-colors"
              htmlFor="username"
            >
              Usuário
            </label>
            <input
              autoComplete="email"
              className="font-body-lg text-body-lg bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:outline-hidden transition-colors placeholder:text-outline-variant"
              id="username"
              name="email"
              placeholder=" "
              type="email"
            />
          </div>

          <div className="flex flex-col relative">
            <label
              className="font-label-caps text-gray-600 text-on-surface-variant mb-2 transition-colors"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              autoComplete="current-password"
              className="font-body-lg text-body-lg bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:outline-hidden focus:ring-0 transition-colors placeholder:text-outline-variant"
              id="password"
              placeholder=" "
              type="password"
              name="password"
            />
          </div>

          <div className="pt-4">
            <Button name="ENTRAR" />
          </div>
        </form>
      </div>
    </main>
  );
}
