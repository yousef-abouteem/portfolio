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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #a855f7 100%)",
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        YA
      </div>
    ),
    size,
  );
}
