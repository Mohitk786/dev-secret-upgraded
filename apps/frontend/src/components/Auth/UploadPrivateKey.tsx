"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useToast from "@/hooks/utils/useToast";
import { isValidPrivateKey } from "@/E2E/rsaKeyGen";
import { useRouter } from "next/navigation";

const UploadPrivateKey = () => {

    const router = useRouter();
    const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
    const { showToast } = useToast();

    const handleSubmit = async () => {
        try {
            const text = await privateKeyFile?.text() as string;

            const isValid = await isValidPrivateKey(text);
            if (!isValid) {
                showToast({
                    type: "error",
                    message: "Invalid private key",
                });
            }

            localStorage.setItem("PRIVATE_KEY", text);

            showToast({
                type: "success",
                message: "Private key uploaded successfully!",
            });

            router.push("/");


        } catch (err) {
            showToast({
                type: "error",
                message: "Failed to read the private key file",
            });
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
        <div className="p-6 flex flex-col gap-6 mt-12 justify-center items-centerp-8 rounded-xl shadow-lg max-w-lg mx-auto">
            <div className="text-center ">
                <h1 className="text-3xl font-bold mb-4">🔐 Verify Your Identity</h1>
                <p className="text-lg mb-6">Upload your private key to verify your identity and ensure secure access.</p>
            </div>

            <div className="w-full mb-6">
                <Label htmlFor="privateKey" className=" mb-2">Private Key</Label>
                <Input
                    type="file"
                    placeholder="Upload your private key"
                    onChange={handleFileChange}
                    className=" cursor-pointer text-gray-700 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-400 to-teal-500  rounded-lg shadow-xl py-2 px-6 hover:scale-105 transition-all duration-200 focus:outline-none"
            >
                Verify
            </Button>
        </div>
    );
};

export default UploadPrivateKey;
