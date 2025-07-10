"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constant";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be string!",
        required_error: "Please enter the username!",
      })
      .toLowerCase()
      .trim()
      .refine((username) => !username.includes("XXX"), "XXX Not allowed")
      .refine(checkUniqueUsername, "This username is already taken."),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account already registered with that email."
      ),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm: z.string().min(6),
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
    // 2. log the user in
    const cookie = await getIronSession(await cookies(), {
      cookieName: "carrot",
      password: process.env.COOKIE_PASSWORD!,
    });
    //@ts-ignore
    cookie.id = user.id;
    await cookie.save();
    // 3. redirect "/home"
    redirect("/profile");
  }
}
