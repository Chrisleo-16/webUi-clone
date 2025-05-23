import { Card } from "@/components/ui/card";

const OrdersSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <Card key={index} className="flex flex-col gap-2 p-6 animate-pulse">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-gray-300"></div>
                            <div>
                                <div className="h-3 bg-gray-300 rounded w-[6rem] mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-[4rem] "></div>
                            </div>
                        </div>
                        <div className="h-10 w-[6rem] bg-gray-300 rounded-md"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-[20%]"></div>
                    <div className="h-3 bg-gray-300 rounded w-[10%]"></div>
                    <div className="h-3 bg-gray-300 rounded w-[5%]"></div>
                </Card>
            ))}
        </div>
    );
}

export default OrdersSkeleton