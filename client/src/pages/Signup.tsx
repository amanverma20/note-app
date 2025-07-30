import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Eye, EyeOff, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { CalendarIcon, Loader } from "lucide-react";

const signupSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    dob: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Invalid email"),
    otp: z.string().min(6, "OTP must be 6 digits"),
});

type SignupSchema = z.infer<typeof signupSchema>;

const Signup = () => {
    // const [showOtp, setShowOtp] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control
    } = useForm<SignupSchema>({ resolver: zodResolver(signupSchema) });

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

    const onSubmit = async (data: SignupSchema) => {
        try {
            const res = await API.post("/auth/verify-otp-signup", data);
            toast.success("Signup successful!");
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Signup failed");
        }
    };

    const handleGoogleSignup = async (credentialResponse: any) => {
        try {
            const res = await API.post("/auth/google-login", {
                id_token: credentialResponse.credential,
            });
            localStorage.setItem("token", res.data.token);
            toast.success("Signed up with Google");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Google signup failed");
        }
    };

    return (
        <>
            <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 mb-40">
                {/* Left panel - Signup Form */}
                <div className="flex flex-col sm:items-center md:items-start justify-start relative md:pt-4 pb-10 w-full h-full">
                    {/* Logo at top-left inside left panel */}
                    <div className="mb-4 sm:mb-10 md:ml-6 flex items-center justify-center gap-2">
                        <Loader className="text-3xl font-bold text-blue-600" />
                        <h1 className="text-3xl font-bold text-black">HD</h1>
                    </div>

                    {/* Centered Form in remaining space */}
                    <div className="flex-1 w-full flex items-center justify-center">
                        <Card className="w-full max-w-md shadow-lg border-gray-200">
                            <CardHeader className="sm:text-center md:text-left">
                                <h2 className="text-3xl font-bold text-black">Sign up</h2>
                                <p className="text-sm text-muted-foreground">
                                    Sign up to enjoy the features of HD
                                </p>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Name */}
                                    <div className="flex flex-col gap-2 justify-center items-start">
                                        <Label htmlFor="name" className="text-left font-light">
                                            Your Name
                                        </Label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            placeholder="Jane Doe"
                                            className="border-gray-500"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* DOB */}
                                    <div className="flex flex-col gap-2 justify-center items-start">
                                        <Label htmlFor="dob" className="text-left font-light">
                                            Date of Birth
                                        </Label>
                                        <div className="relative w-full">
                                            <Input
                                                id="dob"
                                                type="date"
                                                {...register("dob")}
                                                className="border-gray-500"
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        {errors.dob && (
                                            <p className="text-sm text-red-500">{errors.dob.message}</p>
                                        )}
                                    </div>

                                    {/* Email + OTP */}
                                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                                        <Label htmlFor="email" className="text-left font-light">
                                            Email
                                        </Label>

                                        <div className="flex flex-col sm:flex-row w-full gap-2 items-stretch">
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder="janedoe@gmail.com"
                                                className="border-gray-500 w-full"
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

                                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 rounded-lg">
                                        Sign up
                                    </Button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow border-t" />
                                        <span className="text-sm text-muted-foreground">or</span>
                                        <div className="flex-grow border-t" />
                                    </div>

                                    {/* Google Signup */}
                                    <div className="w-full flex justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSignup}
                                            onError={() => toast.error("Google signup failed")}
                                        />
                                    </div>

                                    <p className="text-center text-sm mt-4">
                                        Already have an account?{" "}
                                        <span
                                            className="text-blue-600 cursor-pointer"
                                            onClick={() => navigate("/sign-in")}
                                        >
                                            Sign in
                                        </span>
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right panel - Image */}
                <div className="hidden md:block">
                    <img
                        src="/background.jpg"
                        alt="Signup Illustration"
                        className="w-full h-screen object-cover rounded-lg"
                    />
                </div>
            </div>
        </>
    );


};

export default Signup;