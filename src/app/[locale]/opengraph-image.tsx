import { ImageResponse } from "next/og";

export const size = { width: 200, height: 200 };
export const contentType = "image/png";
export const alt = "Yousef Abouteem";

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
          gap: 10,
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#fafafa",
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: -1.5,
          }}
        >
          <span>Yousef</span><span style={{ color: "#818cf8", marginLeft: -2 }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#71717a",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 4,
          }}
        >
          PORTFOLIO
        </div>
      </div>
    ),
    size,
  );
}
