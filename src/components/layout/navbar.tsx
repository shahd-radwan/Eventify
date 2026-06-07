// "use client";

// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { LogOut, Menu, X } from "lucide-react";
// import { Button } from "@/components";
// import React, { useState } from "react";
// import { useSession, signOut } from "next-auth/react";

// export function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const { data: session, status } = useSession();

//   const role = session?.user?.role;

//   const isLoggedIn = status === "authenticated";

//   // ================= ACCOUNT PATH =================
//   const accountPath =
//     role === "ORGANIZER"
//       ? "/users/organizer/Profile"
//       : role === "ATTENDEE"
//       ? "/users/attende"
//       : "/";

//   // ================= EVENTIFY CLICK =================
//   const handleLogoClick = () => {
//     if (!isLoggedIn) {
//       router.push("/");
//     } else {
//       router.push(accountPath);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">

//           {/* ================= LOGO ================= */}
//           <button
//             onClick={handleLogoClick}
//             className="flex items-center space-x-2 text-[#1c6b68]"
//           >
//             <div className="h-8 w-8 bg-[#1c6b68] rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">E</span>
//             </div>
//             <span className="font-bold text-xl text-[#1c6b68] hover:text-[#438381] transition">
//               Eventify
//             </span>
//           </button>

//           {/* ================= ORGANIZER NAV ================= */}
//           {role === "ORGANIZER" && (
//             <div className="hidden lg:flex items-center gap-3">
//               <Link href="/users/organizer/Profile">
//                 <Button
//                   className={`border border-[#1c6b68] px-4 py-1.5 rounded-lg ${
//                     pathname === "/users/organizer/Profile"
//                       ? "bg-[#1c6b68] text-white"
//                       : "text-[#1c6b68] bg-white"
//                   }`}
//                 >
//                   Profile
//                 </Button>
//               </Link>

//               <Link href="/users/organizer/Create-event">
//                 <Button
//                   className={`border border-[#1c6b68] px-4 py-1.5 rounded-lg ${
//                     pathname === "/users/organizer/Create-event"
//                       ? "bg-[#1c6b68] text-white"
//                       : "text-[#1c6b68] bg-white"
//                   }`}
//                 >
//                   Create event
//                 </Button>
//               </Link>

//               {/* ✅ UPDATED PATH */}
//               <Link href="/users/organizer/EventsPage">
//                 <Button
//                   className={`border border-[#1c6b68] px-4 py-1.5 rounded-lg ${
//                     pathname === "/users/organizer/EventsPage"
//                       ? "bg-[#1c6b68] text-white"
//                       : "text-[#1c6b68] bg-white"
//                   }`}
//                 >
//                   Events
//                 </Button>
//               </Link>
//             </div>
//           )}

//           {/* ================= AUTH / USER ================= */}
//           <div className="hidden lg:flex items-center space-x-2">
//             {status === "loading" ? (
//               <span className="text-[#1c6b68]">Loading...</span>
//             ) : isLoggedIn && session?.user ? (
//               <div className="flex gap-3 items-center">
//                 <p className="text-[#1c6b68]">
//                   Welcome {session.user.name}
//                 </p>

//                 <Button
//                   onClick={async () => {
//                     await signOut({ redirect: false });
//                     router.push("/auth/login");
//                   }}
//                   variant="ghost"
//                   size="icon"
//                   className="text-[#1c6b68] hover:bg-[#1c6b68]/10"
//                 >
//                   <LogOut className="h-5 w-5" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <Link href="/auth/login">
//                   <Button className="bg-[#1c6b68] text-white rounded-lg hover:bg-[#438381]">
//                     Login
//                   </Button>
//                 </Link>

//                 <Link href="/auth/register">
//                   <Button className="bg-white text-[#1c6b68] border border-[#1c6b68] rounded-lg hover:bg-[#1c6b68] hover:text-white">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* ================= MOBILE TOGGLE ================= */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden text-[#1c6b68]"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? <X /> : <Menu />}
//           </Button>
//         </div>

//         {/* ================= MOBILE MENU ================= */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden mt-2 flex flex-col gap-2">
//             {isLoggedIn && session?.user ? (
//               <>
//                 <span className="text-[#1c6b68] px-2">
//                   Welcome {session.user.name}
//                 </span>

//                 <Link href={accountPath} className="px-2">
//                   <Button className="w-full border border-[#1c6b68] text-[#1c6b68]">
//                     Account
//                   </Button>
//                 </Link>

//                 <Button
//                   onClick={async () => {
//                     await signOut({ redirect: false });
//                     router.push("/auth/login");
//                   }}
//                   className="text-left px-2"
//                 >
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Link href="/auth/login" className="px-2">
//                   <Button className="w-full bg-[#1c6b68] text-white">
//                     Login
//                   </Button>
//                 </Link>

