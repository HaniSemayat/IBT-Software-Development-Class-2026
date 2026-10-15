import { ImageResponse } from "next/og";
import { getDish } from "../../../lib/dishes";

export const runtime = "edge";
export const alt = "Addis Eats dish preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff7ed",
            color: "#9a3412",
            fontSize: 64,
          }}
        >
          Addis Eats
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "#fff7ed",
          color: "#171717",
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
          ADDIS EATS · MENU
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            marginTop: 28,
          }}
        >
          {dish.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            marginTop: 24,
            color: "#c2410c",
          }}
        >
          {dish.price} ETB
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 32,
          }}
        >
          Discover your next favorite in Addis Ababa.
        </div>
      </div>
    ),
    size
  );
}

