import React, { useState, useEffect } from "react";

export default function AddressModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData = {} 
}) {
  const [form, setForm] = useState({
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    user_id: "",
    address_id: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        address: initialData.address || "",
        city: initialData.city || "",
        province: initialData.province || "",
        postal_code: initialData.postal_code || "",
        country: initialData.country || "",
        user_id: initialData.user_id || "",
        address_id: initialData.address_id || ""
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{form.address_id ? "Edit Address" : "Add Address"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            name="province"
            placeholder="Province"
            value={form.province}
            onChange={handleChange}
            required
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            value={form.postal_code}
            onChange={handleChange}
            required
          />
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />
          {/* user_id and address_id can be hidden or managed in state */}
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}