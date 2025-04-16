"use client";
import React from "react";
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

export function AmplifyProvider({ children }) {
  return <>{children}</>;
}
