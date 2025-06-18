"use client";
import { useState, useEffect } from "react";
import CheckOutModal from "./checkoutModal";

export default function CartItem() {
  const [cart, setCart] = useState([]);
  const [accountID, setAccountID] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCart = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/cart/fetchCart", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart || []);
        setAccountID(data.AccountID || null);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (cartId, qty) => {
    const newQty = Math.max(1, qty);
    setCart(cart =>
      cart.map(item =>
        item.CartID === cartId ? { ...item, quantity: newQty } : item
      )
    );
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`https://snipe-enhanced-hopefully.ngrok-free.app/api/cart/update/${cartId}/quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Quantity: newQty }),
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(err => console.error("API error:", err));
  };

  const handleRemove = (cartId) => {
    setCart(cart => cart.filter(item => item.CartID !== cartId));
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`https://snipe-enhanced-hopefully.ngrok-free.app/api/cart/delete/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(err => console.error("API error:", err));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Called when checkout is successful
  const handleCheckout = () => {
    setCart([]);
    setShowModal(false);
    // Optionally, you can also refetch the cart here if needed
    // fetchCart();
  };

  return (
    <div className="container mx-auto py-12 px-4 ">
      <h1 className="text-2xl font-bold mb-8 text-start">Your Items</h1>
      {accountID && (
        <div className="mb-4 text-red-500 font-semibold">
          TEMPORARY ONLY!!! Account ID: {accountID}
        </div>
      )}
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty.
          <button 
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => window.location.href = ' merch/category'}
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-8xl mx-auto bg-none rounded-lg shadow">
          <ul>
            {cart.map(item => (
              <li
                key={item.id}
                className="flex items-center gap-4 py-4 border-b last:border-b-0"
              >
                <img
                  src={`https://snipe-enhanced-hopefully.ngrok-free.app/storage/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-1 flex-row w-full">
                  {/* Name column */}
                  <div className="flex-1 flex items-center">
                    <div>
                      <div className="font-semibold">{item.name} (TEMPORARY CartID:{item.id})</div>
                      <div className="text-gray-500 text-sm">₱{item.price.toLocaleString()}</div>
                      {item.size !== null && <div className="font-semibold">SIZE: {item.size}</div>}
                    </div>
                  </div>

                

                  {/* Quantity and Price column */}
                  <div className="flex flex-col items-end justify-center ml-auto">
                      <div className="font-bold text-lg mb-2"> {/* Price */}
                  ₱{(item.price * item.quantity).toLocaleString()}
                  </div> {/* Added ml-auto to push to the right */}
                    <div className="flex items-center mb-2"> {/* Quantity controls */}
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="border-t border-b border-s h-6 p-1 rounded-l hover:bg-violet-600 transition"
                        aria-label="Decrease quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                        <input
                        type="number"
                        min={1}
                        max={3}
                        value={item.quantity}
                        readOnly
                        className="w-12 border-t border-b border-white font-bold text-center h-6 text-sm no-spinner"
                        />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="border-t border-b border-e h-6 p-1 rounded-r hover:bg-violet-600 transition"
                        aria-label="Increase quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                 
                    <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:underline text-sm"
                        aria-label="Remove"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                 
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-8">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-xl">₱{total.toLocaleString()}</span>
          </div>
          <button
            type="button"
            className="mt-6 w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            onClick={() => setShowModal(true)}
          >
            Checkout
          </button>
        </div>
      )}
      <CheckOutModal
        cart={cart}
        total={total}
        onCancel={() => setShowModal(false)}
        onCheckout={handleCheckout}
        isOpen={showModal}
      />
    </div>
  );
}