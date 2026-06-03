"use client"

import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";
import { SearchInput } from "./searchInput";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {

    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/blog">
                    <h1 className="text-3xl font-bold">My<span className="text-primary">Blog</span></h1>
                </Link>

                <div className="flex items-center gap-2">

                    <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
                        Blog
                    </Link>

                    <Link className={buttonVariants({ variant: "ghost" })} href="/create">
                        Create
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:block mr-2">
                    <SearchInput />
                </div>
                {isLoading ? null : isAuthenticated ? (
                    <Button onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("Logged out successfully");
                                router.push("/auth/login")
                            },
                            onError: (error) => {
                                toast.error(error.error.message)
                            }
                        }
                    })}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Link className={buttonVariants()} href="/auth/sign-up">
                            Sign up
                        </Link>
                        <Link className={buttonVariants({ variant: "outline" })} href="/auth/login">
                            Login
                        </Link>
                    </>
                )}

                <ThemeToggle />
            </div>
        </nav>
    )
}