"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


export default function CheckOutModal({ cart = [], total = 0, onCancel, onCheckout, isOpen }) {
  const { data: session, status } = useSession();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [addressDetails, setAddressDetails] = useState({
    address_line: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
  });
  const [addressId, setAddressId] = useState(null);

  const [userHasExistingAddress, setUserHasExistingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [loadingAddressCheck, setLoadingAddressCheck] = useState(true);
  const [addressCheckError, setAddressCheckError] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const API_BASE_URL = "https://snipe-enhanced-hopefully.ngrok-free.app/api";

  useEffect(() => {
    const runAddressCheck = async () => {
      if (!isOpen || status !== "authenticated") {
        setLoadingAddressCheck(false);
        if (!isOpen) return;
        setAddressCheckError("User not authenticated. Please log in.");
        return;
      }

      setLoadingAddressCheck(true);
      setAddressCheckError(null);

      try {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await fetch(`${API_BASE_URL}/paymongo/address-check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to perform address check (Status: ${response.status})`);
        }

        const data = await response.json();
        setUserHasExistingAddress(data.has_address);
        setAddresses(data.addresses || []);
        if (data.has_address && data.addresses && data.addresses.length > 0) {
          // Populate fields with the first address by default
          setAddressDetails({
            address_line: data.addresses[0].address_line,
            city: data.addresses[0].city,
            province: data.addresses[0].province,
            postal_code: data.addresses[0].postal_code,
            country: data.addresses[0].country,
          });
          setAddressId(data.addresses[0].id);
          setUseSavedAddress(true);
        } else {
          setUseSavedAddress(false);
          setAddressId(null);
        }
      } catch (error) {
        setAddressCheckError(`Error checking address: ${error.message}`);
        setUserHasExistingAddress(false);
        setAddresses([]);
        setUseSavedAddress(false);
        setAddressId(null);
      } finally {
        setLoadingAddressCheck(false);
      }
    };

    runAddressCheck();
  }, [isOpen, status]);

  useEffect(() => {
    if (isOpen && status === "authenticated" && session?.user) {
      setContact((prev) => ({
        ...prev,
        name: session.user.FirstName + " " + session.user.LastName || "",
        email: session.user.email || "",
        phone: session.user.Phone_Number || "",
      }));
    }
  }, [isOpen, status, session]);

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressDetails({ ...addressDetails, [e.target.name]: e.target.value });
  };

  const handleUseSavedAddressToggle = () => {
    setUseSavedAddress((prev) => {
      const next = !prev;
      if (next && addresses.length > 0) {
        // Repopulate with saved address
        setAddressDetails({
          address_line: addresses[0].address_line,
          city: addresses[0].city,
          province: addresses[0].province,
          postal_code: addresses[0].postal_code,
          country: addresses[0].country,
        });
        setAddressId(addresses[0].id);
      } else {
        // Clear fields for new address
        setAddressDetails({
          address_line: "",
          city: "",
          province: "",
          postal_code: "",
          country: "",
        });
        setAddressId(null);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingCheckout(true);

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      setIsProcessingCheckout(false);
      return;
    }

    if (!contact.name || !contact.email || !contact.phone) {
      alert("Please fill in all contact details.");
      setIsProcessingCheckout(false);
      return;
    }


    if (
      !useSavedAddress &&
      (!addressDetails.address_line ||
        !addressDetails.city ||
        !addressDetails.province ||
        !addressDetails.postal_code ||
        !addressDetails.country)
    ) {
      alert("Please fill in all address fields.");
      setIsProcessingCheckout(false);
      return;
    }

    // Build payload for new flow
let payload = {
  address_id: useSavedAddress && addressId ? addressId : undefined,
  success_url: window.location.origin + "/order-success",
  cancel_url: window.location.origin + "/cart",
  send_email_receipt: true, // <--- always send email
  // Add address fields if not using saved address
  ...( !useSavedAddress && {
    address: addressDetails.address_line,
    city: addressDetails.city,
    province: addressDetails.province,
    postal_code: addressDetails.postal_code,
    country: addressDetails.country,
  })
};

 

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/paymongo/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success && data.redirect) {
   

        window.location.href = data.redirect; // or use router.push(data.redirect) if using Next.js router
        return;
      }

      if (data.success) {
        localStorage.setItem("paymongo_checkout_id", data.paymongo_checkout_id);
        localStorage.setItem("address_id", data.address_id);
   
        onCheckout();
        window.location.href = data.checkout_url;
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      alert(`Checkout failed: ${error.message}. Please check console for details.`);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-0 overflow-y-auto max-h-[95vh]">
        <div className="px-8 pt-8 pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Checkout</h3>
          <p className="text-sm text-gray-500">
            Please review your order and enter your details.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4">
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Contact Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-800">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={contact.name}
                onChange={handleContactChange}
                required
                className="col-span-1 sm:col-span-2 px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={contact.email}
                onChange={handleContactChange}
                required
                className="px-3 py-2 border rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={contact.phone}
                onChange={handleContactChange}
                required
                className="px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Delivery Address</h4>
            {loadingAddressCheck ? (
              <p className="text-gray-500">Checking for existing addresses...</p>
            ) : addressCheckError ? (
              <p className="text-red-500">{addressCheckError}</p>
            ) : userHasExistingAddress && addresses.length > 0 ? (
              <div className="mb-3">
                <div className="text-gray-600 text-sm mb-2">
                  <strong>Choose a saved address:</strong>
                </div>
                <div className="max-h-56 overflow-y-auto flex flex-col gap-3 mb-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 shadow-sm cursor-pointer transition-all
                        ${addressId === addr.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}
                        hover:border-blue-400`}
                      style={{
                        fontFamily: "monospace",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                        borderLeft: "6px solid #2563eb",
                        background: addressId === addr.id ? "#eff6ff" : "#fff"
                      }}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={addressId === addr.id}
                        onChange={() => {
                          setAddressId(addr.id);
                          setAddressDetails({
                            address_line: addr.address_line,
                            city: addr.city,
                            province: addr.province,
                            postal_code: addr.postal_code,
                            country: addr.country,
                          });
                          setUseSavedAddress(true);
                        }}
                        className="mt-1 accent-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-800">{addr.address_line}</div>
                        <div className="text-xs text-gray-600">
                          {addr.city}, {addr.province}, {addr.postal_code}, {addr.country}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Address ID: {addr.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                  onClick={() => {
                    setUseSavedAddress(false);
                    setAddressId(null);
                    setAddressDetails({
                      address_line: "",
                      city: "",
                      province: "",
                      postal_code: "",
                      country: "",
                    });
                  }}
                >
                  Ship to a new address
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-3">
                Please provide your delivery address.
              </p>
            )}

            {/* Show address input fields if not using saved address */}
            {!useSavedAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-800">
                <input
                  type="text"
                  name="address_line"
                  placeholder="Address Line (House/Unit, Street, Barangay)"
                  value={addressDetails.address_line}
                  onChange={handleAddressChange}
                  required
                  className="col-span-1 sm:col-span-2 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addressDetails.city}
                  onChange={handleAddressChange}
                  required
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  value={addressDetails.province}
                  onChange={handleAddressChange}
                  required
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="postal_code"
                  placeholder="ZIP / Postal Code"
                  value={addressDetails.postal_code}
                  onChange={handleAddressChange}
                  required
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={addressDetails.country}
                  onChange={handleAddressChange}
                  required
                  className="px-3 py-2 border rounded"
                />
              </div>
            )}
          </div>
          <div className="mb-6 text-neutral-900">
            <h4 className="font-semibold mb-3 text-gray-700">Items</h4>
            <div className="divide-y divide-gray-200 border rounded-lg">
              {cart.length === 0 ? (
                <div className="py-8 text-gray-500 text-center">Your cart is empty.</div>
              ) : (
                <ul>
                  {cart.map((item) => (
                    <li key={item.id} className="flex py-4 px-4 items-center gap-4">
                        <img
                        src={
                        item.image.startsWith("http")
                        ? item.image
                        : `https://snipe-enhanced-hopefully.ngrok-free.app/storage/${item.image.replace(/^\/?storage\//, "")}`
                        }
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                        />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.name}</div>
                        {item.size && (
                          <div className="text-xs text-gray-500">Size: {item.size}</div>
                        )}
                      </div>
                      <div className="w-16 text-center text-sm">x{item.quantity}</div>
                      <div className="w-20 text-right font-bold">
                        ₱{(item.price * item.quantity).toLocaleString("en-PH")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-8 text-slate-950">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-xl">₱{total.toLocaleString("en-PH")}</span>
          </div>
          <div className="flex justify-end items-center gap-x-2 border-t pt-4">
            <button
              type="button"
              className="py-2 px-4 rounded-lg border bg-white text-gray-800 hover:bg-gray-50"
              onClick={onCancel}
              disabled={isProcessingCheckout}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              disabled={cart.length === 0 || loadingAddressCheck || isProcessingCheckout}
            >
              {isProcessingCheckout ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}