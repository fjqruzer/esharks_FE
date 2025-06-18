import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
// api ni jyro
  };

  return (
    <div className="container mx-auto h-screen py-auto flex items-center justify-center flex-col">
      <div className="bg-white border mx-auto border-gray-200 rounded-xl shadow-2xs" style={{ width: 'calc(100vw - 2rem)', maxWidth: 'calc(100vh * 0.4)' }}>
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <a href="/"><img src="logo-black.png" className="mx-auto w-25" alt="Logo" /></a>
            <h1 className="block text-2xl font-bold text-gray-800">Forgot Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Remembered your password?
              <a className="ms-1 text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="/auth">
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-5">
            {submitted ? (
              <div className="text-green-600 text-center">
                If an account with that email exists, a password reset link has been sent.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 text-gray-700">Email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="py-2.5 text-neutral-950 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0"
                      required
                    />
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                  </div>
                  <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}