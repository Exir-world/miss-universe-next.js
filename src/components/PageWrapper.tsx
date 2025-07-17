"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import BottomNavbar from "./BottomNavbar";
import React from "react";
import { useLoginStoreState } from "@/stores/context";
import { useRouter } from "@/i18n/navigation";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { getMe, hasGameSecret } = useLoginStoreState();

  const fetchUserData = useCallback(async () => {
    try {
      await getMe();
    } catch (err) {
      console.error("Error in PageWrapper:", err);
    } finally {
      setLoading(false);
    }
  }, [getMe]);

  useEffect(() => {
    fetchUserData();
  }, [pathname, fetchUserData, router]);

  // const searchParams = useSearchParams();
  // useEffect(() => {
  //   const r = searchParams.get("start") || searchParams.get("r");
  //   if (r) {
  //     sessionStorage.setItem("referralCode", r);
  //   }
  //   console.log(r, "from wrapper");

  // }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-zinc-900 text-white">
      {/* Gradient blobs (unchanged) */}
      <div className="fixed top-0 -right-20 z-0 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500 via-pink-400 to-purple-700 blur-[100px]" />
      <div className="fixed -bottom-20 -left-20 z-0 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500 via-pink-400 to-purple-700 blur-[100px]" />

      {/* Main content */}
      <div className="flex flex-col p-4 min-h-screen z-10 overflow-scroll relative">
        {loading && (
          <div className="z-50 fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="w-20">
              {/* Spinner */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <radialGradient
                  id="a12"
                  cx=".66"
                  fx=".66"
                  cy=".3125"
                  fy=".3125"
                  gradientTransform="scale(1.5)"
                >
                  <stop offset="0" stopColor="#FF4ED3" />
                  <stop offset=".3" stopColor="#FF4ED3" stopOpacity=".9" />
                  <stop offset=".6" stopColor="#FF4ED3" stopOpacity=".6" />
                  <stop offset=".8" stopColor="#FF4ED3" stopOpacity=".3" />
                  <stop offset="1" stopColor="#FF4ED3" stopOpacity="0" />
                </radialGradient>
                <circle
                  transform-origin="center"
                  fill="none"
                  stroke="url(#a12)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDasharray="200 1000"
                  strokeDashoffset="0"
                  cx="100"
                  cy="100"
                  r="70"
                >
                  <animateTransform
                    type="rotate"
                    attributeName="transform"
                    calcMode="spline"
                    dur="2s"
                    values="360;0"
                    keyTimes="0;1"
                    keySplines="0 0 1 1"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  transform-origin="center"
                  fill="none"
                  opacity=".2"
                  stroke="#FF4ED3"
                  strokeWidth="15"
                  strokeLinecap="round"
                  cx="100"
                  cy="100"
                  r="70"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Page content */}
        <div
          key={pathname}
          className="pb-24 max-w-2xl mx-auto w-full transition-all duration-500 animate-fade-slide"
        >
          {children}
          {<BottomNavbar hasGameSecret={hasGameSecret} />}
        </div>
      </div>
    </div>
  );
}
