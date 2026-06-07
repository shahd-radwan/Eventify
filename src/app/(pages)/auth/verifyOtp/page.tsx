"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiServices } from "@/services/api";
import { VerifyOtpRequest } from "@/interfaces/auth";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registerAgainLoading, setRegisterAgainLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail");
    if (storedEmail) setEmail(storedEmail);
    else router.push("/auth/register");
  }, []);

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setVerifyLoading(true);

    try {
      const data: VerifyOtpRequest = { email, otp };

      const res = await apiServices.verifyOtp(data);

      if (res?.token) {
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("role", res.role);
        sessionStorage.setItem("name", res.name);

        setSuccess("OTP verified successfully!");

        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } else {
        setError(res?.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMsg("");
    setResendLoading(true);

    try {
      const msg = await apiServices.resendOtp({ email });
      setResendMsg(msg || "OTP has been resent. Check your email.");
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleRegisterAgain = () => {
    setRegisterAgainLoading(true);
    router.push("/auth/register");
  };

  return (
    <div className="page">
      {/* Loading overlay for Register Again */}
      {(verifyLoading || resendLoading || registerAgainLoading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="container">
        <div className="left">
          <div className="textBox">
            Verify your email to start using Eventify.
          </div>
        </div>

        <div className="right">
          <h2 className="logo">Eventify</h2>
          <h3 className="title">Verify OTP</h3>

          <p className="subtitle">
            Enter the OTP sent to your email: <b>{email}</b>
          </p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {resendMsg && <p className="success">{resendMsg}</p>}

          <label className="label">OTP</label>
          <input
            className="input"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            className="verify"
            onClick={handleVerify}
            disabled={verifyLoading || registerAgainLoading}
          >
            {verifyLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            className="resend"
            onClick={handleResend}
            disabled={resendLoading || registerAgainLoading}
            style={{ marginTop: "10px" }}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>

          <p className="bottom">
            Didn't receive OTP? Check your email or{" "}
            <span
              onClick={handleRegisterAgain}
              style={{ color: "#1c6b68", cursor: "pointer" }}
            >
              Register again
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f3f6;
          padding: 40px;
          position: relative;
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 1000px;
          height: 600px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .left {
          position: relative;
          width: 100%;
          height: 100%;
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
          margin-bottom: 10px;
          font-size: 26px;
        }

        .title {
          text-align: center;
          font-size: 28px;
          margin-bottom: 5px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          margin-bottom: 20px;
          color: #555;
        }

        .label {
          font-size: 14px;
          margin-bottom: 6px;
          margin-top: 8px;
        }

        .input {
          height: 38px;
          border-radius: 6px;
          border: 1px solid #ddd;
          padding: 10px;
          margin-bottom: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .input:focus {
          outline: none;
          border-color: #1c6b68;
          box-shadow: 0 0 0 2px rgba(28, 107, 104, 0.2);
        }

        .verify,
        .resend {
          margin-top: 10px;
          background: #1c6b68;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.3s;
        }

        .verify:hover,
        .resend:hover {
          background: #438381;
        }

        .error {
          color: red;
          font-size: 13px;
          text-align: center;
          margin-bottom: 8px;
        }

        .success {
          color: green;
          font-size: 13px;
          text-align: center;
          margin-bottom: 8px;
        }

        .bottom {
          text-align: center;
          font-size: 13px;
          margin-top: 15px;
          color: #444;
        }

        @media (max-width: 900px) {
          .container {
            grid-template-columns: 1fr;
            width: 95%;
            height: auto;
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