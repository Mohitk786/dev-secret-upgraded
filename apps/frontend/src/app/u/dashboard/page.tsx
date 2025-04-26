import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/data";
import { getDashboardStats } from "@/actions/actions";
import { redirect } from "next/navigation";

const recentActivity = [
  { id: 1, name: "AWS Development", type: "API Keys", time: "2 minutes ago", emoji: "🔑" },
  { id: 2, name: "GitHub Personal", type: "SSH Keys", time: "Yesterday", emoji: "🔐" },
  { id: 3, name: "MongoDB Atlas", type: "Database", time: "3 days ago", emoji: "💾" },
];


const Dashboard = async () => {

  
  const dashboardData = await getDashboardStats();
  
    if (!dashboardData) {
      redirect("/login"); 
    }

  return (
   
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary">✨</span> Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to DevVault - manage your development secrets securely.
          </p>
        </div>
        <Link href={APP_ROUTES.VAULTS_NEW}>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Vault
          </Button>
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vaults</CardTitle>
            <div className="text-2xl">🔒</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.vaultCount}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
            <div className="text-2xl">🔑</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.secretsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Stored securely
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Collaborators</CardTitle>
            <div className="text-2xl">⏱️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.collaboratorCount}</div>
            <p className="text-xs text-muted-foreground">
              contributing to your vaults
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shared With Me</CardTitle>
            <div className="text-2xl">🛡️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.sharedWithMe}</div>
            <p className="text-xs text-muted-foreground">
              End-to-end encrypted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and vaults */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🕒</span> Recent Activity
            </CardTitle>
            <CardDescription>Your most recently accessed secrets</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{activity.emoji}</div>
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-sm text-muted-foreground">{activity.type}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📂</span> Your Vaults
              </CardTitle>
              <CardDescription>Access your secure vaults</CardDescription>
            </div>
            <Link href={APP_ROUTES.VAULTS}>
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/90">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {dashboardData?.vaults && dashboardData?.vaults.length > 0 ? dashboardData?.vaults.map((vault:any) => (
                <li key={vault.id}>
                  <Link href={`/vaults/${vault.id}`}>
                    <div className="vault-card hover:border-primary/50 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{vault?.icon}</div>
                          <div>
                            <h3 className="font-medium group-hover:text-primary transition-colors">{vault.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {vault._count.secrets} secrets • created At: {vault.createdAt.split("T")[0]}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </li>
              )) : <div className="text-center text-muted-foreground">No vaults found</div>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  
  );
};

export default Dashboard;
