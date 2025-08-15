import ProfileDropdownClient from "@/components/profile/profile-dropdown";
import { serverFetch } from "@/lib/serverFetch";

export default async function ProfileDropdown() {
  const {user} = await serverFetch("/me");
  return <ProfileDropdownClient user={user} />;
}
