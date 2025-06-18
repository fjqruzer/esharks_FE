import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  setLoading(false);
  if (result.ok) {
    // Fetch session to get the token
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const token = session?.user?.token;
    if (token) {
     localStorage.setItem("jwt", token);
    }
    router.push("/accounts");
  } else {
    setError("Invalid credentials");
  }
};

  return (
    <div className="container mx-auto h-screen py-auto flex items-center justify-center flex-col">
      <div
        className="bg-white border mx-auto border-gray-200 rounded-xl shadow-2xs"
        style={{
          width: "calc(100vw - 7rem)",
          maxWidth: "calc(100vh * 0.5)",
        }}
      >
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <a href="/">
              <img
                src="/logo-black.png"
                className="mx-auto w-25"
                alt="Logo"
              />
            </a>
            <h1 className="block text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="mt-2 text-sm text-gray-600">
              Only administrators can access this area.
            </p>
          </div>

          <div className="mt-5">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-2.5 text-neutral-950 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to you
                  </p>
                </div>
                {/* Password */}
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <label
                      htmlFor="password"
                      className="block text-sm mb-2 text-neutral-950"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-2.5 text-neutral-950 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0"
                      required
                      aria-describedby="password-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="password-error"
                  >
                    8+ characters required
                  </p>
                </div>
                {/* Checkbox */}
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ms-3">
                    <label
                      htmlFor="remember-me"
                      className="text-sm text-gray-800"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="ms-16">
                    <a
                      className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                      href="/forgot"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                {/* Error message */}
                {error && (
                  <p className="text-xs text-red-600 mt-2">{error}</p>
                )}
                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Admin Login"}
                </button>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
    </div>
  );
}