import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => {
    return (
        <div className="py-6">
            {/* Profile Details Section */}
            <Skeleton className="h-8 w-48 mb-6" />

            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-16 w-16 rounded-full" />

                <div className="flex-1">
                    <Skeleton className="h-6 w-64 mb-2" />
                </div>

                <Skeleton className="h-10 w-24 rounded-full" />
            </div>

            {/* Feedback Statistics Section */}
            <Skeleton className="h-8 w-48 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6">
                    <div className="flex flex-col">
                        <Skeleton className="h-5 w-24 mb-4" />
                        <Skeleton className="h-7 w-8" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex flex-col ">
                        <Skeleton className="h-5 w-24 mb-4" />
                        <Skeleton className="h-7 w-8" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex flex-col ">
                        <Skeleton className="h-5 w-24 mb-4" />
                        <Skeleton className="h-7 w-8" />
                    </div>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
            </div>

            {/* Cryptocurrency Address Cards */}
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-4 flex items-center gap-2 border-b">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-40" />
                        </div>

                        <div className="p-4">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-16 w-full rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfileSkeleton;