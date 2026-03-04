import { ImageResponse } from "next/og";

export const alt = "BandUp — Free IELTS Mock Exams & Practice Tests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: "#60a5fa",
            marginBottom: 24,
            textTransform: "uppercase",
            letterSpacing: "4px",
            fontWeight: 700,
          }}
        >
          Free IELTS Mock Exams
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.1,
          }}
        >
          BandUp
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 32,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Practice with real exam questions and get instant AI-powered feedback
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#60a5fa",
            marginTop: 40,
            letterSpacing: "2px",
          }}
        >
          bandup.uz
        </div>
      </div>
    ),
    { ...size }
  );
}
