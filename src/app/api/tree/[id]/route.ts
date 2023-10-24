import { NextResponse } from "next/server";

export async function GET(
  _: unknown,
  { params }: { params: { id: string } },
) {
  const id = params.id

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/tree/${id}`)

    if (res.status < 400) {
      const body = await res.json()
      return NextResponse.json({ data: body })
    } else {
      const message = await res.text();
      return NextResponse.json({ error: message })
    }
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
