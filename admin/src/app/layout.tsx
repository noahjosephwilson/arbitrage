"use client";

import "./globals.css";
import { Amplify } from "aws-amplify";
import awsconfig from "@/aws-exports";
import { ReactNode } from 'react';

// Correct: configure once globally
Amplify.configure(awsconfig);

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
} 