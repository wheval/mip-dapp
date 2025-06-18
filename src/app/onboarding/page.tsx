"use client";

import * as React from "react";
import dynamic from 'next/dynamic';

const MIPPortalClient = dynamic(
  () => import('@/src/components/MIPPortalClient'),
  { ssr: false }
);
const OnboardingForm = dynamic(
  () => import('./OnboardingForm'),
  { ssr: false }
);

export default function OnboardingPage() {
  return (
    <MIPPortalClient>
      <OnboardingForm />
    </MIPPortalClient>
  );
}