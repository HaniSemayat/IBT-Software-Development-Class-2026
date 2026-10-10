import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Addis Eats Ethiopian food delivery";
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
          justifyContent: "center",
          alignItems: "center",
          background: "#fff7ed",
          color: "#171717",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ea580c",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          ADDIS ABABA
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 800,
            marginTop: 20,
          }}
        >
          Addis Eats
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            marginTop: 24,
          }}
        >
          Ethiopian favorites, delivered with ease.
        </div>
      </div>
    ),
    size
  );
}
