import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-8 animate-pulse">
            <div className="mb-4">
                <Skeleton className="h-10 w-32" />
            </div>
            
            <Skeleton className="relative w-full h-[400px] rounded-xl" />
            
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-48" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
            </div>
        </div>
    );
}
