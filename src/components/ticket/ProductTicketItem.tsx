import { Minus, Plus, Trash2 } from "lucide-react";
import { useTicketStore } from "../../stores/useTicketStore";
import type { TicketItem } from "../../stores/useTicketStore";

const ProductTicketItem = ({ item }: { item: TicketItem }) => {
  const { removeItem, updateQty } = useTicketStore();

  return (
    <div className="group flex flex-col p-3 rounded-2xl bg-base-200 border border-base-300/50">
      <div className="flex justify-between items-start">
        <span className="font-bold text-sm leading-tight max-w-[60%]">{item.name}</span>
        <div className="text-right">
          <div className="font-mono font-black text-primary">
            {(item.price * item.quantity).toLocaleString()} FCFA
          </div>
          <div className="text-[10px] opacity-50">
            {item.price.toLocaleString()} × {item.quantity }
          </div>
        </div>
      </div>

      {/* Qty controls + delete */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateQty(item.id, item.quantity - 1)}
            className="btn btn-xs btn-circle btn-ghost border border-base-300"
          >
            <Minus size={10} />
          </button>
          <input type="number" value={item.quantity} onChange={(e) => updateQty(item.id, parseInt(e.target.value))} className="input text-sm font-bold w-10 h-6 text-center items-center flex [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
          <button
            onClick={() => updateQty(item.id, item.quantity + 1)}
            className="btn btn-xs btn-circle btn-ghost border border-base-300"
          >
            <Plus size={10} />
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductTicketItem;