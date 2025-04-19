
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/data";

interface VaultDetailErrorProps {
  error: Error | null | unknown;
}

const VaultDetailError: React.FC<VaultDetailErrorProps> = ({ error }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
      <div className="text-2xl font-bold text-destructive">⚠️ Error Loading Vault</div>
      <p className="text-muted-foreground">
        {error instanceof Error ? error.message : "Could not find the requested vault."}
      </p>
      <Button onClick={() => router.push(APP_ROUTES.VAULTS)}>
        Back to Vaults  
      </Button>
    </div>
  );
};  

export default VaultDetailError;
