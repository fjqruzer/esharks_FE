import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountForm() {

const router = useRouter();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 1. Add loading state
  const [form, setForm] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    schoolId: "",
    email: "",
    password: "",
    confirmPassword: "",
    // street: "",
    // city: "",
    // province: "",
    // postalCode: "",
    // country: "",
    phoneNumber: "",
  });

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "phoneNumber") {
    // Remove all non-digits
    let digits = value.replace(/\D/g, "");
    // Format as 123-456-7890
    if (digits.length > 3 && digits.length <= 6) {
      digits = digits.replace(/(\d{3})(\d+)/, "$1-$2");
    } else if (digits.length > 6) {
      digits = digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    }
    setForm({ ...form, [name]: digits.slice(0, 12) });
  } else {
    setForm({ ...form, [name]: value });
  }
  setErrors({ ...errors, [name]: undefined });
};

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    // middleInitial and schoolId are optional
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) newErrors.email = "Invalid email address";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/)) newErrors.phoneNumber = "Invalid phone number (format: 123-456-7890)";
    // if (!form.street.trim()) newErrors.street = "Street is required";
    // if (!form.city.trim()) newErrors.city = "City is required";
    // if (!form.province.trim()) newErrors.province = "Province is required";
    // if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    // if (!form.country.trim()) newErrors.country = "Country is required";
    return newErrors;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // 2. Set loading true before request
      const payload = {
        FirstName: form.firstName,
        LastName: form.lastName,
        MI: form.middleInitial,
        email: form.email,
        password: form.password,
        SchoolID: form.schoolId,
        password_confirmation: form.confirmPassword,
        Phone_Number: form.phoneNumber,
      };

  try {
        const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            router.push("/auth");
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        
        alert("Network error.");
      } finally {
        setLoading(false); // 2. Set loading false after request
      }
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center py-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs w-full max-w-2xl mx-auto px-4">
        <div className="p-4 sm:p-7">
          <div className="text-center mb-6">
            <a href="/"><img src="logo-black.png" className="mx-auto w-25" alt="Logo" /></a>
            <h1 className="block text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?
              <a className="ms-1 text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="/auth">
                Sign in here
              </a>
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-2 text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="middleInitial" className="block text-sm mb-2 text-gray-700">Middle Initial</label>
                  <input
                    type="text"
                    id="middleInitial"
                    name="middleInitial"
                    value={form.MI}
                    onChange={handleChange}
                    maxLength={2}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm mb-2 text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="schoolId" className="block text-sm mb-2 text-gray-700">School ID Number</label>
                  <input
                    type="text"
                    id="schoolId"
                    name="schoolId"
                    value={form.schoolId}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm mb-2 text-gray-700">Phone Number (+63)</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                    placeholder="123-456-7890"
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
              {/* Account & Address Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-gray-700">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 text-neutral-950">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-2 text-neutral-950">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>
                {/* <div>
                  <label htmlFor="street" className="block text-sm mb-2 text-gray-700">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
                </div> */}
                {/* <div>
                  <label htmlFor="city" className="block text-sm mb-2 text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                </div> */}
                {/* <div>
                  <label htmlFor="province" className="block text-sm mb-2 text-gray-700">Province</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province}</p>}
                </div> */}
                {/* <div>
                  <label htmlFor="postalCode" className="block text-sm mb-2 text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.postalCode && <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>}
                </div> */}
                {/* <div>
                  <label htmlFor="country" className="block text-sm mb-2 text-gray-700">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                    required
                  />
                  {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
                </div> */}
              </div>
            </div>
           <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="ml-auto py-2 px-6 rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                disabled={loading} // 3. Disable when loading
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}