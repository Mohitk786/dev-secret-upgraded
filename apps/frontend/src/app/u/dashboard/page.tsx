
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/data";
import Stats from "./Stat";
import { Suspense } from "react";

const Dashboard = async () => {

  return (
   
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-primary text-3xl font-bold tracking-tight flex items-center gap-2">
              <span>✨</span> Dashboard
            </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to DevVault - manage your development secrets securely.
          </p>
        </div>
        <Link href={APP_ROUTES.VAULTS_NEW}>
              <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Vault
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}> 
        <Stats />
      </Suspense>

    </div>
  
  );
};

export default Dashboard;
