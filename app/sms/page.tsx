"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { smsLogin } from "./action";

const initialState = {
  phone: "",
  tokenValue: "",
  token: false,
  error: undefined,
};

export default function SmsLogIn() {
  const [state, dispatch] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Sign In</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {!state.token ? (
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            defaultValue={state.phone}
            required
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            type="number"
            name="token"
            placeholder="Verification Code"
            required
            min={100000}
            max={999999}
            defaultValue={Number(state.tokenValue)}
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}
