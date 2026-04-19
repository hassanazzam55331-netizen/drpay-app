import { NextResponse } from 'next/server';
import catalogData from '@/lib/catalog.json';

// Serve catalog - try remote first, fallback to local
export async function GET() {
  try {
    // Try fetching from remote first
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://wifi.e-misr.com/ICO/js/sl.php', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fall through to local
  }

  // Fallback to local catalog data
  return NextResponse.json(catalogData);
}
