import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen pb-24">
      {/* Page Header Skeleton Placeholder */}
      <div className="bg-primary/10 py-12 md:py-16 mb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Skeleton className="h-5 w-40 mx-auto rounded-full" />
          <Skeleton className="h-10 md:h-12 w-64 md:w-80 mx-auto rounded-2xl" />
          <Skeleton className="h-5 w-full max-w-md mx-auto rounded-lg" />
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {/* Control Bar Skeleton (Search Bar + Category Filter Pills) */}
        <section className="bg-card/70 border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
          <Skeleton className="h-12 max-w-2xl mx-auto rounded-full" />
          <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
            {[100, 115, 130, 95, 125].map((width, i) => (
              <Skeleton
                key={i}
                className="h-9 rounded-full"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>
        </section>

        {/* Hero Spotlight Skeleton Card */}
        <section className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[460px]">
            <Skeleton className="lg:col-span-7 h-64 sm:h-80 lg:h-full min-h-[280px] w-full rounded-none" />
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
              </div>
              <div className="pt-6 border-t border-border/50 flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-10 w-36 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Masonry Columns Skeleton with Varied Card Heights */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
            {["h-72", "h-96", "h-64", "h-80", "h-80", "h-64", "h-96", "h-72"].map(
              (heightClass, index) => (
                <div key={index} className="break-inside-avoid mb-6">
                  <Card className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
                    <CardContent className="p-0">
                      <Skeleton className={`w-full ${heightClass} rounded-3xl`} />
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
