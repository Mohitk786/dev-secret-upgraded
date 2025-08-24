import ProfileDropdownClient from "@/components/profile/profile-dropdown";
import { serverFetch } from "@/lib/serverFetch";

export default async function ProfileDropdown() {
  const userRes = await serverFetch("/me");

  if (!userRes.success) {
    return <div>Error: {userRes.error}</div>;
  }

  const user = userRes.data?.user;

  return <ProfileDropdownClient user={user} />;
}
