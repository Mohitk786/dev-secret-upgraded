import { serverFetch } from "@/lib/serverFetch";
import LayoutClient from "@/components/profile/LayoutClient";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
  const user = await serverFetch("/me"); 

  return <LayoutClient user={user}>{children}</LayoutClient>;
}
