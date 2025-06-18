import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  const authHeader = headers().get("authorization");
  console.log("DEBUG: GET request received.");
  console.log("DEBUG: Authorization Header:", authHeader);

  try {
    // Fetch cart data from Laravel API
    const apiUrl = "https://snipe-enhanced-hopefully.ngrok-free.app/api/cart"; // adjust endpoint as needed
    console.log("DEBUG: Fetching from API:", apiUrl);
    const res = await fetch(
      apiUrl,
      {
        method: "GET",
        headers: {
          Authorization: authHeader || "",
          Accept: "application/json",
        },
      }
    );

    console.log("DEBUG: API Response Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text(); // Get raw error text for debugging
      console.error("DEBUG: API Fetch failed. Response not OK.", { status: res.status, statusText: res.statusText, errorBody: errorText });
      return NextResponse.json(
        { success: false, message: "Failed to fetch cart data.", apiResponse: errorText },
        { status: res.status }
      );
    }

    const raw = await res.json();
    console.log("DEBUG: Raw API response:", raw);

    // Determine the actual array of cart items
    // Check if raw is already an array, otherwise try raw.data, raw.items, or raw.cart
    const cartDataArray = Array.isArray(raw) ? raw : (raw.data || raw.items || raw.cart || []);

    // Extract AccountID if available (assuming it's consistent across items or available at a top level)
    // For this example, we'll try to get it from the first item if the array is not empty
    const accountId = cartDataArray.length > 0 ? cartDataArray[0].AccountID : null;

    // Transform the data to the expected frontend format
    const cartItems = cartDataArray.map((item) => ({
      id: item.CartID, // IMPORTANT: Now correctly using CartID as the unique identifier
      name: item.product?.Name || item.Name || "",
      price: parseFloat(item.product?.Price || item.Price || 0), // Ensure price is a number
      image: item.product?.Image || item.Image || "",
      quantity: item.Quantity,
      size: item.Size,
    }));
    console.log("DEBUG: Transformed cart items:", cartItems);

    // Return the transformed cart items along with the AccountID
    return NextResponse.json({ success: true, cart: cartItems, AccountID: accountId });
  } catch (error) {
    console.error("DEBUG: An error occurred in GET request catch block:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}
