import { create } from "zustand";
import { SalesService } from "../services/salesService";

type TicketItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  employee?: string;
};

export type Ticket = {
  items: TicketItem[];
  total: number;
};

type TicketStore = {
  currentTicket: Ticket;
  pendingTickets: Ticket[];

  addItem: (item: TicketItem) => void;
  removeItem: (id: string) => void;
  clearTicket: () => void;
  parkTicket: () => void;
  loadTicket: (index: number) => void;
  confirmTicket: () => Promise<void>;
};

export const useTicketStore = create<TicketStore>((set, get) => ({
  currentTicket: {
    items: [],
    total: 0,
  },

  pendingTickets: [],

  addItem: (item) =>
    set((state) => {
      const items = [...state.currentTicket.items, item];

      const total = items.reduce((sum, i) => sum + i.price, 0);

      return {
        currentTicket: { items, total },
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.currentTicket.items.filter((i) => i.id !== id);

      const total = items.reduce((sum, i) => sum + i.price, 0);

      return {
        currentTicket: { items, total },
      };
    }),

  clearTicket: () =>
    set({
      currentTicket: { items: [], total: 0 },
    }),

  parkTicket: () =>
    set((state) => ({
      pendingTickets: [...state.pendingTickets, state.currentTicket],
      currentTicket: { items: [], total: 0 },
    })),

  loadTicket: (index) =>
    set((state) => {
      const ticket = state.pendingTickets[index];

      const pending = [...state.pendingTickets];
      pending.splice(index, 1);

      return {
        currentTicket: ticket,
        pendingTickets: pending,
      };

}),
confirmTicket: async() => {
      const ticket = get().currentTicket;
      if(ticket.items.length == 0) return;
      
      try {
            await SalesService.createSale(ticket);
            set({currentTicket: {items: [], total: 0}}); // clear after sale
            console.log("Sale Confirmed!");
      } catch (error) {
            console.error("Failed to confirm sale: ", error)
      }
}
}));
