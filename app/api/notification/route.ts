import { NextResponse } from 'next/server';

/** Silences polling 404s from browser extensions hitting /api/notification */
export async function GET() {
  return NextResponse.json({ notifications: [] });
}
