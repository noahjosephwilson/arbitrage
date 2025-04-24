// app/AmplifyProvider.js
"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "@/aws-exports";

Amplify.configure(awsconfig);

export default function AmplifyProvider({ children }) {
  return <>{children}</>;
}
