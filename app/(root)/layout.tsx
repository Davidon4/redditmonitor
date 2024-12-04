import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <SidebarProvider>
        <div className="h-screen w-full flex">
          <AppSidebar />
          <main className="flex-1 h-full overflow-y-auto">
            <div className="h-full px-4">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }