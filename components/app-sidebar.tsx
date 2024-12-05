'use client'

import { Eye, Settings, Bot, TrendingUp, Tag, ChevronUp, Vote, Home, LogOut, HelpCircle, ChevronDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useId } from 'react';
import Script from 'next/script';
import { useSubredditStore } from '@/lib/store/subreddit';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Pricing from '@/components/Pricing';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Top Posts", url: "/trending-now", icon: TrendingUp },
  { title: "Top Keywords", url: "/keyword", icon: Tag },
  { title: "Emotion", url: "/emotion", icon: Eye },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;
  const pathname = usePathname();
  const availableSubreddits = useSubredditStore((state) => state.availableSubreddits);
  console.log("Available Subreddits=>", availableSubreddits);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Calculate progress
  const maxSubreddits = 3;
  const currentCount = availableSubreddits.length;
  const progressValue = (currentCount / maxSubreddits) * 100;



interface SupportDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SupportDialog = ({ isOpen, onClose }: SupportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg p-6 bg-white">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Contact Support
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-gray-600">
            For any issues or questions, please contact us at:
          </p>
          <a
            href="mailto:admin@subreddittraffic.live"
            className="mt-2 block text-purple-600 hover:text-purple-700 font-medium"
          >
            reddimonnow@gmail.com
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

 const SuggestFeatureButton = () => {
    const sessionKey = useId();
  
    return (
      <>
  <button
  onClick={() => {
  // @ts-expect-error - External widget function not typed
    window.openFeatureRequestPopup();
  }}
  className="flex items-center space-x-2 w-full hover:bg-purple-100 px-3 py-2 rounded-lg cursor-pointer transition-colors"
>
  <Vote className="w-5 h-5" />
  <span className="text-sm font-medium">Feature Requests</span>
</button>
<Script
  key={sessionKey}
  src={`https://features.vote/widget/widget.js?sessionKey=${sessionKey}`}
  // @ts-expect-error - External widget function not typed
  color_mode="light"
  user_id={session?.user?.id}
  user_email={session?.user?.email}
  user_name={session?.user?.name}
  img_url={session?.user?.image}
  user_spend={0}
  slug="reddimon"
/>
</>
);
};

  const handleLogout = () => {
    signOut();
  };

  const handleSupport = () => {
    setIsSupportOpen(true);
  };

  return (
    <>
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center space-x-3 px-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
            Reddimon
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                        "hover:bg-purple-50 hover:text-purple-700",
                        pathname === item.url
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-gray-600"
                      )}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        pathname === item.url ? "text-purple-700" : "text-gray-500"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto px-4 pb-6">
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-xl space-y-3">
            <SuggestFeatureButton/>
            <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 shadow-md transform hover:translate-y-[-1px] transition-all">
                    Upgrade Plan
                  </Button>
                </DialogTrigger>
          <DialogContent className="max-w-sm p-4 my-4 max-h-[95vh] overflow-y-auto sm:my-8">
        <DialogHeader>
          <VisuallyHidden>
          {/* <DialogTitle className="sr-only"> */}
            UPGRADE YOUR PLAN
            </VisuallyHidden>
          {/* </DialogTitle> */}
        </DialogHeader>
        <div className="px-2 py-4">
        <Pricing onClick={() => {}} buttonText="Upgrade" />
        </div>
      </DialogContent>
              </Dialog>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Usage</span>
                <span>{currentCount}/{maxSubreddits} subreddits</span>
              </div>
              <Progress value={progressValue} className="h-2.5 bg-purple-200" variant="purple" />
            </div>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full mt-4 p-3 hover:bg-purple-50">
              <div className="flex items-center w-full">
                <Avatar className="h-10 w-10 rounded-lg border-2 border-purple-200">
                  <AvatarImage src={userImage || ""} alt={userName || "User"} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {userName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-3 text-left flex-grow">
                  <span className="font-semibold text-gray-800">{userName}</span>
                  <span className="text-xs text-gray-500 truncate">{userEmail}</span>
                </div>
                <div className="flex flex-col space-y-[-0.6rem]">
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start" side="right">
            <div className="flex items-center space-x-3 p-2">
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage src={userImage || ""} alt={userName || "User"} />
                <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{userName}</span>
                <span className="text-sm text-gray-500">{userEmail}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-1">
              <Button
                onClick={handleSupport}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Support
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Sidebar>

<SupportDialog 
isOpen={isSupportOpen}
onClose={() => setIsSupportOpen(false)}
/>
</>
  );
}