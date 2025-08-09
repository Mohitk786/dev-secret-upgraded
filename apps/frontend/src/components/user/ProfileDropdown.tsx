import ProfileDropdownClient from "@/components/profile/profile-dropdown";
import { serverFetch } from "@/lib/serverFetch";

export default async function ProfileDropdown() {
  const user = await serverFetch("/me");
  console.log("user", user);
  return <ProfileDropdownClient user={user} />;
}
