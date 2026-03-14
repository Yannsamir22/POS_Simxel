import { create } from "zustand";
import { SalesService } from "../services/salesService";

export type TicketItemType = "PRODUCT" | "SERVICE" | "PACKAGE";

export interface TicketItem {
  id: string;
  name: string;
  price: number;
  type: TicketItemType;
  quantity: number;
  employeeId?: string;
}

export interface PaymentInput {
  method: "CASH" | "OM" | "MOMO" | "CARD";
  amount: number;
}

export type Ticket = {
  id: string;
  items: TicketItem[];
  payments: PaymentInput[];
  createdAt: number;
  total: number;
};

type TicketState = {
  currentTicket: Ticket;
  pendingTickets: Ticket[];
  selectedPendingIndex: number | null;

  addItem: (item: TicketItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;

  clearTicket: () => void;

  parkTicket: () => void;
  loadTicket: (index: number) => void;
  selectPendingTicket: (index: number) => void;
  removePendingTicket: (index: number) => void;

  addPayment: (payment: PaymentInput) => void;

  confirmTicket: () => Promise<void>;
};

export const useTicketStore = create<TicketState>((set, get) => ({
  currentTicket: {
    id: crypto.randomUUID(),
    items: [],
    payments: [],
    createdAt: Date.now(),
    total: 0,
  },

  pendingTickets: [],
  selectedPendingIndex: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.currentTicket.items.find((i) => i.id === item.id);

      let items;

      if (existing) {
        items = state.currentTicket.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        items = [...state.currentTicket.items, { ...item, quantity: 1 }];
      }

      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        currentTicket: { ...state.currentTicket, items, total },
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.currentTicket.items.filter((i) => i.id !== id);
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        currentTicket: {
          ...state.currentTicket,
          items,
          total,
        },
      };
    }),

  updateQty: (id, qty) =>
    set((state) => {
      const items = state.currentTicket.items.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i,
      );
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        currentTicket: {
          ...state.currentTicket,
          items,
          total,
        },
      };
    }),

  clearTicket: () =>
    set({
      currentTicket: {
        id: crypto.randomUUID(),
        items: [],
        payments: [],
        createdAt: Date.now(),
        total: 0,
      },
    }),

  parkTicket: () =>
    set((state) => {
      const newTicket = { ...state.currentTicket };
      return {
        pendingTickets: [...state.pendingTickets, newTicket],
        selectedPendingIndex: state.pendingTickets.length,
        currentTicket: {
          id: crypto.randomUUID(),
          items: [],
          payments: [],
          createdAt: Date.now(),
          total: 0,
        },
      };
    }),

  loadTicket: (index) =>
    set((state) => {
      const ticket = state.pendingTickets[index];

      const pending = [...state.pendingTickets];
      pending.splice(index, 1);

      return {
        currentTicket: ticket,
        pendingTickets: pending,
        selectedPendingIndex: null,
      };
    }),

  selectPendingTicket: (index) => set({ selectedPendingIndex: index }),
  removePendingTicket: (index) =>
    set((state) => {
      const pending = [...state.pendingTickets];
      pending.splice(index, 1);
      return { pendingTickets: pending, selectedPendingIndex: null };
    }),

  addPayment: (payment) =>
    set((state) => ({
      currentTicket: {
        ...state.currentTicket,
        payments: [...state.currentTicket.payments, payment],
      },
    })),

  confirmTicket: async () => {
    const ticket = get().currentTicket;

    if (ticket.items.length === 0) return;

    try {
      const payload = {
        items: ticket.items.map((item) => ({
          id: item.id,
          type: item.type,
          quantity: item.quantity,
          employeeId: item.employeeId,
        })),
        payments: ticket.payments,
      };

      await SalesService.createSale(payload);

      set({
        currentTicket: {
          id: crypto.randomUUID(),
          items: [],
          payments: [],
          createdAt: Date.now(),
          total: 0,
        },
      });

      console.log("Sale Confirmed!");
    } catch (error) {
      console.error("Failed to confirm sale:", error);
    }
  },
}));
