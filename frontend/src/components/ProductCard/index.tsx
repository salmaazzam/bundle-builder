import type { Product } from '../../types';
import { useBundleStore } from '../../store/bundleStore';
import { QuantityStepper } from '../QuantityStepper';
import { VariantSelector } from '../VariantSelector';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  stepProducts?: Product[];
}

export function ProductCard({ product, stepProducts = [] }: Props) {
  const {
    getActiveVariantId,
    getVariantQty,
    getTotalQtyForProduct,
    setQuantity,
    setActiveVariant,
    selectSingle,
  } = useBundleStore();

  const activeVariantId = getActiveVariantId(
    product.id,
    product.variants?.[0]?.id ?? 'default'
  );
  const activeQty = getVariantQty(product.id, activeVariantId);
  const totalQty = getTotalQtyForProduct(product.id);
  const isSelected = product.singleSelect ? activeQty > 0 : totalQty > 0;

  function handleQtyChange(next: number) {
    setQuantity(product.id, activeVariantId, next);
  }

  function handleVariantChange(variantId: string) {
    setActiveVariant(product.id, variantId);
  }

  function handleSingleSelect() {
    selectSingle(product.id, stepProducts);
  }

  const priceLabel =
    product.price === 0
      ? `FREE${product.priceSuffix ?? ''}`
      : `$${product.price.toFixed(2)}${product.priceSuffix ?? ''}`;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${
        product.singleSelect ? styles.clickable : ''
      }`}
      onClick={product.singleSelect ? handleSingleSelect : undefined}
      role={product.singleSelect ? 'radio' : undefined}
      aria-checked={product.singleSelect ? isSelected : undefined}
    >
      {product.badge && (
        <span className={styles.badge}>{product.badge}</span>
      )}

      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        {product.learnMoreUrl && !product.singleSelect && (
          <a
            href={product.learnMoreUrl}
            className={styles.learnMore}
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </a>
        )}

        {product.features && (
          <ul className={styles.features}>
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}

        {product.variants && !product.singleSelect && (
          <VariantSelector
            variants={product.variants}
            activeId={activeVariantId}
            onChange={handleVariantChange}
          />
        )}
      </div>

      <div className={styles.footer}>
        {!product.singleSelect && (
          <QuantityStepper value={activeQty} onChange={handleQtyChange} />
        )}

        {product.singleSelect && (
          <div className={styles.selectBtn}>
            {isSelected ? (
              <span className={styles.selectedCheck}>✓ Selected</span>
            ) : (
              <span className={styles.selectHint}>Select plan</span>
            )}
          </div>
        )}

        <div className={styles.pricing}>
          {product.comparePrice != null && product.comparePrice > product.price && (
            <span className={styles.comparePrice}>
              ${product.comparePrice.toFixed(2)}
              {product.priceSuffix ?? ''}
            </span>
          )}
          <span className={styles.price}>{priceLabel}</span>
        </div>
      </div>
    </div>
  );
}
