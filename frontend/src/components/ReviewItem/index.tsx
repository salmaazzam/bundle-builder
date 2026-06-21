import type { ReviewLineItem } from '../../types';
import { useBundleStore } from '../../store/bundleStore';
import { QuantityStepper } from '../QuantityStepper';
import styles from './ReviewItem.module.css';

interface Props {
  item: ReviewLineItem;
}

export function ReviewItem({ item }: Props) {
  const setQuantity = useBundleStore((s) => s.setQuantity);

  const linePrice = item.price * item.qty;
  const lineCompare = item.comparePrice != null ? item.comparePrice * item.qty : null;
  const isFree = item.price === 0;
  const isPlan = item.singleSelect;

  function handleQtyChange(next: number) {
    if (isPlan) return;
    setQuantity(item.productId, item.variantId, next);
  }

  const displayName = item.variantName
    ? `${item.name} (${item.variantName})`
    : item.name;

  const priceDisplay = isFree
    ? `FREE${item.priceSuffix ?? ''}`
    : `$${linePrice.toFixed(2)}${item.priceSuffix ?? ''}`;

  return (
    <div className={styles.row}>
      <img src={item.image} alt={item.name} className={styles.thumb} />

      <div className={styles.info}>
        <span className={styles.name}>{displayName}</span>
      </div>

      {!isPlan ? (
        <QuantityStepper
          value={item.qty}
          onChange={handleQtyChange}
          min={0}
          size="sm"
        />
      ) : (
        <span className={styles.planQty}>—</span>
      )}

      <div className={styles.prices}>
        {lineCompare != null && lineCompare > linePrice && !isFree && (
          <span className={styles.comparePrice}>
            ${lineCompare.toFixed(2)}
            {item.priceSuffix ?? ''}
          </span>
        )}
        {lineCompare != null && isFree && (
          <span className={styles.comparePrice}>
            ${lineCompare.toFixed(2)}
          </span>
        )}
        <span className={styles.price}>
          {priceDisplay}
        </span>
      </div>
    </div>
  );
}
