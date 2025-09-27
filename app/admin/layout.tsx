"use client";

import { usePathname } from "next/navigation";
import { AdminNavigation } from "@/components/admin/navigation";
import { AuthGuard } from "@/components/admin/auth-guard";
import { MobileRestriction } from "@/components/admin/mobile-restriction";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Don't wrap login page with auth guard or navigation, but still apply mobile restriction
    return (
      <MobileRestriction>
        <div className="min-h-screen bg-background">{children}</div>
      </MobileRestriction>
    );
  }

  return (
    <MobileRestriction>
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <AdminNavigation />
          <main className="lg:ml-64">
            <div className="p-4 lg:p-8">{children}</div>
          </main>
        </div>
      </AuthGuard>
    </MobileRestriction>
  );
}
