import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import TrendChart from "@/components/TrendChart";


export default async function Trendingnow() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
            <TrendChart />
        </div>
        </div>
    )
}