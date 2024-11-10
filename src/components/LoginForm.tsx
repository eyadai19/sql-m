"use client";

import { LoginFormError } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const loginFormSchema = z.object({
	username: z.string(),
	password: z.string().min(8).max(32),
});

export function LoginForm({
  loginAction,
}: {
  loginAction: (
    input: z.infer<typeof loginFormSchema>
  ) => Promise<LoginFormError | undefined>;
}) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const error = await loginAction(values);

    if (error) {
      form.setError(
        error.field,
        { message: error.message },
        { shouldFocus: true }
      );
      return;
    }
  }

  return (
    <div className="bg-[#00203F] flex min-h-screen flex-col">
      {/* Logo at the top right */}
      <div className="fixed top-4 right-4 text-xl font-bold text-[#ADF0D1]">
        My Logo
      </div>

      {/* Form Content */}
      <div className="pt-16 p-4 sm:p-8 transform scale-100 sm:scale-100">
        {/* Using flex-col on small screens and flex-row on larger screens */}
        <div className="flex flex-col sm:flex-row-reverse items-center justify-evenly p-8 sm:pt-20">
          {/* Image with responsive width on the right */}
          <img
            src="../image/authImage/LoginImage.jpg"
            alt="Illustration"
            className="mr-8 object-cover w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/3"
          />

          {/* Form container with responsive max width */}
          <div className="w-full max-w-md">
		  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
    <div className="flex flex-col gap-1 text-white">
      <span className="text-2xl font-medium text-[#ADF0D1]">
        Welcome again
      </span>
      <span className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link className="font-medium text-blue-400" href="/register">
          Create a new account
        </Link>
        .
      </span>
    </div>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder="username"
              {...field}
              className="text-white" // This changes the text color inside the input field
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="password"
              placeholder="Password"
              {...field}
              className="text-white" // This changes the text color inside the input field
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <Button
      disabled={form.formState.isSubmitting}
      className="bg-[#ADF0D1] text-[#00203F] space-y-2 w-full"
      type="submit"
    >
      Login
    </Button>
  </form>
</Form>

          </div>
        </div>
      </div>
    </div>
  );
}
