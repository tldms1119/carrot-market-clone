"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { login } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constant";
import { useActionState } from "react";

export default function LogIn() {
  const [state, dispatch] = useActionState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Sign in with email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          errors={state?.error?.fieldErrors.email}
          defaultValue={state?.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.error?.fieldErrors.password}
          defaultValue={state?.password}
        />
        <Button text="Sign In" />
      </form>
      <SocialLogin />
    </div>
  );
}
