// ProductsTab.tsx
import React, { useEffect, useState } from "react";
import Loading from "../../loadash/Loading";
import { useProductStore } from "../../stores/productStore";
import { useTicketStore } from "../../stores/useTicketStore";
import SearchBar from "../SearchBar";
import { useT } from "../../hooks/useT";

const ProductsTab: React.FC = () => {
  const {t} = useT();
  const { products, fetchProducts, loading } = useProductStore();
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loading message="Loading Products..." />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="flex justify-between items-center px-10 border-b border-base-300 py-4">
        <h1 className="uppercase tracking-tighter font-extrabold">
          {t("pos.productSale")}
        </h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("pos.searchProducts")}
        />
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="flex-1 flex items-center justify-center opacity-30">
          <p className="font-black uppercase tracking-widest text-sm">
            {search ? t("pos.noResults"): t("pos.noProducts")}
          </p>
        </div>
      )}

      {/* Product list */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-15 ">
        {filteredProducts.map((p) => {
          const outOfStock = p.stock <= 0;
          const lowStock = p.stock > 0 && p.stock <= (p.minStockAlert ?? 5);
          return (
            <div
              key={p.id}
              onClick={() => {
                if (outOfStock) return;
                addItem({
                  id: p.id,
                  name: p.name,
                  price: p.salePrice,
                  type: "PRODUCT",
                  quantity: 1,
                });
              }}
              className={`p-4 bg-base-200 rounded-xl   flex flex-col gap-1 transition-all
                ${
                  outOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-primary/20 hover:border-primary cursor-pointer active:scale-95"
                }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm uppercase tracking-tight leading-tight">
                  {p.name}
                </span>
                <span className="font-black text-primary italic text-sm">
                  {p.salePrice.toLocaleString()} FCFA
                </span>
              </div>
              {/* Stock badge */}
              <span
                className={`self-start text-[10px] font-black px-2 py-0.5 rounded-md
                  ${
                    outOfStock
                      ? "bg-error/20 text-error"
                      : lowStock
                        ? "bg-warning/20 text-warning"
                        : "bg-success/10 text-success"
                  }`}
              >
                {outOfStock ?t("products.outOfStock") :`${p.stock} ${t("products.inStock")}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsTab;
