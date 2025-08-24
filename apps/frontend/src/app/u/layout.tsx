import { serverFetch } from "@/lib/serverFetch";
import LayoutClient from "@/components/profile/LayoutClient";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
  const userRes = await serverFetch("/me"); 

  if (!userRes.success) {
    return <div>Error: {userRes.error}</div>;
  }

  const user = userRes.data?.user;

  return <LayoutClient user={user}>{children}</LayoutClient>;
}
