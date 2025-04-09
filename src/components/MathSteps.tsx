import { MathStep } from "@/types/chat";

interface MathStepsProps {
  steps: MathStep[];
}

export default function MathSteps({ steps }: MathStepsProps) {
  return (
    <div className="mt-4 space-y-2">
      {steps.map((step) => (
        <div key={step.stepNumber} className="ml-4">
          <div className="flex items-start">
            <span className="font-bold mr-2">{step.stepNumber}.</span>
            <p>{step.explanation}</p>
          </div>
          {step.substeps && step.substeps.length > 0 && (
            <ul className="ml-6 mt-1 list-disc">
              {step.substeps.map((substep, index) => (
                <li key={index}>{substep}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
} 