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
    <div
      className="bg-gradient-to-b from-[#00203F] to-[#00001a] min-h-screen flex items-center justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* المربع النصف شفاف */}
      <div
        className="rounded-lg p-6 w-[90%] max-w-3xl flex justify-center items-center shadow-lg backdrop-blur-md"
        style={{
          backgroundImage: "url('../image/authImage/AuthBG.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "480px",
          boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
          transform: "translateY(-10px)",
        }}
      >
        <div className="w-full flex flex-col items-center">
          {/* النص "Welcome Again" */}
          <h2 className="text-white text-3xl font-semibold mb-6">
            Welcome Again
          </h2>

          {/* بطاقة تسجيل الدخول */}
          <div
            className="bg-gradient-to-b from-[#003a57] to-[#004a63] rounded-lg p-6 w-full max-w-sm"
            style={{
              height: "230px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 32, 63, 0.5), 0 4px 6px rgba(0, 32, 63, 0.3)",
            }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email Address"
                          {...field}
                          className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full"
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
                          className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting}
                  className="hover:text-[#ADF0D1] bg-[#ADF0D1] text-[#00203F] w-full py-2 rounded"
                  type="submit"
                >
                  LOG IN
                </Button>
              </form>
            </Form>

            {/* زر هل لديك حساب مسبقًا */}
            <div className="text-center mt-4">
              <span className="text-sm text-black">
                Don't have an account?{" "}
              </span>
              <Link
                href="/register"
                className="text-sm text-blue-500 font-medium hover:underline"
              >
                Register.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
