export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "No id provided" }), { status: 400 });
  }
  const res = await fetch(`https://snipe-enhanced-hopefully.ngrok-free.app/api/product/available/${id}`);
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}