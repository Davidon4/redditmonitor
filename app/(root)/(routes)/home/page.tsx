import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import SubredditSelector from "@/components/SubredditSelector";

export default async function Home() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/");
    }   

    return (
        <div className="min-h-screen bg-gray-50 mx-auto px-4 py-6">
            <div className="max-w-7xl mx-auto">
                    <SubredditSelector defaultSubreddit="" />
            </div>
        </div>
    );
}