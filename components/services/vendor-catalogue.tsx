"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Search, ChevronDown, ChevronUp } from "lucide-react";
import { type CatalogueData } from "@/lib/services-api";
import { Input } from "@/components/ui/input";

interface VendorCatalogueProps {
  catalogue: CatalogueData;
  catalogueName?: string;
}

export function VendorCatalogue({ catalogue, catalogueName }: VendorCatalogueProps) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  if (!catalogue || !catalogue.headers || !catalogue.rows || catalogue.rows.length === 0) {
    return null;
  }

  // Filter rows based on search
  const filteredRows = catalogue.rows.filter((row) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return catalogue.headers.some((header) =>
      (row[header] || "").toLowerCase().includes(searchLower)
    );
  });

  // Sort rows if a column is selected
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn] || "";
    const bVal = b[sortColumn] || "";
    
    // Try to compare as numbers if both look like numbers
    const aNum = parseFloat(aVal.replace(/[₹,]/g, ""));
    const bNum = parseFloat(bVal.replace(/[₹,]/g, ""));
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }
    
    return sortDirection === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const toggleRowExpand = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Determine if a column contains prices
  const isPriceColumn = (header: string) => {
    const lower = header.toLowerCase();
    return lower.includes("price") || lower.includes("rate") || lower.includes("cost") || lower.includes("fee");
  };

  // Format cell value
  const formatCellValue = (header: string, value: string) => {
    if (!value) return "-";
    if (isPriceColumn(header) && !value.includes("₹")) {
      const num = parseFloat(value.replace(/,/g, ""));
      if (!isNaN(num)) {
        return `₹${num.toLocaleString("en-IN")}`;
      }
    }
    return value;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-[var(--color-brand)]/5 to-transparent">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[var(--color-brand)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {catalogueName || "Price List"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {catalogue.rows.length} items available
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {catalogue.headers.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(header)}
                  className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {sortColumn === header && (
                      sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={catalogue.headers.length} className="px-4 py-8 text-center text-muted-foreground">
                  No items found matching your search
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rowIdx) => (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIdx * 0.02 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {catalogue.headers.map((header, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-sm">
                      {isPriceColumn(header) ? (
                        <span className="font-semibold text-[var(--color-brand)]">
                          {formatCellValue(header, row[header])}
                        </span>
                      ) : colIdx === 0 ? (
                        <span className="font-medium text-foreground">{row[header] || "-"}</span>
                      ) : (
                        <span className="text-muted-foreground">{row[header] || "-"}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border/50">
        {sortedRows.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No items found matching your search
          </div>
        ) : (
          sortedRows.map((row, rowIdx) => {
            const isExpanded = expandedRows.has(rowIdx);
            const mainHeader = catalogue.headers[0];
            const priceHeader = catalogue.headers.find(h => isPriceColumn(h));
            
            return (
              <div key={rowIdx} className="p-4">
                <button
                  onClick={() => toggleRowExpand(rowIdx)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {row[mainHeader] || "Item"}
                      </p>
                      {priceHeader && (
                        <p className="text-lg font-semibold text-[var(--color-brand)]">
                          {formatCellValue(priceHeader, row[priceHeader])}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border/50 space-y-2"
                  >
                    {catalogue.headers.slice(1).map((header, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{header}</span>
                        {isPriceColumn(header) ? (
                          <span className="font-semibold text-[var(--color-brand)]">
                            {formatCellValue(header, row[header])}
                          </span>
                        ) : (
                          <span className="text-foreground">{row[header] || "-"}</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}
