"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Copy,
    Users,
    MousePointer,
    UserCheck,
    DollarSign,
    Trophy,
    Medal,
    Award,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { getAxiosErrorInfo } from "@/utils/handleAxiosError";
import { RawUserStatsDTO } from "../dtos/rawUserStats.dto"

const ITEMS_PER_PAGE = 10

export default function DashboardPage() {
    const router = useRouter()

    // User data - replace with API call
    const [userData, setUserData] = useState({
        name: "",
        referralLink: ""
    })

    const [userStats, setUserStats] = useState({
        stats: {
            clicks: 0,
            signups: 0,
            conversions: 0,
            earnings: 0,
        },
    })

    // Leaderboard data - replace with API call
    const [leaderboardData, setLeaderboardData] = useState<
        Array<{
            rank: number
            name: string
            conversions: number
            isCurrentUser?: boolean
        }>
    >([])

    // Loading states
    const [isLoadingUser, setIsLoadingUser] = useState(false)
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)

    const { success, error, ToastContainer } = useToast()

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoadingUser(true)
            try {

                const res = await api.get("/user/me")

                setUserData({
                    name: res?.data?.fullName, // If name/email is not returned by backend, keep them empty or fetch from another call
                    referralLink: `${window.location.origin}/?ref=${res?.data?.referralCode}`,
                })
            } catch (err: unknown) {
                console.error("Failed to fetch user data:", err)
                const { status, message, redirect } = getAxiosErrorInfo(err);

                if (status === 409) {
                    error("Finish onboarding!");
                    if (redirect) router.replace(redirect);
                } else if (status === 401) {
                    error("Token invalid/expired!");
                    if (redirect) router.replace(redirect);
                } else {
                    error(message);
                }
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchUserData()
    }, [error, router])

    // Fetch leaderboard data on component mount
    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setIsLoadingLeaderboard(true)
            try {
                const response = await api.get("/leaderboard")
                const rawData = response.data

                console.log("Parsed leaderboard data:", rawData)

                // Rename fields if needed (e.g., fullName → name)
                const mapped = rawData.data.map((item: RawUserStatsDTO) => ({
                    rank: item.rank,
                    name: item.fullName,
                    conversions: item.conversions,
                    isCurrentUser: item.isUser,
                }))

                setLeaderboardData(mapped)
            } catch (err: unknown) {
                const { status, redirect, message } = getAxiosErrorInfo(err);
                if (status === 409) {
                    error("Finish onboarding!");
                    if (redirect) router.replace(redirect);
                } else if (status === 401) {
                    error("Token invalid/expired!");
                    if (redirect) router.replace(redirect);
                } else {
                    error(message);
                }
                console.error("Failed to fetch leaderboard data:", err)
            } finally {
                setIsLoadingLeaderboard(false)
            }
        }
        fetchLeaderboardData()
    }, [error, router])

    //Fetch Userstats
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await api.get("/stats/me")
                const data = response.data
                setUserStats({
                    stats: {
                        clicks: data.clicks,
                        signups: data.signups,
                        conversions: data.conversions,
                        earnings: data.earnings,
                    },
                })
            } catch (err: unknown) {
                console.error("Failed to fetch user stats:", err);

                const { status, message, redirect } = getAxiosErrorInfo(err);

                if (status === 409) {
                    error("Finish onboarding!");
                    if (redirect) router.replace(redirect);
                } else if (status === 401) {
                    error("Token invalid/expired!");
                    if (redirect) router.replace(redirect);
                } else {
                    error(message);
                }
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchUserStats()
    }, [error, router])

    // Pagination calculations
    const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentLeaderboard = leaderboardData.slice(startIndex, endIndex)

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            router.replace("/");
        } catch (error: unknown) {
            console.error("Logout failed:", error);
        }
    }


    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            success("Referral link copied to clipboard!")
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea")
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            try {
                document.execCommand("copy")
                success("Referral link copied to clipboard!")
            } catch (fallbackErr) {
                console.error("Failed to copy text: ", fallbackErr)
            }
            document.body.removeChild(textArea)
        }
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />
            default:
                return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
        }
    }

    const goToPage = (page: number) => {
        setCurrentPage(page)
    }

    const goToPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const goToNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show smart pagination
            if (currentPage <= 3) {
                // Show first 5 pages
                for (let i = 1; i <= 5; i++) {
                    pages.push(i)
                }
                if (totalPages > 5) {
                    pages.push("...")
                    pages.push(totalPages)
                }
            } else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                pages.push(1)
                if (totalPages > 5) {
                    pages.push("...")
                }
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show pages around current page
                pages.push(1)
                pages.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
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
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <span className="text-sm text-muted-foreground">Welcome back, {userData.name || "User"}!</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </nav>
            </header>

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Title */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Track your referral performance and earnings</p>
                    </div>

                    {/* Referral Link Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ExternalLink className="h-5 w-5" />
                                Your Referral Link
                            </CardTitle>
                            <CardDescription>Share this link with others to start earning commissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    value={userData.referralLink || "Your referral link will appear here"}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    onClick={() => copyToClipboard(userData.referralLink)}
                                    className="shrink-0"
                                    disabled={!userData.referralLink}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Earn $10 for every successful conversion through your link
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Referral Clicks</CardTitle>
                                <MousePointer className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoadingUser ? "..." : userStats.stats.clicks.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">Total clicks on your referral link</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Signups</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isLoadingUser ? "..." : userStats.stats.signups}</div>
                                <p className="text-xs text-muted-foreground">Users who signed up via your link</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isLoadingUser ? "..." : userStats.stats.conversions}</div>
                                <p className="text-xs text-muted-foreground">Users who completed onboarding</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isLoadingUser ? "..." : `$${userStats.stats.earnings}`}</div>
                                <p className="text-xs text-muted-foreground">Total commission earned</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Leaderboard
                                    </CardTitle>
                                    <CardDescription>Top performers by conversions this month</CardDescription>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {leaderboardData.length > 0 ? (
                                        <>
                                            Showing {startIndex + 1}-{Math.min(endIndex, leaderboardData.length)} of {leaderboardData.length}
                                        </>
                                    ) : (
                                        "No data available"
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoadingLeaderboard ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">Loading leaderboard...</p>
                                    </div>
                                ) : leaderboardData.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No leaderboard data available</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block">
                                            <div className="rounded-md border">
                                                <div className="grid grid-cols-3 gap-4 p-4 font-medium text-sm bg-muted/50">
                                                    <div>Rank</div>
                                                    <div>Name</div>
                                                    <div className="text-right">Conversions</div>
                                                </div>
                                                {currentLeaderboard.map((user) => (
                                                    <div
                                                        key={user.rank}
                                                        className={`grid grid-cols-3 gap-4 p-4 border-t transition-colors ${user.isCurrentUser ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">{getRankIcon(user.rank)}</div>
                                                        <div className={`font-medium ${user.isCurrentUser ? "text-primary" : ""}`}>
                                                            {user.name}
                                                            {user.isCurrentUser && (
                                                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right font-semibold">{user.conversions}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-3">
                                            {currentLeaderboard.map((user) => (
                                                <div
                                                    key={user.rank}
                                                    className={`p-4 rounded-lg border ${user.isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-white"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {getRankIcon(user.rank)}
                                                            <div>
                                                                <div className={`font-medium ${user.isCurrentUser ? "text-primary" : ""}`}>
                                                                    {user.name}
                                                                </div>
                                                                {user.isCurrentUser && (
                                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">You</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">{user.conversions}</div>
                                                            <div className="text-xs text-muted-foreground">conversions</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToPrevious}
                                                        disabled={currentPage === 1}
                                                        className="h-8 w-8 p-0 bg-transparent"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>

                                                    <div className="flex items-center gap-1">
                                                        {getPageNumbers().map((page, index) => (
                                                            <div key={index}>
                                                                {page === "..." ? (
                                                                    <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                                                                ) : (
                                                                    <Button
                                                                        variant={currentPage === page ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => goToPage(page as number)}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        {page}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToNext}
                                                        disabled={currentPage === totalPages}
                                                        className="h-8 w-8 p-0 bg-transparent"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    Page {currentPage} of {totalPages}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
