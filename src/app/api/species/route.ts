import Redis from '@/redis'
import { NextRequest, NextResponse } from "next/server";
import { RedisGeoSearchType } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const species = searchParams.get('species') || ''
  const latitude = Number(searchParams.get('latitude'))
  const longitude = Number(searchParams.get('longitude'))
  const radius = Number(searchParams.get('radius'))

  try {
    const redisInstance = new Redis()
    const data = await redisInstance.getSpecies({ species, latitude, longitude, radius }) as any
    await redisInstance.disconnectClient()
    
    species.split(',').forEach((speciesName, index) => {
      data[index].forEach((item: any) => {
        item.species = speciesName
      })
    })

    const transformed = data
      .flat()
      .map(
        ({ member, coordinates, species }: RedisGeoSearchType) => {
          const returnObj = JSON.parse(member);
          
          returnObj.species = species
          returnObj.location = {
            longitude: Number(coordinates?.longitude),
            latitude: Number(coordinates?.latitude),
          }

          return returnObj
        },
      )
    return NextResponse.json({ data: transformed })
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
