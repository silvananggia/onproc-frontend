"use client";
import React, { useMemo, useState } from "react";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import ModuleList from "./ModuleList";
import Footer from "../layouts/Footer";
import {
  filterAndSortModules,
  getAllDatasetTags,
  getCatalogModules,
} from "./modulesData";

function ModulCatalog() {
  const allModules = useMemo(
    () => getCatalogModules(JSON.parse(localStorage.getItem("user"))),
    []
  );
  const datasetOptions = useMemo(() => getAllDatasetTags(allModules), [allModules]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [accessFilter, setAccessFilter] = useState("all");

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedDatasets.length > 0 ||
    selectedCategories.length > 0 ||
    accessFilter !== "all" ||
    sortOrder !== "default";

  const visibleModules = useMemo(
    () =>
      filterAndSortModules({
        modules: allModules,
        searchQuery,
        selectedDatasets,
        selectedCategories,
        accessFilter,
        sortOrder,
      }),
    [allModules, searchQuery, selectedDatasets, selectedCategories, accessFilter, sortOrder]
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSortOrder("default");
    setSelectedDatasets([]);
    setSelectedCategories([]);
    setAccessFilter("all");
  };

  const toggleValue = (list, value, setter) => {
    setter(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    );
  };

  return (
    <div className="catalog-container">
      <Header />
      <main className="catalog-main">
        <Breadcrumb
          items={[
            { label: "Home", url: "/" },
            {
              label: "Katalog Modul",
              url: "/katalog-modul",
              active: true,
            },
          ]}
        />
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={() => {}}
        />
        <section className="catalog-content" aria-label="Isi katalog modul">
          <div className="catalog-layout">
            <FilterSidebar
              datasets={datasetOptions}
              selectedDatasets={selectedDatasets}
              onToggleDataset={(dataset) =>
                toggleValue(selectedDatasets, dataset, setSelectedDatasets)
              }
              selectedCategories={selectedCategories}
              onToggleCategory={(category) =>
                toggleValue(selectedCategories, category, setSelectedCategories)
              }
              accessFilter={accessFilter}
              onAccessChange={setAccessFilter}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
            <ModuleList
              modules={visibleModules}
              totalCount={allModules.length}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              onReset={resetFilters}
            />
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .catalog-container {
          background-color: #fff;
        }

        .catalog-main {
          display: flex;
          padding: 0 var(--page-pad-x) var(--page-pad-y);
          flex-direction: column;
        }

        @media (max-width: 991px) {
          .catalog-main {
            padding: 0 16px 28px;
          }
        }

        .catalog-content {
          margin-top: 12px;
        }

        .catalog-layout {
          gap: 20px;
          display: flex;
        }

        @media (max-width: 991px) {
          .catalog-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default ModulCatalog;
