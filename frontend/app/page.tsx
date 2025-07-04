"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react"
import api from "@/lib/api"

export default function LandingPage() {

  //Saving the referral code to local storage:
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const ref = urlParams.get("ref")
    if (ref) {
      localStorage.setItem("referralCode", ref)
      //Trigger Referral Code clicked
      api.post("/referral/click", { referralCode: ref })
      console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                R
              </span>
            </div>
            <span className="font-bold text-xl">Referr</span>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            How It Works
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Turn Your Network Into
                  <span className="text-primary"> Revenue</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Launch your affiliate referral program in minutes. Empower
                  your customers to become brand ambassadors and drive
                  exponential growth.
                </p>
              </div>
              <div className="space-y-4 w-full max-w-sm">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  No credit card required • Setup in 5 minutes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Track Every Referral Metric
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get complete visibility into your referral performance with
                  detailed statistics and earn $10 for every conversion.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <CardTitle>Clicks</CardTitle>
                  <CardDescription>
                    Track every time your referral link is clicked in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary" />
                  <CardTitle>Signups</CardTitle>
                  <CardDescription>
                    Monitor users who sign up using your referral code.
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <CardTitle>Conversions</CardTitle>
                  <CardDescription>
                    Track users who complete onboarding after signing up.
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-primary" />
                  <CardTitle>Earnings</CardTitle>
                  <CardDescription>
                    Earn $10 for every successful conversion you generate.
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get your affiliate program up and running in three simple
                  steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Sign Up</h3>
                  <p className="text-muted-foreground">
                    Create your account and get verified in minutes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Get Referral Link</h3>
                  <p className="text-muted-foreground">
                    Receive your unique referral link and tracking code.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Invite People</h3>
                  <p className="text-muted-foreground">
                    Share your link with friends, family, and network.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  4
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Watch Revenue Grow</h3>
                  <p className="text-muted-foreground">
                    Earn $10 for every successful conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground mx-auto">
          © 2025 Referr. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
