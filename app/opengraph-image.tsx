import { ImageResponse } from "next/og";

export const alt = "Yexinmei Luo · Content · Community · Tech";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          background: "#f5f0e6",
          color: "#171717",
          padding: "72px 84px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 18,
            background: "#171717",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 84,
            top: 72,
            width: 74,
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "5px solid #171717",
            background: "#d94432",
            color: "#ffffff",
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          ♥
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            PLAYER PROFILE · PORTFOLIO
          </div>
          <div
            style={{
              marginTop: 38,
              display: "flex",
              fontSize: 76,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            YEXINMEI LUO
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            CONTENT · COMMUNITY · TECH
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              border: "4px solid #171717",
              background: "#171717",
              color: "#ffffff",
              padding: "16px 22px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            CONTENT OPS · COMMUNITY · CREATIVE
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
            CHENGDU · 2026
          </div>
        </div>
      </div>
    ),
    size
  );
}
