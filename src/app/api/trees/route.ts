import Redis from "@/utils/redis";
import { NextRequest, NextResponse } from "next/server";
import { RedisGeoSearchType } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));
  const radius = Number(searchParams.get("radius"));

  try {
    const redisInstance = new Redis();
    const data = await redisInstance.getTrees({ latitude, longitude, radius });
    await redisInstance.disconnectClient();

    const transformed = data.map(
      ({ member, coordinates }: RedisGeoSearchType) => {
        const returnObj = JSON.parse(member);
        returnObj.diameter = Number(returnObj.diameter);
        returnObj.location = {
          longitude: Number(coordinates?.longitude),
          latitude: Number(coordinates?.latitude),
        };

        return returnObj;
      },
    );
    return NextResponse.json({ data: transformed });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
