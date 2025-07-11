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

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      ...data,
      error: result.error.flatten(),
    };
  } else {
    // 0. if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    if (ok) {
      logUserIn(user!.id);
    } else {
      return {
        ...data,
        error: {
          fieldErrors: {
            password: ["Wrong password."],
            email: [],
          },
        },
      };
    }
  }
};
