import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
});
