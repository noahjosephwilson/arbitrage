"use client";

import "./globals.css";
import { Amplify } from "aws-amplify";
import awsconfig from "@/aws-exports";

// Configure Amplify once
Amplify.configure(awsconfig);

export default function RootLayout({ children }) {
  console.log("🔧 RootLayout mounted");

  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
