'use client';

import { createContext, useContext } from 'react';

interface AdminDict {
    adminForm: Record<string, string>;
    adminItems: Record<string, string>;
    adminHistory: Record<string, string>;
    adminCategories: Record<string, string>;
    adminMenu: Record<string, string>;
}

const AdminDictContext = createContext<AdminDict | null>(null);

export function AdminDictProvider({ children, dict }: { children: React.ReactNode, dict: AdminDict }) {
    return <AdminDictContext.Provider value={dict}>{children}</AdminDictContext.Provider>;
}

export function useAdminDict() {
    const ctx = useContext(AdminDictContext);
    if (!ctx) throw new Error('useAdminDict must be used within AdminDictProvider');
    return ctx;
}
