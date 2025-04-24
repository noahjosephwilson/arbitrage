"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        console.log("Confirmed user signed in:", user);
        setIsAllowed(true); // Only if getCurrentUser() succeeds
      } catch (error) {
        console.log("No confirmed user found, redirecting...");
        redirect("/registration/signup"); // If any error, immediately redirect
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAllowed ? children : null;
}
