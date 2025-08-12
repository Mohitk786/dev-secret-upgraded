import { ShieldCheck } from "lucide-react";

export default function AppBranding() {
  return (
    <div className="flex items-center gap-2 text-xl font-bold text-primary">
      <ShieldCheck className="w-5 h-5 " />
      <span>DevVault</span>
    </div>
  );
}
