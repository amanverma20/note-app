import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(6, "OTP must be 6 digits"),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email) return toast.error("Please enter a valid email");

    setLoadingOtp(true);
    try {
      await API.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email");
      setOtpSent(true);
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const onSubmit = async (data: SignInSchema) => {
    try {
      const res = await API.post("/auth/verify-otp-login", data);
      toast.success("Login successful!");
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await API.post("/auth/google-login", {
        id_token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in with Google");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Left Panel - Sign In */}
      <div className="flex flex-col sm:items-center md:items-start justify-start relative md:pt-4 pb-10 w-full h-full">
        {/* Logo */}
        <div className="mb-4 sm:mb-6 md:ml-6 flex items-center justify-center gap-2">
          <Loader className="text-3xl font-bold text-blue-600" />
          <h1 className="text-3xl font-bold text-black">HD</h1>
        </div>

        {/* Form */}
        <div className="flex-1 w-full flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg border border-gray-300">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="text-sm text-muted-foreground">
                Welcome back to Highway Delite
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="font-light text-left">
                    Email
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="email"
                      {...register("email")}
                      className="border border-gray-500 w-full"
                      placeholder="you@example.com"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendOtp}
                      disabled={loadingOtp || cooldown > 0}
                      className="bg-black text-white w-full sm:w-fit"
                    >
                      {loadingOtp
                        ? "Sending..."
                        : otpSent
                          ? `Resend OTP${cooldown > 0 ? ` (${cooldown}s)` : ""}`
                          : "Send OTP"}
                    </Button>
                  </div>
                  {otpSent && cooldown > 0 ? (
                    <p className="text-xs text-blue-600">
                      Check your span if otp is not present in inbox !
                    </p>
                  ) : (
                    <>
                    </>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* OTP */}
                <div className="relative flex flex-col gap-2">
                  <Label htmlFor="otp" className="text-left font-light">
                    OTP
                  </Label>
                  <div className="w-full flex items-center justify-center">
                    <Controller
                      name="otp"
                      control={control}
                      render={({ field }) => (
                        <InputOTP
                          maxLength={6}
                          {...field}
                          onChange={(val) => field.onChange(val)}
                          value={field.value || ""}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="border-gray-500" />
                            <InputOTPSlot index={1} className="border-gray-500" />
                            <InputOTPSlot index={2} className="border-gray-500" />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} className="border-gray-500" />
                            <InputOTPSlot index={4} className="border-gray-500" />
                            <InputOTPSlot index={5} className="border-gray-500" />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 rounded-lg"
                >
                  Sign in
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-grow border-t" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-grow border-t" />
                </div>

                {/* Google login */}
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>

                <p className="text-center text-sm mt-4">
                  Don't have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => navigate("/sign-up")}
                  >
                    Sign up
                  </span>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden md:block">
        <img
          src="/background.jpg"
          alt="Sign In Illustration"
          className="w-full h-screen object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default SignIn;
