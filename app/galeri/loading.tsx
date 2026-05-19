import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Page Header Skeleton Placeholder */}
            <div className="bg-highlight/10 py-20">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <Skeleton className="h-12 w-64 mx-auto rounded-xl" />
                    <Skeleton className="h-6 w-full max-w-md mx-auto rounded-lg" />
                </div>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">
                    {/* Filters Skeleton */}
                    <div className="flex justify-center gap-3 mb-12">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-28 rounded-full" />
                        ))}
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Card key={i} className="overflow-hidden border-none shadow-sm rounded-2xl">
                                <CardContent className="p-0">
                                    <AspectRatio ratio={4 / 3}>
                                        <Skeleton className="h-full w-full" />
                                    </AspectRatio>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
