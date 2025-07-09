"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constant";
import { useActionState } from "react";

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          required
          errors={state?.error?.fieldErrors.username}
          defaultValue={state?.username}
          minLength={3}
          maxLength={10}
        />
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
          errors={state?.error?.fieldErrors.password}
          defaultValue={state?.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          required
          errors={state?.error?.fieldErrors.confirm}
          defaultValue={state?.confirm}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
}
