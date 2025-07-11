"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constant";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { logUserIn } from "@/lib/session";

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be string!",
        required_error: "Please enter the username!",
      })
      .toLowerCase()
      .trim()
      .refine((username) => !username.includes("XXX"), "XXX Not allowed"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm: z.string().min(6),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER; // 다른 refine 생략
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER; // 다른 refine 생략
    }
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Both passwords should be the same!",
    path: ["confirm"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm: formData.get("confirm") as string,
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      ...data,
      error: result.error.flatten(),
    };
  } else {
    // 0. hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // 1. save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    logUserIn(user.id);
  }
}
