"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        // setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // جلب session بعد تسجيل الدخول
      const session = await getSession();

      const role = (session?.user as any)?.role;

      if (role === "ORGANIZER") {
        router.push("/users/organizer/Profile");
      } else if (role === "ATTENDEE") {
        router.push("/users/attende/Profile");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setLoading(true);
    router.push("/auth/register");
  };
  

  return (
    <div className="page">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="container">
        <div className="left">
          <div className="textBox">
            Plan events, send <br />
            invitations, and track <br />
            attendance effortlessly <br />
            with Eventify.
          </div>
          <Image src="/login.png" alt="eventify" fill className="image" />
        </div>

        <div className="right">
          <h2 className="logo">Eventify</h2>
          <h3 className="title">Welcome Back</h3>
          <p className="subtitle">Sign in with your email and password</p>

          {error && <p className="error">{error}</p>}

          <label className="label">Email address</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <div className="buttons">
            <button
              className="signin"
              onClick={handleLogin}
              disabled={loading}
            >
              Sign in
            </button>

            <button
              className="create"
              onClick={handleCreateAccount}
              disabled={loading}
            >
              Create Account
            </button>
          </div>

          <p className="bottom">
            Don't have an account?<br />
            <Link href="/auth/register">
              Create one and start exploring events today
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f3f6;
          padding: 20px;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1c6b68;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .left {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image {
          object-fit: cover;
        }

        .textBox {
          position: absolute;
          top: 50px;
          left: 50px;
          z-index: 2;
          color: #0f172a;
          font-size: 18px;
          line-height: 1.6;
          font-weight: 500;
          max-width: 250px;
        }

        .right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 60px;
          background: #f7f7f7;
        }

        .logo {
          text-align: center;
          color: #1c6b68;
          margin-bottom: 20px;
          font-size: 28px;
          margin-top: -40px;
          font-weight: 600;
        }

        .title {
          text-align: center;
          font-size: 30px;
          margin-bottom: 5px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          margin-bottom: 30px;
          color: #555;
        }

        .error {
          color: red;
          font-size: 13px;
          margin-bottom: 10px;
          text-align: center;
        }

        .label {
          font-size: 14px;
          margin-bottom: 6px;
          margin-top: 10px;
        }

        .input {
          height: 42px;
          border-radius: 6px;
          border: 1px solid #ddd;
          padding: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          margin-bottom: 12px;
        }

        .buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          justify-content: center;
        }

        .signin {
          background: #1c6b68;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 6px;
          cursor: pointer;
        }

        .create {
          background: white;
          border: 1px solid #1c6b68;
          color: #1c6b68;
          padding: 10px 22px;
          border-radius: 6px;
          cursor: pointer;
        }

        .bottom {
          text-align: left;
          font-size: 13px;
          color: #444;
        }

        .bottom a {
          color: #1c6b68;
          font-weight: 500;
        }

        @media (max-width:900px) {
          .container {
            grid-template-columns: 1fr;
            max-width: 420px;
          }

          .left {
            display: none;
          }

          .right {
            padding: 30px;
          }
        }

      `}</style>
    </div>
  );
}