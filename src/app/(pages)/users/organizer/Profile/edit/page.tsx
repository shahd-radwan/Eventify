"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { apiServices } from "@/services/api";
import {
  User,
  UpdateUserRequest,
} from "@/interfaces/user-controller";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const token = session?.accessToken;

  const [user, setUser] = useState<User | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (!token) return;

      try {
        setLoadingPage(true);

        const userData: User | null = await apiServices.getMe(token);

        if (userData) {
          setUser(userData);
          setName(userData.name);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUser();
  }, [token]);

  // ================= LOADING SCREEN =================
  if (loadingPage || !user) {
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f5] z-50">
      
      <div className="flex flex-col items-center gap-4">

        {/* SPINNER */}
        <span className="w-10 h-10 border-4 border-[#1c6b68] border-t-transparent rounded-full animate-spin"></span>

        {/* TEXT */}
        <p className="text-[#1c6b68] font-medium text-sm tracking-wide animate-pulse">
          Loading ...
        </p>

      </div>

    </div>
  );

  }

  // ================= SAVE =================
  const handleSave = async (): Promise<void> => {
    if (!token) return;

    setLoadingSave(true);

    try {
      const payload: UpdateUserRequest = {};

      const trimmedName = name.trim();
      const trimmedPassword = password.trim();

      if (trimmedName) payload.name = trimmedName;
      if (trimmedPassword) payload.password = trimmedPassword;

      const res: User | null = await apiServices.updateUser(token, payload);

      if (!res) {
        alert("Update failed");
        return;
      }

      await update({
        name: res.name,
        role: res.role,
      });

      // إذا تغيرت كلمة السر → تسجيل خروج
      if (trimmedPassword) {
        await signOut({ redirect: false });
        router.replace("/auth/login");
        return;
      }

      router.push("/users/organizer/Profile");
      router.refresh();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSave(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (): Promise<void> => {
    if (!token) return;

    setLoadingDelete(true);

    try {
      await apiServices.deleteUser(token);

      await signOut({ redirect: false });
      router.replace("/auth/login");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    } finally {
      setLoadingDelete(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">

      <div className="w-full max-w-xl">

        {/* TITLE */}
        <h1 className="text-xl font-semibold flex items-center gap-2 mb-4 text-[#1c6b68]">
          <span className="w-1 h-6 bg-[#1c6b68] rounded"></span>
          Update Profile
        </h1>

        {/* CARD */}
        <div className="bg-white rounded-xl p-6 shadow">

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1c6b68]/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1c6b68]/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty if not changing"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className="flex-1 bg-[#1c6b68] text-white py-2 rounded-full hover:opacity-90 transition"
            >
              {loadingSave ? "Saving..." : "Save Changes"}
            </button>

            {/* DELETE */}
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={loadingDelete}
              className="flex-1 border border-red-500 text-red-500 py-2 rounded-full hover:bg-red-50 transition"
            >
              Delete
            </button>

          </div>

        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">

            <h2 className="text-lg font-semibold text-[#1c6b68] mb-3">
              Delete Account
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border py-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loadingDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-full hover:opacity-90"
              >
                {loadingDelete ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}