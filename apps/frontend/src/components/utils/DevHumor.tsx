"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getRandomDevMeme } from "@/services/extraServices";

export function DevHumorDrawer() {
  const [open, setOpen] = useState(false);
  const [meme, setMeme] = useState<null | {
    title: string;
    imageUrl: string;
    postLink: string;
    author: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const fetchMeme = async () => {
    setLoading(true);
    try {
      const meme = await getRandomDevMeme();
      setMeme(meme);
    } catch (err) {
      console.error("Failed to fetch meme", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchMeme();
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-50 bg-purple-700 hover:bg-purple-800 text-white">
          🐸 DevHumor Mode
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mx-auto rounded-t-2xl p-4">
        <DrawerHeader>
          <DrawerTitle>Here’s your dev meme 🧠</DrawerTitle>
          <DrawerDescription>Take a break, you earned it.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-4 px-4 py-2">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : meme ? (
            <>
              <img
                onClick={() => window.open(meme.imageUrl, "_blank")}
                src={meme.imageUrl}
                alt={meme.title}
                className="max-h-64 w-full object-contain rounded-lg shadow"
              />
              <p className="text-sm text-muted-foreground">By {meme.author}</p>
              <a
                href={meme.postLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                View on Reddit
              </a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No meme found. 😢</p>
          )}
          <Button onClick={fetchMeme} className="mt-2 w-full">
            🔁 Show me another one
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
