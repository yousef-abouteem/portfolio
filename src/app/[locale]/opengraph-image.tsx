import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yousef Abouteem";

const skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"];

export default function OpengraphImage() {
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
          gap: 48,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: -4,
          }}
        >
          Yousef Abouteem
          <span style={{ color: "#818cf8" }}>.</span>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {skills.map((skill) => (
            <div
              key={skill}
              style={{
                display: "flex",
                padding: "12px 28px",
                borderRadius: 999,
                border: "2px solid #27272a",
                fontSize: 30,
                color: "#a1a1aa",
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
