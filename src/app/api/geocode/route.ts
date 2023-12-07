import { Client } from "@googlemaps/google-maps-services-js";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEOCODE_API_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  const client = new Client();

  try {
    if (latitude && longitude) {
      const latlng = {
        latitude,
        longitude,
      };

      const location = await client.reverseGeocode({
        params: {
          key: apiKey || '',
          latlng,
        },
      });

      return NextResponse.json({
        data: location.data.results,
      });
    }
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
