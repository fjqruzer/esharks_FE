"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

// Helper for payment method icons
function renderMopIcon(mop) {
  if (!mop) return <span className="ml-1 text-neutral-400">N/A</span>;
  const m = mop.toLowerCase();
  if (m.includes("gcash")) {
    return (
      <span className="inline-flex items-center gap-1">
        <img src="/icons/gcash.png" alt="Gcash" className="w-5 h-5 inline" /> GCash
      </span>
    );
  }
  if (m.includes("maya") || m.includes("paymaya")) {
    return (
      <span className="inline-flex items-center gap-1">
        <img src="/icons/maya.png" alt="Maya" className="w-5 h-5 inline" /> Maya
      </span>
    );
  }
  if (m.includes("qrph")) {
    return (
      <span className="inline-flex items-center gap-1">
        <img src="/icons/qrph.png" alt="QR PH" className="w-5 h-5 inline" /> QR PH
      </span>
    );
  }
  if (
    m.includes("card") ||
    m.includes("debit") ||
    m.includes("credit")
  ) {
    return (
      <span className="inline-flex items-center gap-1">
        <svg className="w-5 h-5 text-blue-500 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="#fff"/><rect x="2" y="6" width="20" height="12" rx="2" stroke="#3b82f6" strokeWidth="2"/><rect x="4" y="14" width="6" height="2" rx="1" fill="#3b82f6"/></svg>
        Debit/Credit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <svg className="w-5 h-5 text-gray-400 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" fill="#f3f4f6"/></svg>
      Other
    </span>
  );
}

// Add this helper function near the top (outside the component)
function renderMopBadge(mop) {
  if (!mop) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-gray-500 border text-xs font-semibold">
      Other
    </span>
  );
  const m = mop.toLowerCase();
  if (m.includes("gcash")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-semibold">
        GCash
      </span>
    );
  }
  if (m.includes("maya") || m.includes("paymaya")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-semibold">
        Maya
      </span>
    );
  }
  if (m.includes("qrph")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
        QR PH
      </span>
    );
  }
  if (
    m.includes("card") ||
    m.includes("debit") ||
    m.includes("credit")
  ) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-gray-800 border text-xs font-semibold">
        Debit/Credit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-gray-500 border text-xs font-semibold">
      Other
    </span>
  );
}

