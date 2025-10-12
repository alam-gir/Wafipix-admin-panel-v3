'use client';

/**
 * Custom pagination component using shadcn pagination primitives
 */

import * as React from "react";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination as PaginationType } from '@/lib/api/types/common';
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  className?: string;
}

export function PaginationComponent({
  pagination,
  onPageChange,
  onSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showSizeChanger = true,
  className = '',
}: PaginationComponentProps) {
  const { page, size, totalElements, totalPages, hasNext, hasPrevious } = pagination;

  const handlePageChange = (newPage: number) => {
    console.log('Pagination: handlePageChange called with:', newPage, 'totalPages:', totalPages);
    if (newPage >= 0 && newPage < totalPages) {
      console.log('Pagination: calling onPageChange with:', newPage);
      onPageChange(newPage);
    } else {
      console.log('Pagination: page change rejected - out of bounds');
    }
  };

  const handleSizeChange = (newSize: string) => {
    console.log('Pagination: handleSizeChange called with:', newSize);
    onSizeChange(parseInt(newSize));
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(0);
      
      if (page > 2) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 0 && i !== totalPages - 1) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 3) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Mobile: Stack vertically */}
      <div className="flex flex-col space-y-4 sm:hidden">
        {/* Page size selector - Mobile */}
        {showSizeChanger && (
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select 
              value={size.toString()} 
              onChange={(e) => handleSizeChange(e.target.value)}
              className="w-20 h-10 px-2 py-1 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option.toString()}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        )}

        {/* Pagination - Mobile (simplified) */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(0)}
            disabled={!hasPrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrevious}
            className="h-8 px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Prev</span>
          </Button>

          <span className="text-sm text-gray-700 px-2">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
            className="h-8 px-3"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Info - Mobile */}
        <div className="text-center text-sm text-gray-700">
          Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Left side - Page size selector */}
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select 
              value={size.toString()} 
              onChange={(e) => handleSizeChange(e.target.value)}
              className="w-20 h-10 px-2 py-1 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option.toString()}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        )}

        {/* Center - Page navigation using shadcn pagination */}
        <Pagination>
          <PaginationContent>
            {/* First page */}
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(0)}
                disabled={!hasPrevious}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>

            {/* Previous page */}
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!hasPrevious}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:block">Previous</span>
              </Button>
            </PaginationItem>

            {/* Page numbers */}
            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <Button
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum as number)}
                    className="h-8 w-8 p-0"
                  >
                    {(pageNum as number) + 1}
                  </Button>
                )}
              </PaginationItem>
            ))}

            {/* Next page */}
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNext}
                className="h-8 px-3"
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </PaginationItem>

            {/* Last page */}
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={!hasNext}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Right side - Info */}
        <div className="text-sm text-gray-700">
          Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
        </div>
      </div>
    </div>
  );
}
