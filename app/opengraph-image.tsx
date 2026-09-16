import { ImageResponse } from "next/og";

export const alt = "Yexinmei Luo · Content · AI Product · Tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const proofCards = [
  { label: "NOW", value: "ZHIHU", detail: "DIGITAL / NEW PRODUCT" },
  { label: "BUILT", value: "RED LEAF", detail: "0→1 AI PRODUCT" },
  { label: "RESULT", value: "20W+ GMV", detail: "CCD SIDE PROJECT" },
  { label: "EDU", value: "UESTC · 2027", detail: "JOURNALISM & COMMUNICATION" },
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f2e8",
          color: "#1d1d1a",
          border: "10px solid #1d1d1a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            height: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 42px",
            borderBottom: "3px solid #1d1d1a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, background: "#bf382b", transform: "rotate(45deg)" }} />
            <div style={{ display: "flex", fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>PERSONAL PORTFOLIO</div>
          </div>
          <div style={{ display: "flex", fontSize: 15, fontWeight: 800, letterSpacing: 3 }}>BUILD · LEARN · CREATE ↗</div>
        </div>

        <div style={{ display: "flex", flex: 1, padding: 22, gap: 22 }}>
          <div
            style={{
              width: "59%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "#1d1e1b",
              color: "#fffdf8",
              padding: "44px 46px 38px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 16, letterSpacing: 4, color: "#c7c0b5" }}>HELLO, I’M</div>
              <div style={{ marginTop: 22, display: "flex", fontSize: 64, fontWeight: 900, lineHeight: 1 }}>YEXINMEI</div>
              <div style={{ marginTop: 2, display: "flex", fontSize: 64, fontWeight: 900, lineHeight: 1, color: "#bf382b" }}>LUO</div>
              <div style={{ marginTop: 28, display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: 1.2 }}>
                CONTENT · AI PRODUCT · TECH
              </div>
              <div style={{ marginTop: 18, display: "flex", maxWidth: 560, fontSize: 16, lineHeight: 1.7, color: "#c4bdb2" }}>
                CONTENT OPS, COMMUNITY, DIGITAL PRODUCTS, CREATIVE SIDE PROJECTS.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 3, background: "#bf382b" }} />
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>MAKE CURIOSITY VISIBLE.</div>
            </div>
          </div>

          <div style={{ width: "41%", display: "flex", flexDirection: "column", gap: 10 }}>
            {proofCards.map((card, index) => (
              <div
                key={card.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "18px 22px",
                  border: "2px solid #1d1d1a",
                  background: index === 1 ? "#f0e5dd" : "#fffdf8",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", fontSize: 12, fontWeight: 900, letterSpacing: 2, color: "#bf382b" }}>{card.label}</div>
                  <div style={{ width: 8, height: 8, background: index === 1 ? "#bf382b" : "#1d1d1a" }} />
                </div>
                <div style={{ marginTop: 8, display: "flex", fontSize: 25, fontWeight: 900, letterSpacing: .4 }}>{card.value}</div>
                <div style={{ marginTop: 6, display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: "#716a60" }}>{card.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 42px",
            borderTop: "2px solid #1d1d1a",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#6b645b",
          }}
        >
          <div style={{ display: "flex" }}>YEXINMEI LUO · PORTFOLIO</div>
          <div style={{ display: "flex", color: "#bf382b" }}>GOOD IDEAS · BETTER THINGS ♥</div>
        </div>
      </div>
    ),
    size
  );
}
