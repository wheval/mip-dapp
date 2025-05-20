import { Skeleton } from "@/src/components/ui/skeleton"
import { Card, CardContent } from "@/src/components/ui/card"

export default function CoinLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    {index < 2 && <Skeleton className="h-1 w-8" />}
                  </div>
                ))}
              </div>
              <Skeleton className="h-5 w-40" />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-[300px] w-full rounded-xl mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-7 w-32 mb-4" />
                <Skeleton className="h-[200px] w-full rounded-xl mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-6 w-16 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-6 w-16 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
