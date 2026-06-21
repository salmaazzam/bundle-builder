import type { Step } from '../../types';
import { useBundleStore } from '../../store/bundleStore';
import { ProductCard } from '../ProductCard';
import styles from './StepAccordion.module.css';
import cameraIcon from '../../assets/icons/camera.svg';
import planIcon from '../../assets/icons/plan.svg';
import sensorIcon from '../../assets/icons/sensor.svg';
import protectionIcon from '../../assets/icons/protection.svg';
import accordionOpenedIcon from '../../assets/icons/accordion-opened.svg';
import accordionClosedIcon from '../../assets/icons/accordion-closed.svg';

const iconMap: Record<string, string> = {
  camera: cameraIcon,
  shield: planIcon,
  sensor: sensorIcon,
  grid: protectionIcon,
};

interface Props {
  step: Step;
  stepNumber: number;
  totalSteps: number;
  isOpen: boolean;
  onToggle: () => void;
  onNext?: () => void;
}

export function StepAccordion({
  step,
  stepNumber,
  totalSteps,
  isOpen,
  onToggle,
  onNext,
}: Props) {
  const getSelectedCountForStep = useBundleStore((s) => s.getSelectedCountForStep);
  const selectedCount = getSelectedCountForStep(step.products);

  return (
    <div className={`${styles.accordion} ${isOpen ? styles.open : ''}`}>
      <button className={styles.header} onClick={onToggle} aria-expanded={isOpen}>
        <div className={styles.stepLabelRow}>
          STEP {stepNumber} OF {totalSteps}
        </div>
        <div className={styles.headerMain}>
          <div className={styles.titleRow}>
            <span className={styles.icon}>
              <img src={iconMap[step.icon] ?? protectionIcon} alt="" width={22} height={22} />
            </span>
            <h2 className={styles.title}>{step.title}</h2>
          </div>
          <div className={styles.headerRight}>
            {selectedCount > 0 && (
              <span className={styles.selectedBadge}>
                {selectedCount} selected
              </span>
            )}
            <span className={styles.chevron}>
              <img src={isOpen ? accordionOpenedIcon : accordionClosedIcon} alt="" width={16} height={16} />
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={styles.content}>
          <div className={styles.grid}>
            {step.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stepProducts={step.products}
              />
            ))}
          </div>

          {step.nextLabel && onNext && (
            <button className={styles.nextBtn} onClick={onNext}>
              Next: {step.nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
