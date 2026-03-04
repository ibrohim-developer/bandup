"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useRef, Suspense } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

interface TestFiltersProps {
  searchPlaceholder?: string;
  filters: FilterConfig[];
}

function TestFiltersContent({
  searchPlaceholder = "Search tests...",
  filters,
}: TestFiltersProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          className="w-full bg-card border border-neutral-200 dark:border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          placeholder={searchPlaceholder}
          type="text"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              updateParams("q", value);
            }, 400);
          }}
        />
      </div>
      <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={searchParams.get(filter.key) ?? "all"}
            onValueChange={(value) => updateParams(filter.key, value)}
          >
            <SelectTrigger className="w-full md:w-40 text-xs font-bold border-neutral-200 dark:border-neutral-700">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
}

function TestFiltersFallback({ filters }: { filters: FilterConfig[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          className="w-full bg-card border border-neutral-200 dark:border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          placeholder="Search tests..."
          type="text"
          disabled
        />
      </div>
      <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className="w-full md:w-40 h-10 bg-card border border-neutral-200 dark:border-neutral-700 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}

export function TestFilters(props: TestFiltersProps) {
  return (
    <Suspense fallback={<TestFiltersFallback filters={props.filters} />}>
      <TestFiltersContent {...props} />
    </Suspense>
  );
}
