"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useToast from "@/hooks/utils/useToast";
import { isValidPrivateKey } from "@/E2E/rsaKeyGen";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";

const UploadPrivateKey = () => {
  const router = useRouter();
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      const text = (await privateKeyFile?.text()) as string;

      const isValid = await isValidPrivateKey(text);
      if (!isValid) {
        showToast({ type: "error", message: "Invalid private key" });
        return;
      }

      localStorage.setItem("PRIVATE_KEY", text);

      showToast({ type: "success", message: "Private key uploaded successfully!" });
      router.push("/");
    } catch (err) {
      showToast({ type: "error", message: "Failed to read the private key file" });
      console.error("File reading error:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrivateKeyFile(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
           <Card className="w-full max-w-md p-8 rounded-3xl shadow-xl border border-devvault-electric-blue/30 bg-devvault-graphite">
      <div className="w-full max-w-md text-white p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🔐 Verify Your Identity</h1>
          <p className="text-base text-white/80">
            Upload your private key to verify your identity and ensure secure access.
          </p>
        </div>

        <div>
          <Label htmlFor="privateKey" className="mb-2 block">
            Private Key
          </Label>
          <Input
            id="privateKey"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer  file:border-none file:px-4 file:py-2 file:rounded-md  border border-white/30 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!privateKeyFile}
          className="w-full bg-gradient-to-r from-green-400 to-teal-500 rounded-lg shadow-xl py-2 px-6 hover:scale-105 transition-all duration-200 text-white font-semibold"
        >
          Verify
        </Button>
      </div>
      </Card>
    </div>
  );
};

export default UploadPrivateKey;
