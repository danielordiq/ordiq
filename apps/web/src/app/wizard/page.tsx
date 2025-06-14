// apps/web/src/app/wizard/page.tsx
"use client";                       // 👈 make the whole file a Client Component

import PurposeStep from "./steps/PurposeStep";

export default function WizardPage() {
  function handleNext() {
    console.log("next");           // later you’ll advance to step 2
  }

  return <PurposeStep onNext={handleNext} />;
}
