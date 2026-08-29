import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AdminMobileHeader } from "@/components/admin/navigation/AdminMobileHeader"
import { AdminNavigationWrapper } from "@/components/admin/navigation/AdminNavigationWrapper"

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Admin dashboard for managing the application",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 w-full min-w-0">
                    <AdminMobileHeader />
                    <header className="hidden md:flex items-center gap-2 px-4 py-2 border-b bg-background">
                        <SidebarTrigger />
                        <div className="ml-auto">
                            <ThemeSwitcher />
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 bg-gray-50 dark:bg-gray-900">
                        {children}
                    </main>
                    <AdminNavigationWrapper />
                </div>
            </SidebarProvider>
        </ThemeProvider>
    );
}