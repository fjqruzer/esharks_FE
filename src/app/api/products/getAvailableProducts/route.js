export async function GET(req) {
  const authHeader = req.headers.get('authorization'); // get token from client request

  try {
    const res = await fetch('https://snipe-enhanced-hopefully.ngrok-free.app/api/allproducts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
    }

    const products = await res.json();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}