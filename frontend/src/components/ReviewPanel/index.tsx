import type { Product, ReviewLineItem } from '../../types';
import { useBundleStore } from '../../store/bundleStore';
import { ReviewItem } from '../ReviewItem';
import styles from './ReviewPanel.module.css';
import fastShippingIcon from '../../assets/icons/fast-shipping.svg';
import satisfactionBadge from '../../assets/icons/satisfaction-bagde.svg';

interface Props {
  products: Product[];
}

const CATEGORY_LABELS: Record<number, string> = {
  1: 'CAMERAS',
  2: 'HOME MONITORING PLAN',
  3: 'SENSORS',
  4: 'ACCESSORIES',
};

function groupByStep(items: ReviewLineItem[]) {
  const map = new Map<number, ReviewLineItem[]>();
  for (const item of items) {
    if (!map.has(item.stepId)) map.set(item.stepId, []);
    map.get(item.stepId)!.push(item);
  }
  return map;
}

export function ReviewPanel({ products }: Props) {
  const { getReviewItems, confirmSave, saveConfirmed, dismissSave } =
    useBundleStore();

  const items = getReviewItems(products);
  const grouped = groupByStep(items);

  const hardwareItems = items.filter((i) => !i.singleSelect);
  const planItems = items.filter((i) => i.singleSelect);

  const hardwareTotal = hardwareItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  const hardwareCompare = hardwareItems.reduce(
    (sum, i) => sum + (i.comparePrice ?? i.price) * i.qty,
    0
  );

  const plan = planItems[0];
  const planPrice = plan?.price ?? 0;
  const planCompare = plan?.comparePrice ?? planPrice;

  const grandTotal = hardwareTotal + planPrice;
  const grandCompare = hardwareCompare + planCompare;
  const savings = grandCompare - grandTotal;
  const asLowAs = (hardwareTotal / 12 + planPrice).toFixed(2);

  const stepOrder = [1, 3, 4, 2];

  return (
    <aside className={styles.panel}>
      <div className={styles.reviewLabel}>REVIEW</div>

      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.heading}>Your security system</h2>
          <p className={styles.subheading}>
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No items selected yet.</p>
      ) : (
        <div className={styles.itemGroups}>
          {stepOrder.map((stepId) => {
            const group = grouped.get(stepId);
            if (!group || group.length === 0) return null;
            return (
              <div key={stepId} className={styles.group}>
                <div className={styles.groupLabel}>{CATEGORY_LABELS[stepId]}</div>
                {group.map((item) => (
                  <ReviewItem
                    key={`${item.productId}-${item.variantId}`}
                    item={item}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.shippingRow}>
        <div className={styles.shippingLeft}>
          <div className={styles.shippingIconBox}>
            <img src={fastShippingIcon} alt="" width={22} height={22} />
          </div>
          <span className={styles.shippingLabel}>Fast Shipping</span>
        </div>
        <div className={styles.shippingPrices}>
          <span className={styles.shippingCompare}>$5.99</span>
          <span className={styles.shippingFree}>FREE</span>
        </div>
      </div>

      <div className={styles.badgePriceRow}>
        <img
          src={satisfactionBadge}
          alt="100% Wyze satisfaction guarantee"
          className={styles.satisfactionBadge}
        />
        <div className={styles.priceBlock}>
          <div className={styles.asLowAs}>as low as ${asLowAs}/mo</div>
          <div className={styles.totalRow}>
            <span className={styles.totalCompare}>${grandCompare.toFixed(2)}</span>
            <span className={styles.totalPrice}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {savings > 0 && (
        <p className={styles.savings}>
          Congrats! You're saving ${savings.toFixed(2)} on your security bundle!
        </p>
      )}

      <button
        className={styles.checkoutBtn}
        onClick={() => alert('Checkout coming soon!')}
      >
        Checkout
      </button>

      <button className={styles.saveLink} onClick={confirmSave}>
        Save my system for later
      </button>

      {saveConfirmed && (
        <div
          className={styles.saveToast}
          onClick={dismissSave}
          role="status"
          onKeyDown={(e) => e.key === 'Enter' && dismissSave()}
          tabIndex={0}
        >
          ✓ Your system has been saved!
        </div>
      )}
    </aside>
  );
}
