"use client";

import "./globals.css";
import { Amplify } from "aws-amplify";
import awsconfig from "@/aws-exports";

// Correct: configure once globally
Amplify.configure(awsconfig);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
