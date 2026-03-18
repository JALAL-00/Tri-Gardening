import { Suspense } from "react";
import ChatInterface from "@/components/plant-clinic/ChatInterface";

export default function PlantClinicPage() {
    return (
        <div className="bg-[#FEFBF6] min-h-[80vh]">
            <Suspense fallback={<div className="flex items-center justify-center min-h-[80vh]">Loading...</div>}>
                <ChatInterface />
            </Suspense>
        </div>
    );
}