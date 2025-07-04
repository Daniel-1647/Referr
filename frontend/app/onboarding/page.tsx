"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Globe, MapPin, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { getAxiosErrorInfo } from "@/utils/handleAxiosError";

export default function OnboardingPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        state: "",
        country: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { success, error, ToastContainer } = useToast()

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName.trim()) {
            error("Please enter your full name");
            return;
        }
        if (!formData.country.trim()) {
            error("Please enter your country");
            return;
        }
        if (!formData.state.trim()) {
            error("Please enter your state");
            return;
        }

        setIsLoading(true);

        try {
            await api.post("/onboarding", formData);

            success("Welcome aboard! Redirecting to dashboard...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: unknown) {
            const { message, status, redirect } = getAxiosErrorInfo(
                err,
                "Something went wrong during onboarding."
            );

            if (status === 409 || status === 401) {
                success(message);
                setTimeout(() => {
                    router.push(redirect || "/dashboard");
                }, 1500);
            } else {
                console.error("Onboarding failed:", err);
                error(message);
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <ToastContainer />

            {/* Header */}
            <header className="bg-white px-4 lg:px-6 h-16 flex items-center border-b shadow-sm">
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
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <UserPlus className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
                            <CardDescription className="text-base">
                                Please provide the below information to finish onboarding
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        disabled={isLoading}
                                        className="h-11"
                                    />
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Country
                                    </Label>
                                    <Input
                                        id="country"
                                        type="text"
                                        placeholder="Enter your country"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange("country", e.target.value)}
                                        disabled={isLoading}
                                        className="h-11"
                                    />
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        State
                                    </Label>
                                    <Input
                                        id="state"
                                        type="text"
                                        placeholder="Enter your state"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange("state", e.target.value)}
                                        disabled={isLoading}
                                        className="h-11"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                                    {isLoading ? "Creating Your Profile..." : "Complete Onboarding"}
                                </Button>
                            </form>

                            {/* Progress Indicator */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Step 2 of 2</span>
                                    <span>Almost done!</span>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full w-full transition-all duration-300"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
