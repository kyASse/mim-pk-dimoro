import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MI Muhammadiyah Dimoro — Madrasah Ibtidaiyah Muhammadiyah Dimoro";
export const size = { width: 1200, height: 630 };
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
            width: "140px",
            height: "140px",
            borderRadius: "70px",
            backgroundColor: "#15803d",
            border: "4px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
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
            fontSize: "52px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "16px",
            letterSpacing: "1px",
          }}
        >
          MI Muhammadiyah Dimoro
        </div>

        {/* Full name */}
        <div
          style={{
            fontSize: "26px",
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
