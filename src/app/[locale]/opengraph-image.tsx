import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 200, height: 200 };
export const contentType = "image/png";
export const alt = "Yousef Abouteem";

export default async function OpengraphImage() {
  const profile = await prisma.profile.findUnique({
    where: { id: "main" },
    select: { avatarUrl: true },
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        {profile?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            width={200}            height={200}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div style={{ display: "flex", color: "#fafafa", fontSize: 200, fontWeight: 700 }}>
            Y<span style={{ color: "#818cf8" }}>.</span>
          </div>
        )}
      </div>
    ),
    size,
  );
}
