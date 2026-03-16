import { create } from "zustand";
import { SalesService } from "../services/salesService";

export type TicketItemType = "PRODUCT" | "SERVICE" | "PACKAGE";

export interface PackageService {
  serviceId: string;
  name: string;
  price: number;
  employeeId?: string;
}

export interface TicketItem {
  id: string;
  name: string;
  price: number;
  type: TicketItemType;
  quantity: number;
  employeeId?: string;
  // Only for PACKAGE type: individual service employee assignments
  services?: PackageService[];
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
  clearPayments: () => void;
  confirmTicket: () => Promise<{ success: boolean; error?: string }>;
  assignEmployee: (itemId: string, employeeId: string) => void;
  assignPackageEmployee: (
    itemId: string,
    serviceId: string,
    employeeId: string
  ) => void;
};

function freshTicket(): Ticket {
  return {
    id: crypto.randomUUID(),
    items: [],
    payments: [],
    createdAt: Date.now(),
    total: 0,
  };
}

function calcTotal(items: TicketItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export const useTicketStore = create<TicketState>((set, get) => ({
  currentTicket: freshTicket(),
  pendingTickets: [],
  selectedPendingIndex: null,

  // ─── ADD ITEM 
  addItem: (item) =>
    set((state) => {
      const existing = state.currentTicket.items.find((i) => i.id === item.id);
      let newItems: TicketItem[];

      // Only stack quantity for PRODUCT; services/packages always add as new rows
      if (existing && item.type === "PRODUCT") {
        newItems = state.currentTicket.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.currentTicket.items, { ...item }];
      }

      return {
        currentTicket: {
          ...state.currentTicket,
          items: newItems,
          total: calcTotal(newItems),
        },
      };
    }),

  // ─── REMOVE ITEM 
  removeItem: (id) =>
    set((state) => {
      const items = state.currentTicket.items.filter((i) => i.id !== id);
      return {
        currentTicket: { ...state.currentTicket, items, total: calcTotal(items) },
      };
    }),

  // ─── UPDATE QTY 
  updateQty: (id, qty) =>
    set((state) => {
      if (qty <= 0) {
        // Remove item if qty hits 0
        const items = state.currentTicket.items.filter((i) => i.id !== id);
        return { currentTicket: { ...state.currentTicket, items, total: calcTotal(items) } };
      }
      const items = state.currentTicket.items.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i
      );
      return {
        currentTicket: { ...state.currentTicket, items, total: calcTotal(items) },
      };
    }),

  // ─── CLEAR TICKET 
  clearTicket: () => set({ currentTicket: freshTicket() }),

  // ─── PARK / LOAD 
  parkTicket: () =>
    set((state) => ({
      pendingTickets: [...state.pendingTickets, { ...state.currentTicket }],
      selectedPendingIndex: state.pendingTickets.length,
      currentTicket: freshTicket(),
    })),

  loadTicket: (index) =>
    set((state) => {
      const ticket = state.pendingTickets[index];
      const pending = state.pendingTickets.filter((_, i) => i !== index);
      return { currentTicket: ticket, pendingTickets: pending, selectedPendingIndex: null };
    }),

  selectPendingTicket: (index) => set({ selectedPendingIndex: index }),

  removePendingTicket: (index) =>
    set((state) => ({
      pendingTickets: state.pendingTickets.filter((_, i) => i !== index),
      selectedPendingIndex: null,
    })),

  // ─── PAYMENTS ─────────────────────────────────────────────────────────────
  addPayment: (payment) =>
    set((state) => ({
      currentTicket: {
        ...state.currentTicket,
        payments: [...state.currentTicket.payments, payment],
      },
    })),

  clearPayments: () =>
    set((state) => ({
      currentTicket: { ...state.currentTicket, payments: [] },
    })),

  // ─── CONFIRM TICKET ───────────────────────────────────────────────────────
  confirmTicket: async () => {
    const ticket = get().currentTicket;

    if (ticket.items.length === 0) {
      return { success: false, error: "Ticket is empty" };
    }
    if (ticket.payments.length === 0) {
      return { success: false, error: "No payment provided" };
    }

    // Validate payment total matches ticket total
    const paid = ticket.payments.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(paid - ticket.total) > 1) {
      return {
        success: false,
        error: `Payment mismatch. Paid: ${paid}, Expected: ${ticket.total}`,
      };
    }

    try {
      const payload = {
        items: ticket.items.map((item) => ({
          id: item.id,
          type: item.type,
          quantity: item.quantity,
          employeeId: item.employeeId,
          // For packages, pass per-service employee assignments if set
          ...(item.type === "PACKAGE" && item.services
            ? {
                services: item.services.map((s) => ({
                  serviceId: s.serviceId,
                  employeeId: s.employeeId,
                })),
              }
            : {}),
        })),
        payments: ticket.payments,
      };

      await SalesService.createSale(payload);
      set({ currentTicket: freshTicket() });
      return { success: true };
    } catch (error: any) {
      const msg =
        error.response?.data?.error ?? error.message ?? "Failed to confirm sale";
      console.error("[TicketStore] confirmTicket error:", msg);
      return { success: false, error: msg };
    }
  },

  // ─── ASSIGN EMPLOYEE ──────────────────────────────────────────────────────
  assignEmployee: (itemId, employeeId) =>
    set((state) => ({
      currentTicket: {
        ...state.currentTicket,
        items: state.currentTicket.items.map((item) =>
          item.id === itemId ? { ...item, employeeId } : item
        ),
      },
    })),

  // For packages: assign an employee to a specific service inside the package
  assignPackageEmployee: (itemId, serviceId, employeeId) =>
    set((state) => ({
      currentTicket: {
        ...state.currentTicket,
        items: state.currentTicket.items.map((item) => {
          if (item.id !== itemId || !item.services) return item;
          return {
            ...item,
            services: item.services.map((s) =>
              s.serviceId === serviceId ? { ...s, employeeId } : s
            ),
          };
        }),
      },
    })),
}));