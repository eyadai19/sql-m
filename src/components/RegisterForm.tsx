"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";
import { registerFormSchema } from "@/lib/types/authSchemas";

export default function RegisterForm({
  registerAction,
}: {
  registerAction: (
    input: z.infer<typeof registerFormSchema>
  ) => Promise<any | undefined>;
}) {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  // Handle image upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    const error = await registerAction(values);
    if (error) {
      form.setError(error.field, { message: error.message });
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
          backgroundImage: "url('../image/authImage/RegisterBG.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "530px",
          boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
          transform: "translateY(-10px)",
        }}
      >
        <div className="w-full flex flex-col items-center">
          {/* النص "Create an Account" */}
          <h2 className="text-white text-3xl font-semibold m-3">
            join us !          </h2>

          {/* بطاقة تسجيل الحساب */}
          <div
            className="bg-gradient-to-b from-[#003a57] to-[#004a63] rounded-lg p-6 w-full max-w-sm"
            style={{
              height: "450px",


              boxShadow:
                "0 10px 15px -3px rgba(0, 32, 63, 0.5), 0 4px 6px rgba(0, 32, 63, 0.3)",
            }}
          >
            {/* صورة الملف الشخصي */}
            <div className="flex flex-col items-center mb-3">
              <label htmlFor="photo" className="relative cursor-pointer">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#003A63]">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-white">+</span>
                  )}
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="First Name" {...field} className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Username" {...field} className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" {...field} className="text-gray-800 bg-gray-100 border border-gray-300 rounded px-4 py-2 w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className=" hover:text-[#ADF0D1] w-full bg-[#ADF0D1] text-[#00203F]"
                >
                  Create Account
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="text-center m-2">
              <span className="text-sm text-white">
                Already have an account?{" "}
              </span>
              <Link
                href="/login"
                className="text-sm text-blue-500 font-medium hover:underline"
              >
                Login.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
