import { useProducts } from './hooks/useProducts';
import { Builder } from './components/Builder';
import { ReviewPanel } from './components/ReviewPanel';
import styles from './App.module.css';

export default function App() {
  const { data, loading, error } = useProducts();

  if (loading) {
    return (
      <div className={styles.state}>
        <div className={styles.spinner} />
        <p>Loading your security system builder…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.state}>
        <p className={styles.error}>Failed to load products. Is the backend running?</p>
        <code className={styles.errorCode}>npm run dev (in /backend)</code>
      </div>
    );
  }

  const allProducts = data.steps.flatMap((s) => s.products);

  return (
    <div className={styles.layout}>
      <main className={styles.builderCol}>
        <Builder steps={data.steps} />
      </main>
      <aside className={styles.reviewCol}>
        <ReviewPanel products={allProducts} />
      </aside>
    </div>
  );
}
