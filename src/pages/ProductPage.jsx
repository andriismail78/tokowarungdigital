import { useState } from "react";
import ProductForm from "../components/ProductForm";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Manajemen Produk</h1>
        <button onClick={() => setShowForm(true)}>+ Tambah Produk</button>
      </header>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.empty}>
                Belum ada produk
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPage;
