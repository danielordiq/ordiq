// apps/web/src/app/wizard/steps/PurposeStep.tsx
"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const sample = [
  "Automated CV-screening",
  "Customer-support chatbot",
  "Fraud-score model",
  "Recommender engine",
  "Other…",
];

export default function PurposeStep({ onNext }: { onNext: () => void }) {
  const [purpose, setPurpose] = useState(sample[0]);
  const [details, setDetails] = useState("");

  return (
    <section className="max-w-xl mx-auto space-y-6 p-6">
      <header className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold">What does the system do?</h2>

        {/* Back stays hidden on first step */}
        <div className="flex gap-2">
          {/* hidden placeholder for Back */}
          <button className="invisible px-4 py-2 rounded bg-slate-200 text-slate-500">
            Back
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <select
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {sample.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Describe specifics, delimiters, edge-cases…"
        rows={4}
        className="w-full border rounded px-3 py-2"
      />
    </section>
  );
}
