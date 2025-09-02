"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProductContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <ProductContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}
