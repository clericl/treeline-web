import { createClient, GeoReplyWith, RedisClientType } from '@redis/client'

export type GetTreesRequest = {
  latitude: number
  longitude: number
  radius: number
}

function isValidRequest(latitude: any, longitude: any) {
  return (!isNaN(Number(latitude)) && !isNaN(Number(longitude)));
}

export default class Redis {
  client: ReturnType<typeof createClient>

  static initClient() {
    return createClient({
      password: process.env.NEXT_PUBLIC_REDIS_KEY,
      socket: {
        host: process.env.NEXT_PUBLIC_REDIS_HOST,
        port: parseInt(process.env.NEXT_PUBLIC_REDIS_PORT || '13486'),
      },
    });
  }

  constructor(client?: RedisClientType) {
    this.client = client || Redis.initClient()
  }

  async connectClient() {
    return await this.client.connect()
  }

  async getTrees({ latitude, longitude, radius }: GetTreesRequest) {
    if (!isValidRequest(latitude, longitude)) {
      throw new Error('invalid request parameters')
    }

    await this.connectClient()

    if (!this.client.isReady) {
      throw new Error('client was not ready')
    }

    const nearbyTrees = await this.client.geoSearchWith(
      'trees',
      { latitude, longitude },
      { radius: radius || 0.1, unit: 'mi' },
      [GeoReplyWith.COORDINATES],
    )

    return nearbyTrees || []
  }

  async quitClient() {
    return await this.client.quit()
  }

  async disconnectClient() {
    return await this.client.disconnect()
  }
}
