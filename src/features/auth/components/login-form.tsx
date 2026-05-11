import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  type LoginFormValues,
  loginFormSchema,
  type RegisterFormValues,
  registerFormSchema,
} from "../models/auth.models";
import { useAuthContext } from "./auth-provider";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuthContext();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const destination = redirectTo ?? "/dashboard";

  async function onLoginSubmit(values: LoginFormValues) {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate({ to: destination });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function onRegisterSubmit(values: RegisterFormValues) {
    try {
      await register(values.name, values.email, values.password);
      toast.success("Account created successfully!");
      navigate({ to: destination });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  }

  if (isRegistering) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to start managing feature flags.</CardDescription>
        </CardHeader>
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...registerForm.register("name")} placeholder="John Doe" />
              {registerForm.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                {...registerForm.register("email")}
                placeholder="john@example.com"
              />
              {registerForm.formState.errors.email && (
                <p className="text-destructive text-sm">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                {...registerForm.register("password")}
                placeholder="Min. 8 characters"
              />
              {registerForm.formState.errors.password && (
                <p className="text-destructive text-sm">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
              {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
            <Button type="button" variant="link" onClick={() => setIsRegistering(false)}>
              Already have an account? Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your workspace.</CardDescription>
      </CardHeader>
      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...loginForm.register("email")}
              placeholder="john@example.com"
            />
            {loginForm.formState.errors.email && (
              <p className="text-destructive text-sm">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register("password")}
              placeholder="Your password"
            />
            {loginForm.formState.errors.password && (
              <p className="text-destructive text-sm">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
            {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
          <Button type="button" variant="link" onClick={() => setIsRegistering(true)}>
            Don&apos;t have an account? Create one
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
