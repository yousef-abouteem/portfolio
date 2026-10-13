import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yousef Abouteem — Software Engineer & Frontend Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#10b981",
            }}
          />
          Open to work · Istanbul & Remote
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            Yousef Abouteem
            <span style={{ color: "#818cf8" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#a1a1aa" }}>
            Software Engineer & Frontend Developer
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>
          React · Next.js · TypeScript · PostgreSQL
        </div>
      </div>
    ),
    size,
  );
}
