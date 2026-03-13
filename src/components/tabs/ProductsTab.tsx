// ProductsTab.tsx
import React, { useState } from "react";
import { useTicketStore, type TicketItemType } from "../../stores/useTicketStore";
import SearchBar from "../SearchBar";

const products = [
  { id: "p1", name: "Shampoo", price: 5000, quantity: 1, type: "PRODUCT" as TicketItemType },
  { id: "p2", name: "Conditioner", price: 4500, quantity: 1, type: "PRODUCT" as TicketItemType },
  { id: "p3", name: "Shampoo", price: 5000, quantity: 1, type: "PRODUCT" as TicketItemType },
  { id: "p4", name: "Conditioner", price: 4500, quantity: 1, type: "PRODUCT" as TicketItemType },
];

const ProductsTab: React.FC = () => {
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="flex flex-col h-full">

{/* Search bar */}
<div className="flex justify-between items-center px-10 border-b border-base-300 py-4">
  <h1 className="uppercase tracking-tighter font-extrabold">Product Sale</h1>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search products..."
        />
        </div>
    <div className="grid grid-cols-2 gap-4 p-20">
      {filteredProducts.map((p) => (
        <div
          key={p.id}
          onClick={() => addItem(p)}
          className="p-4 bg-base-200 rounded-xl hover:bg-primary/20 cursor-pointer flex justify-between items-center"
        >
          <span>{p.name}</span>
          <span>{p.price.toLocaleString()} FCFA</span>
        </div>
      ))}
    </div>
      </div>
  );
};

export default ProductsTab;
