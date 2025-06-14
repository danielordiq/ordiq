// apps/web/src/app/wizard/page.tsx
import PurposeStep from "./steps/PurposeStep";

export default function WizardPage() {
  return <PurposeStep onNext={() => console.log("next")} />;
}
