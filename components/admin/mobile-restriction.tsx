"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

interface MobileRestrictionProps {
  children: React.ReactNode;
}

export function MobileRestriction({ children }: MobileRestrictionProps) {
  const { isMobile, isLoading } = useMobileDetection();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Monitor className="h-16 w-16 text-primary" />
              <Smartphone className="h-8 w-8 text-muted-foreground absolute -bottom-2 -right-2" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl text-foreground">Desktop Required</h1>
            <p className="text-muted-foreground">
              Please use a desktop computer to access the admin panel. The admin
              interface is optimized for larger screens and requires desktop
              functionality for the best experience.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm text-foreground">Why desktop only?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Better file management experience</li>
              <li>• Enhanced security for admin operations</li>
              <li>• Optimized for keyboard and mouse interactions</li>
              <li>• Full feature access and better performance</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
