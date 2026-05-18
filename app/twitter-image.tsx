import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MI Muhammadiyah Dimoro — Madrasah Ibtidaiyah Muhammadiyah Dimoro";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#16a34a",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#15803d",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            backgroundColor: "#15803d",
            border: "4px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ffffff",
              letterSpacing: "2px",
            }}
          >
            MIM
          </span>
        </div>

        {/* School name */}
        <div
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "14px",
            letterSpacing: "1px",
          }}
        >
          MI Muhammadiyah Dimoro
        </div>

        {/* Full name */}
        <div
          style={{
            fontSize: "24px",
            color: "#bbf7d0",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          Madrasah Ibtidaiyah Muhammadiyah Dimoro
        </div>

        {/* Decorative bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#15803d",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
