import { useEffect, useState } from 'react';
import type { ProductsData } from '../types';
import { useBundleStore } from '../store/bundleStore';

export function useProducts() {
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initDefaults = useBundleStore((s) => s.initDefaults);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch products');
        return r.json();
      })
      .then((json: ProductsData) => {
        setData(json);
        const allProducts = json.steps.flatMap((s) => s.products);
        initDefaults(allProducts);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [initDefaults]);

  return { data, loading, error };
}
