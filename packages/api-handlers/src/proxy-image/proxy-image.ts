import type { NextRequest } from 'next/server';

export const proxyImage = async (request: NextRequest): Promise<Response> => {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // 👈 now you can use ColorThief
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: `Failed to proxy image: ${errorMessage}` },
      { status: 500 },
    );
  }
};
