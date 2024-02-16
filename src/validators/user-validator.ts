import { z } from "zod";

export const addUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(3),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});

export const loginUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export const updateUserSchema = z
  .object({
    username: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      const values = Object.values(data);
      const isValid = values.reduce((a, v) => {
        if (v) {
          return true;
        }
        return a;
      }, false);
      return isValid;
    },
    {
      message: "At least one field must be provided for the user update",
    }
  );
