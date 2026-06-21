import type { Step } from '../../types';
import { useBundleStore } from '../../store/bundleStore';
import { StepAccordion } from '../StepAccordion';
import styles from './Builder.module.css';

interface Props {
  steps: Step[];
}

export function Builder({ steps }: Props) {
  const { currentStep, setStep } = useBundleStore();

  return (
    <div className={styles.builder}>
      <h1 className={styles.mobileTitle}>Let's get started!</h1>
      <div className={styles.steps}>
        {steps.map((step, idx) => (
          <StepAccordion
            key={step.id}
            step={step}
            stepNumber={idx + 1}
            totalSteps={steps.length}
            isOpen={currentStep === step.id}
            onToggle={() =>
              setStep(currentStep === step.id ? 0 : step.id)
            }
            onNext={
              step.nextLabel
                ? () => setStep(step.id + 1)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
