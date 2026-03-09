import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Corey Robison — Product Design & Strategy Leader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const imageData = await readFile(
    join(process.cwd(), "public/images/corey-1.jpg")
  );
  const base64Image = `data:image/jpeg;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #9ab4bf 0%, #b5c4b8 35%, #a8b5a3 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontFamily: "serif",
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            marginTop: -40,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Corey Robison
        </div>
        <img
          src={base64Image}
          width={340}
          height={453}
          style={{
            position: "absolute",
            bottom: -80,
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
