"use server";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, ["ko-KR", "en-CA"]),
    "Wrong phone format!"
  );
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  phone: string;
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone") as string;
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        phone: phone,
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        phone: phone,
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        phone: phone,
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
