import { useMemo, useState, useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

import { assets } from "../assets/assets";
import { useProductStore } from "../stores/productStore";
import { useShallow } from "zustand/shallow";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = [
  { value: "Topwear", label: "Top Wear" },
  { value: "Bottomwear", label: "Bottom Wear" },
  { value: "Winterwear", label: "Winter Wear" },
];
const SORT_OPTIONS = [
  { label: "Sort by: Relevant", value: "relevant" },
  { label: "Sort by: Low to High", value: "low-high" },
  { label: "Sort by: High to Low", value: "high-low" },
];

const Collection = () => {
  const { products, search, showSearch } = useProductStore(
    useShallow((state) => ({
      products: state.products,
      search: state.search,
      showSearch: state.showSearch,
    })),
  );

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState("relevant");

  // shadcn Checkbox passes the value directly, not a DOM event
  const toggleCategory = useCallback((value: string) => {
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  }, []);

  const toggleSubCategory = useCallback((value: string) => {
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setCategory([]);
    setSubCategory([]);
  }, []);

  // Single useMemo replaces useState + 3 useEffects
  const filterProducts = useMemo(() => {
    let result = products.slice();

    // Search
    if (search && showSearch) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (category.length > 0) {
      result = result.filter((item) => category.includes(item.category));
    }

    // Sub-category
    if (subCategory.length > 0) {
      result = result.filter((item) => subCategory.includes(item.subCategory));
    }

    // Sort
    switch (sortType) {
      case "low-high":
        return [...result].sort((a, b) => a.price - b.price);
      case "high-low":
        return [...result].sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [products, search, showSearch, category, subCategory, sortType]);

  const hasActiveFilters = category.length > 0 || subCategory.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* ── Filter sidebar ── */}
      <div className="min-w-50">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 font-medium"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 sm:hidden transition-transform duration-200 ${
              showFilter ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <FieldSet>
            <FieldLegend className="text-sm font-medium mb-3">
              CATEGORIES
            </FieldLegend>
            <FieldGroup className="gap-3">
              {CATEGORIES.map((cat) => (
                <Field key={cat} orientation="horizontal">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={category.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <FieldLabel
                    htmlFor={`cat-${cat}`}
                    className="text-sm font-light text-gray-700 cursor-pointer"
                  >
                    {cat}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Sub-category filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <FieldSet>
            <FieldLegend className="text-sm font-medium mb-3">TYPE</FieldLegend>
            <FieldGroup className="gap-3">
              {SUB_CATEGORIES.map(({ value, label }) => (
                <Field key={value} orientation="horizontal">
                  <Checkbox
                    id={`sub-${value}`}
                    checked={subCategory.includes(value)}
                    onCheckedChange={() => toggleSubCategory(value)}
                  />
                  <FieldLabel
                    htmlFor={`sub-${value}`}
                    className="text-sm font-light text-gray-700 cursor-pointer"
                  >
                    {label}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Clear filters — only shows when filters are active */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full text-gray-500"
            onClick={clearFilters}
          >
            Clear Filters ({category.length + subCategory.length})
          </Button>
        )}
      </div>

      {/* ── Product grid ── */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <Select value={sortType} onValueChange={setSortType}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SORT_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* No results */}
        {products.length > 0 && filterProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
            <p className="text-lg">No products match your search.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Products */}
        {filterProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                sizes={item.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
