"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);
  const [showJumpscare, setShowJumpscare] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  // Fetch order creation
  useEffect(() => {
    const paymongo_checkout_id = localStorage.getItem("paymongo_checkout_id");
    const address_id = localStorage.getItem("address_id");
    const jwt = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (paymongo_checkout_id && address_id && jwt) {
      fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          paymongo_checkout_id,
          address_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrderId(data.order_id);
            localStorage.removeItem("paymongo_checkout_id");
            localStorage.removeItem("address_id");
          } else {
            setError(data.message || "Order creation failed.");
          }
        })
        .catch(() => setError("Order creation failed."));
    } else {
      setError("Missing payment or address information.");
    }
  }, []);

  // Jumpscare for 1.5 seconds
  useEffect(() => {
    if (showJumpscare) {
      const timeout = setTimeout(() => setShowJumpscare(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [showJumpscare]);

  // Countdown and redirect after jumpscare
  useEffect(() => {
    if (!showJumpscare && (orderId || error)) {
      if (countdown === 0) {
        router.push("/");
        return;
      }
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showJumpscare, countdown, orderId, error, router]);

  // Jumpscare UI
  if (showJumpscare) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <img
          src="/logo-white.png"
          alt="Jumpscare Logo"
          className="w-64 h-64 animate-pulse drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          style={{ filter: "brightness(1.2) contrast(1.2)" }}
        />
        <audio autoPlay>
          <source src="/jumpscare.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  // Success UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mt-20 border border-blue-100 flex flex-col items-center">
        <img
          src="/logo-black.png"
          alt="Logo"
          className="w-20 h-20 mb-4 drop-shadow"
        />
        <h1 className="text-3xl font-extrabold mb-4 text-green-700 text-center">Order Success</h1>
        {orderId && (
          <div className="mb-4 text-center">
            <p className="text-lg text-gray-700 mb-2">
              Thank you for your purchase!
            </p>
            <p className="font-semibold text-blue-700">
              Your order ID is: <span className="break-all">{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting you to the home page in <span className="font-bold text-green-700">{countdown}</span> second{countdown !== 1 && "s"}...
            </p>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting you to the home page in <span className="font-bold text-green-700">{countdown}</span> second{countdown !== 1 && "s"}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}