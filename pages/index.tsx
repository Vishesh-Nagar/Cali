import Calendar from "@/components/common/Calendar";
import React from "react";

const Index = () => {
    return (
        <div className="w-full flex items-start justify-center min-h-screen gap-16">
            <main className="flex flex-col items-start w-full h-full">
                <Calendar />
            </main>
        </div>
    );
};

export default Index;