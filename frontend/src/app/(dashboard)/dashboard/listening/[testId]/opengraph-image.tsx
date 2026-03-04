import { ImageResponse } from "next/og";
import { findOne } from "@/lib/strapi/api";

export const alt = "BandUp IELTS Listening Practice Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await findOne("tests", testId, { fields: ["title"] });

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
            fontSize: 28,
            color: "#60a5fa",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: 700,
          }}
        >
          Listening Practice Test
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.2,
          }}
        >
          {test?.title || "IELTS Listening Mock Exam"}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 30,
          }}
        >
          bandup.uz — Free IELTS Preparation
        </div>
      </div>
    ),
    { ...size }
  );
}
