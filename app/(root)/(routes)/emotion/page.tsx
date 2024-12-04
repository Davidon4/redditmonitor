import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import EmotionChart from "@/components/EmotionChart";


export default async function Emotion() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/");
    }

    return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
            <EmotionChart/>
        </div>
        </div>
    )
}