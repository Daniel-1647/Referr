"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { OTPInput } from "@/components/ui/otp-input"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { getAxiosErrorInfo } from "@/utils/handleAxiosError"
type LoginStep = "email" | "otp"

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpLength] = useState(6)

  const router = useRouter()

  const { success, error, ToastContainer } = useToast()

  const [referralCode, setReferralCode] = useState("")

  //Fetch the referral code
  useEffect(() => {
    const storedRef = localStorage.getItem("referralCode")
    if (storedRef) {
      setReferralCode(storedRef)
    }
  }, [])

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await api.get("/user/me");
        const hasOnboarded = res.data?.hasOnboarded;

        if (hasOnboarded) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } catch (err: unknown) {
        const { status, message } = getAxiosErrorInfo(err);
        if (status === 401) {
          console.error(message);
        } else {
          console.error("Unexpected error checking login:", message);
          error("Something went wrong. Please try again.");
        }
      }
    };

    checkIfLoggedIn();
  }, [router, error]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const res = await api.post("/auth/request-otp", { email })
      console.log("OTP sent:", res.data)
      success("Verification code sent to your email!")
      setStep("otp")
    } catch (err: unknown) {
      const { message } = getAxiosErrorInfo(err);
      console.error("Failed to send OTP:", message)
      error(message || "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== otpLength) return;

    setIsLoading(true);

    try {
      await api.post("/auth/verify-otp", {
        email: email,
        otp: otp,
        referredBy: referralCode
      });


      //Clear the referral code from the local storage
      localStorage.removeItem("referralCode")
      success("Logging in...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const { message } = getAxiosErrorInfo(err);
      console.error(message);
      error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      await api.post("/auth/request-otp", { email })
      success("New verification code sent!")
      setOtp("")
    } catch (err: unknown) {
      const { message } = getAxiosErrorInfo(err);
      console.error(message);
      error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl">Referr</span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                {step === "otp" && (
                  <Button variant="ghost" size="sm" onClick={() => setStep("email")} className="p-1 h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  {step === "email" ? (
                    <Mail className="h-5 w-5 text-primary" />
                  ) : (
                    <Shield className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-2xl">
                    {step === "email" ? "Access your account" : "Verify your email"}
                  </CardTitle>
                </div>
              </div>
              <CardDescription>
                {step === "email"
                  ? "Enter your email address to access your referral dashboard"
                  : `We've sent a ${otpLength}-digit code to ${email}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending verification code..." : "Send verification code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification code</Label>
                    <OTPInput length={otpLength} value={otp} onChange={setOtp} disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== otpLength}>
                    {isLoading ? "Verifying..." : "Access Dashboard"}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Didn&apos;t receive the code? Resend
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
