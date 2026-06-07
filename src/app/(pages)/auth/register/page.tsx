"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignupData } from "@/interfaces/auth";
import { ServicesApi } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const api = new ServicesApi();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accountType, setAccountType] = useState<"ORGANIZER" | "ATTENDEE">("ATTENDEE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");




   
 const handleRegister = async () => {
  setError("");

  if (!name || !email || !password || !confirmPassword) {
    setError("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

  if (!passwordRegex.test(password)) {
    setError(
      "Password must contain uppercase, lowercase, number, and special character"
    );
    return;
  }

  const data: SignupData = {
    name,
    email,
    password,
    role: accountType,
  };

  try {
    setLoading(true);

    let result = await api.signup(data) as {
      token?: string | null;
      message?: string;
      status?: number;
      error?: boolean;
    };
    console.log("SIGNUP RESULT:", result);

    // إذا الايميل مستخدم لكن بدون role أو token null → نتجاهل الحساب القديم ونعيد التسجيل
    if (
      result.token === null &&
      result.message?.toLowerCase().includes("email already in use")
    ) {
      console.log("Old account without role detected, re-registering...");

      // إعادة إرسال نفس البيانات لتسجيل جديد
      result = await api.signup(data);
      console.log("RE-REGISTER RESULT:", result);
    }

    // حالة نجاح إرسال OTP
    if (result.message?.toLowerCase().includes("otp")) {
      sessionStorage.setItem("otpEmail", email);
      sessionStorage.setItem("accountType", accountType);

      router.push("/auth/verifyOtp");
      return;
    }

    // أي رسالة خطأ أخرى
    if (result.status === 400 || result.error) {
      setError(result.message || "Registration failed");
      return;
    }

    setError("Registration failed");

  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const handleGoToLogin = () => router.push("/auth/login");

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
            Join Eventify to explore<br />
             events, manage your<br />
             registrations, and receive<br />
              your digital tickets with a<br />
               QR code.
          </div>
          <Image src="/regist.png" alt="eventify" fill className="image" />
        </div>

        <div className="right">
          <h2 className="logo">Eventify</h2>
          <h3 className="title">Register</h3>
          <p className="subtitle">Create your account using your email and password</p>

          {error && <p className="error">{error}</p>}

          <label className="label">Full Name</label>
          <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <label className="label">Confirm Password</label>
          <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <label className="label">Type Account</label>
          <div className="accountType">
            <label className="radioBox flex items-center gap-2">
              <input
                type="radio"
                value="ORGANIZER"
                checked={accountType === "ORGANIZER"}
                onChange={(e) => setAccountType(e.target.value as "ORGANIZER")}
              />
              Organizer
            </label>
           
            <label className="radioBox flex items-center gap-2">
              <input
                type="radio"
                value="ATTENDEE"
                checked={accountType === "ATTENDEE"}
                onChange={(e) => setAccountType(e.target.value as "ATTENDEE")}
              />
              Attendee
            </label>
          </div>

          <p className="passwordNote">
            Password must contain uppercase, lowercase, number, and special character
          </p>

          <button className="register" onClick={handleRegister}>Register</button>

          <p className="bottom">
            Already have an account?{" "}
            <span onClick={handleGoToLogin} className="login-link">Login</span>
          </p>
        </div>
      </div>

     <style jsx>{`

.page{
position:relative;
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f1f3f6;
padding:20px;
}

.loading-overlay{
position:absolute;
inset:0;
background:rgba(255,255,255,0.85);
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
z-index:100;
}

.spinner{
border:4px solid #f3f3f3;
border-top:4px solid #1c6b68;
border-radius:50%;
width:50px;
height:50px;
animation:spin 1s linear infinite;
margin-bottom:15px;
}

@keyframes spin{
0%{transform:rotate(0deg);}
100%{transform:rotate(360deg);}
}

.container{
display:grid;
grid-template-columns:1fr 1fr;
width:100%;
max-width:1000px;
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 20px 50px rgba(0,0,0,0.15);
}

.left{
position:relative;
min-height:500px;
}

.image{
object-fit:cover;
}

.textBox{
position:absolute;
top:40px;
left:40px;
z-index:2;
color:#0f172a;
font-size:18px;
line-height:1.6;
font-weight:500;
max-width:250px;
}

.right{
display:flex;
flex-direction:column;
justify-content:center;
padding:40px 50px;
background:#f7f7f7;
}

.logo{
text-align:center;
color:#1c6b68;
margin-bottom:10px;
font-size:26px;
}

.title{
text-align:center;
font-size:28px;
margin-bottom:5px;
}

.subtitle{
text-align:center;
font-size:14px;
margin-bottom:20px;
color:#555;
}

.label{
font-size:14px;
margin-bottom:6px;
margin-top:8px;
}

.input{
height:40px;
border-radius:6px;
border:1px solid #ddd;
padding:10px;
margin-bottom:10px;
}

.passwordNote{
font-size:12px;
color:#555;
margin-bottom:12px;
}

.register{
margin-top:10px;
background:#1c6b68;
color:white;
border:none;
padding:10px;
border-radius:6px;
cursor:pointer;
}

.error{
color:red;
font-size:13px;
text-align:center;
margin-bottom:8px;
}

.bottom{
text-align:center;
font-size:13px;
margin-top:15px;
color:#444;
}

.login-link{
color:#1c6b68;
font-weight:500;
cursor:pointer;
}

.login-link:hover{
text-decoration:underline;
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