//                 <Link href="/auth/register" className="px-2">
//                   <Button className="w-full border border-[#1c6b68] text-[#1c6b68]">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  const role = session?.user?.role;

  const isLoggedIn = status === "authenticated";

  // ================= ACCOUNT PATH =================
  const accountPath =
    role === "ORGANIZER"
      ? "/users/organizer/Profile"
      : role === "ATTENDEE"
      ? "/users/attende/Profile"
      : "/";

  // ================= NAV LINKS =================
  const organizerLinks = [
    {
      name: "Profile",
      href: "/users/organizer/Profile",
    },
    {
      name: "Create Event",
      href: "/users/organizer/Create-event",
    },
    {
      name: "Events",
      href: "/users/organizer/EventsPage",
    },
  ];

  const attendeeLinks = [
    {
      name: "Profile",
      href: "/users/attende/Profile",
    },
    {
      name: "Events",
      href: "/users/attende/Events",
    },
    {
      name: "Invitations",
      href: "/users/attende/Invitations",
    },
  ];

  const navLinks =
    role === "ORGANIZER"
      ? organizerLinks
      : role === "ATTENDEE"
      ? attendeeLinks
      : [];

  // ================= REDIRECT LOGIC =================
  useEffect(() => {
    if (status === "loading") return;

    // المستخدم مسجل دخول
    if (isLoggedIn) {
      if (
        pathname === "/" ||
        pathname === "/auth/login" ||
        pathname === "/auth/register"
      ) {
        router.replace(accountPath);
      }
    }
  }, [isLoggedIn, pathname, router, accountPath, status]);

  // ================= LOGO CLICK =================
  const handleLogoClick = () => {
    if (!isLoggedIn) {
      router.push("/");
    } else {
      router.push(accountPath);
    }

    setIsMobileMenuOpen(false);
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await signOut({ redirect: false });

    router.replace("/auth/login");

    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d7e5e5] bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex h-16 items-center justify-between">

          {/* ================= LOGO ================= */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#1c6b68] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">
                E
              </span>
            </div>

            <span className="font-bold text-xl text-[#1c6b68] group-hover:text-[#438381] transition">
              Eventify
            </span>
          </button>

          {/* ================= DESKTOP NAV ================= */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-3">

              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      className={`
                        px-4 py-2 rounded-xl border transition-all duration-200
                        ${
                          isActive
                            ? "bg-[#1c6b68] text-white border-[#1c6b68]"
                            : "bg-white text-[#1c6b68] border-[#1c6b68] hover:bg-[#1c6b68] hover:text-white"
                        }
                      `}
                    >
                      {link.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden lg:flex items-center gap-3">

            {status === "loading" ? (
              <span className="text-[#1c6b68] text-sm">
                Loading...
              </span>
            ) : isLoggedIn && session?.user ? (
              <>
                {/* <div className="flex items-center gap-2 bg-[#f3f8f8] px-4 py-2 rounded-full border border-[#d8e6e6]">

                  <div className="w-8 h-8 rounded-full bg-[#1c6b68] text-white flex items-center justify-center text-sm font-semibold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>

                  <p className="text-[#1c6b68] font-medium text-sm max-w-[120px] truncate">
                    {session.user.name}
                  </p>
                </div> */}
                <div className="flex items-center">
  <p className="text-[#1c6b68] font-medium text-sm">
    Welcome to Eventify
  </p>
</div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-[#1c6b68] hover:bg-[#1c6b68]/10 rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">

                <Link href="/auth/login">
                  <Button className="bg-[#1c6b68] text-white rounded-xl hover:bg-[#438381] transition">
                    Login
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button className="border border-[#1c6b68] bg-white text-[#1c6b68] rounded-xl hover:bg-[#1c6b68] hover:text-white transition">
                    Sign Up
                  </Button>
                </Link>

              </div>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#1c6b68] hover:bg-[#1c6b68]/10 rounded-full"
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 flex flex-col gap-3">

            {isLoggedIn && session?.user ? (
              <>
                <div className="flex items-center gap-3 bg-[#f3f8f8] p-3 rounded-2xl border">

                  <div className="w-10 h-10 rounded-full bg-[#1c6b68] text-white flex items-center justify-center font-semibold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-[#1c6b68] font-semibold">
                      {session.user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {role}
                    </p>
                  </div>
                </div>

                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
                    >
                      <Button
                        className={`
                          w-full justify-start rounded-xl border transition
                          ${
                            isActive
                              ? "bg-[#1c6b68] text-white border-[#1c6b68]"
                              : "bg-white text-[#1c6b68] border-[#1c6b68] hover:bg-[#1c6b68] hover:text-white"
                          }
                        `}
                      >
                        {link.name}
                      </Button>
                    </Link>
                  );
                })}

                <Button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                >
                  <Button className="w-full bg-[#1c6b68] text-white rounded-xl hover:bg-[#438381]">
                    Login
                  </Button>
                </Link>

                <Link
                  href="/auth/register"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                >
                  <Button className="w-full border border-[#1c6b68] bg-white text-[#1c6b68] rounded-xl hover:bg-[#1c6b68] hover:text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}