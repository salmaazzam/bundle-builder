import styles from './QuantityStepper.module.css';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantityStepper({ value, onChange, min = 0, max = 99, size = 'md' }: Props) {
  return (
    <div className={`${styles.stepper} ${styles[size]}`}>
      <button
        className={styles.btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.count}>{value}</span>
      <button
        className={styles.btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
