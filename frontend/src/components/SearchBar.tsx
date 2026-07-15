import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { useLocation } from "react-router-dom";
import { useProductStore } from "../stores/productStore";
import { useShallow } from "zustand/shallow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useProductStore(
    useShallow((state) => ({
      search: state.search,
      setSearch: state.setSearch,
      showSearch: state.showSearch,
      setShowSearch: state.setShowSearch,
    })),
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const handelCloseSearch = () => {
    setSearch("");
    setShowSearch(false);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }

    // Add listener when search is open
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t bg-muted/50 text-center" ref={searchRef}>
      <div className="inline-flex items-center justify-center border border-border rounded-full w-3/4 sm:w-1/2 my-3 mx-1 overflow-hidden">
        <Field orientation="horizontal">
          <Input
            type="text"
            placeholder="Search products..."
            className="flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="size-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handelCloseSearch}
        className="inline-flex"
      >
        <X className="size-3" />
      </Button>
    </div>
  ) : null;
};

export default SearchBar;