const ProfileModal = ({ user: initialUser, isOpen, onClose }) => {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(initialUser || {});
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const contentRef = useRef();


  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);
  // --- FIX END ---

  // Custom logout handler
  const handleLogout = async () => {
    try {
      await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(session?.user?.token && { "Authorization": `Bearer ${session.user.token}` }),
        },
      });
    } catch (error) {
      console.error("Backend logout failed", error);
    } finally {
      localStorage.removeItem("jwt");
      localStorage.removeItem("token");
      signOut({ callbackUrl: "/" });
    }
  };

  // Effect to handle body scrolling and scroll to top
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Effect to fetch orders when the "orders" tab is active and the modal is open
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === "orders" && isOpen) {
        setLoadingOrders(true);
        setOrdersError(null);
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token") || localStorage.getItem("jwt")
              : null;

          const res = await fetch("/api/orders", {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              Accept: "application/json",
            },
          });
          const data = await res.json();
          setOrders(data.orders || []);
          setUser(data.user || {});
        } catch (err) {
          setOrdersError("Failed to fetch orders: " + err.message);
          setOrders([]);
          setUser({});
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [activeTab, isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="none flex flex-col items-center">
            {/* Profile Picture */}
            <img
              src="/default_pfp.jpeg"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-3 border-neutral-100 mb-2 "
            />
            <div className="text-xs text-neutral-300">{user.AccountID || user.SchoolID }</div>
            <div className="text-xl font-semibold text-neutral-100">
              {user.FirstName || "N/A"} {user.MI ? user.MI + "." : ""} {user.LastName || ""}
            </div>
            <div className="space-y-1 mt-4 w-full">
              <p className="flex justify-between">
                <span className="font-medium text-neutral-300">Email:</span>
                <span className="text-neutral-100">{user.email || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-neutral-300">School ID:</span>
                <span className="text-neutral-100">{user.SchoolID || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-neutral-300">Phone Number:</span>
                <span className="text-neutral-100">{user.Phone_Number || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-neutral-300">Created at:</span>
                <span className="text-neutral-100">{formatDate(user.created_at)}</span>
              </p>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-100">Order History</h3>
            {loadingOrders ? (
              <p className="text-neutral-400 text-center py-6">Loading orders...</p>
            ) : ordersError ? (
              <p className="text-red-500 text-center py-6">Error: {ordersError}</p>
            ) : orders.length > 0 ? (
              <div className="space-y-3">
                {orders
                  .slice()
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((order) => (
                    <div
                      key={order.OrderID}
                      className="relative bg-white/20 border border-neutral-700 rounded-2xl shadow-md px-4 py-3 flex flex-col gap-2 overflow-hidden"
                      style={{
                        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
                        borderLeft: "6px solid #ef4444",
                      }}
                    >
                      {/* Ticket stub effect */}
                      <div className="absolute left-0 top-6 w-3 h-3 bg-neutral-900 rounded-full -translate-x-1/2"></div>
                      <div className="absolute right-0 top-6 w-3 h-3 bg-neutral-900 rounded-full translate-x-1/2"></div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                          Order #{order.OrderID}
                        </span>
                        
                        <span className="text-xs text-neutral-400">{formatDate(order.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-700 dark:text-neutral-200">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item{order.items.length > 1 ? "s" : ""} ·
                          <span className="font-semibold text-red-500 ml-1">₱{parseFloat(order.total).toLocaleString()}</span>
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            order.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                     

                      <div className="border-t border-dashed border-neutral-300 my-2" />

                      <div className="text-xs text-neutral-500 dark:text-neutral-300">
                        <span className="font-medium text-neutral-700 dark:text-neutral-200">Shipping:</span>
                        {order.address ? (
                          <>
                            <div>{order.address.address_line}</div>
                            <div>
                              {order.address.city}, {order.address.province} {order.address.postal_code}
                            </div>
                            <div>{order.address.country}</div>
                          </>
                        ) : (
                          <div>Address information not available.</div>
                        )}
                      </div>

                      <div className="border-t border-dashed border-neutral-300 my-2" />

                      <div className="text-xs text-neutral-500 dark:text-neutral-300 flex items-center gap-1">
                        {renderMopBadge(order.MOP)}
                      </div>
                   

                      <div className="mt-2">
                        <details className="text-xs text-neutral-500">
                          <summary className="cursor-pointer text-blue-500">View items</summary>
                          <ul className="list-disc list-inside mt-1">
                            {order.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-neutral-700 dark:text-neutral-200">
                                {item.product_name} (x{item.quantity}) - ₱{parseFloat(item.price).toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                          <div className="text-xs bg-white/10 text-neutral-100 p-2 rounded-lg mt-2">
                         <span className=" text-xs  italic">Reference ID: <span className="blur-xs hover:blur-none transition-all">{order.paymongo_checkout_id}</span></span>
                        </div>
                    </div>
                    
                  ))}
              </div>
            ) : (
              <p className="text-neutral-400 text-center py-6">No order history available</p>
            )}
          </div>
        );
      case "to-receive":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-100">Receieved Orders</h3>
            {/* Using `user.pendingOrders` which is expected to come from the parent's `initialUser` prop */}
            {user.pendingOrders && user.pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {user.pendingOrders.map((order, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-xl border border-neutral-700">
                    <div className="flex justify-between">
                      <span className="font-medium text-neutral-100">Order #{order.id}</span>
                      <span className="text-sm text-neutral-300">{formatDate(order.date)}</span>
                    </div>
                    <div className="text-sm text-neutral-100 mt-1">
                      {order.items} items · ${order.total}
                    </div>
                    <div className="text-xs mt-2 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                      <span className="text-neutral-100">Estimated delivery: {order.estimatedDelivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-400 text-center py-6">No pending orders</p>
            )}
          </div>
        );
      default:
        return <div className="text-neutral-100">No content available</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl transition-all">
      <div className="bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-6 shadow w-[80vw] max-w-md lg:h-180 h-160 flex flex-col justify-between items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounceIn">
        {/* Tabs */}
        <div className="flex border-b border-neutral-700 mb-6 w-full">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-neutral-300 hover:text-red-500"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "orders"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-neutral-300 hover:text-red-500"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("to-receive")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "to-receive"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-neutral-300 hover:text-red-500"
            }`}
          >
            Received
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 w-full flex-1 overflow-y-auto" ref={contentRef}>
          {renderTabContent()}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mb-3 py-2 rounded-2xl bg-white/10 text-red-500 font-semibold shadow border border-red-200 hover:bg-red-500 hover:text-white transition-all"
          style={{
            fontSize: 17,
            letterSpacing: 0.2,
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          }}
        >
          Close
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-2xl bg-white/10 text-white font-semibold shadow border border-white-900 hover:bg-neutral-500 hover:text-white transition-all"
          style={{
            fontSize: 17,
            letterSpacing: 0.2,
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;