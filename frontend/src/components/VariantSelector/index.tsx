import type { Variant } from '../../types';
import styles from './VariantSelector.module.css';

interface Props {
  variants: Variant[];
  activeId: string;
  onChange: (id: string) => void;
}

export function VariantSelector({ variants, activeId, onChange }: Props) {
  return (
    <div className={styles.row}>
      {variants.map((v) => (
        <button
          key={v.id}
          className={`${styles.chip} ${v.id === activeId ? styles.active : ''}`}
          onClick={() => onChange(v.id)}
          title={v.name}
          aria-label={v.name}
          aria-pressed={v.id === activeId}
        >
          <span
            className={styles.swatch}
            style={{
              background: v.color,
              border: v.color === '#D9D9D9' || v.color === '#E8E8E8'
                ? '1px solid #C4C4C4'
                : 'none',
            }}
          />
          <span className={styles.label}>{v.name}</span>
        </button>
      ))}
    </div>
  );
}
