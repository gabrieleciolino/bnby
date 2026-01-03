"use client";

import { logoutAction } from "@/components/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { urls } from "@/lib/urls";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const [isLoggingOut, startLoggingOut] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startLoggingOut(async () => {
      try {
        await logoutAction();
        router.push(urls.auth.login);
      } catch (error) {
        toast.error("Errore durante il logout");
      }
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout}>
      <LogOut className="size-5" />
    </Button>
  );
}
