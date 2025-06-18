export async function authLogin({ email, password }) {
  const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}