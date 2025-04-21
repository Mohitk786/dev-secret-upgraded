import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const res = await axios.get("https://meme-api.com/gimme/ProgrammerHumor/1");
    const data = await res.data;

    return NextResponse.json({
      title: data.memes[0].title,
      imageUrl: data.memes[0].url,
      postLink: data.memes[0].postLink,
      author: data.memes[0].author,
    });
  } catch (err) {
    console.error("Meme fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch meme" }, { status: 500 });
  }
}
