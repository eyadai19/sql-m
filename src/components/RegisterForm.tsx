"use client";

import { RegisterFormError, registerFormSchema } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export default function RegisterForm({
  registerAction,
}: {
  registerAction: (
    input: z.infer<typeof registerFormSchema>
  ) => Promise<RegisterFormError | undefined>;
}) {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      // email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    const error = await registerAction(values);

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
        <div className="flex flex-col sm:flex-row items-center justify-evenly p-8 sm:pt-20">
          {/* Image with responsive width */}
          <img
            src="../image/authImage/RegisterImage.jpg"
            alt="Illustration"
            className="mr-8 object-cover w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/3"
          />
          {/* Form container with responsive max width */}
          <div className="w-full max-w-md">
		  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
    <div className="flex flex-col gap-1 text-white">
      <span className="text-2xl font-medium text-[#ADF0D1]">
        Join us
      </span>
      <span className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-blue-400" href="/login">
          Log in
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
              placeholder="Username"
              className="text-white" // Add text-white here
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Uncomment to re-enable the email field */}
    {/* <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="email" placeholder="Email" className="text-white" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    /> */}

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="password"
              placeholder="Password"
              className="text-white" // Add text-white here
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="password"
              placeholder="Confirm Password"
              className="text-white" // Add text-white here
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button
      disabled={form.formState.isSubmitting}
      className="bg-[#ADF0D1] text-[#00203F] w-full"
      type="submit"
    >
      Create Account
    </Button>
  </form>
</Form>

          </div>
        </div>
      </div>
    </div>
  );
}
