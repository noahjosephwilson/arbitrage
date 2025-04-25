"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./ModifyCategories.module.css";

const API_URL =
  "https://lxqyajwdrd.execute-api.us-east-1.amazonaws.com/dev/readcategories";

interface Market {
  "Market ID": string;
  "Market Name": string;
}

interface SecondaryCategory {
  "Secondary ID": string;
  "Secondary Name": string;
  Markets: Market[];
}

interface PrimaryCategory {
  "Primary ID": string;
  "Primary Name": string;
  "Secondary Categories": SecondaryCategory[];
}

interface ApiResponse {
  "Primary Categories"?: PrimaryCategory[];
  data?: PrimaryCategory[];
}

const ModifyCategories: React.FC = () => {
  // ==========================================================================
  // STATE VARIABLES
  // ==========================================================================

  // Data & Status
  const [categories, setCategories] = useState<PrimaryCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown & Selected Items
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryCategory | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<SecondaryCategory | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // Edit states
  const [isEditingPrimary, setIsEditingPrimary] = useState<boolean>(false);
  const [editPrimaryValue, setEditPrimaryValue] = useState<string>("");
  const [isEditingSecondary, setIsEditingSecondary] = useState<boolean>(false);
  const [editSecondaryValue, setEditSecondaryValue] = useState<string>("");
  const [isEditingMarket, setIsEditingMarket] = useState<boolean>(false);
  const [editMarketValue, setEditMarketValue] = useState<string>("");

  // New Item Form States
  const [newPrimaryName, setNewPrimaryName] = useState<string>("");
  const [newSecondaryName, setNewSecondaryName] = useState<string>("");
  const [newMarketName, setNewMarketName] = useState<string>("");

  // Ref for outside click listener
  const containerRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // DATA FETCHING: Retrieve Categories from API
  // ==========================================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data: ApiResponse = await response.json();

        let categoriesData: PrimaryCategory[] | null = null;
        if (data && data["Primary Categories"]) {
          categoriesData = data["Primary Categories"];
        } else if (Array.isArray(data)) {
          categoriesData = data as PrimaryCategory[];
        } else if (data && data.data && Array.isArray(data.data)) {
          categoriesData = data.data;
        }

        if (categoriesData) {
          const formattedCategories = categoriesData.map((primary) => ({
            ...primary,
            "Secondary Categories": primary["Secondary Categories"] || [],
          }));
          setCategories(formattedCategories);
        } else {
          throw new Error("Categories not found in API response.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================================================
  // OUTSIDE CLICK LISTENER: Close Dropdowns When Clicking Outside
  // ==========================================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================================================================
  // DROPDOWN TOGGLING
  // ==========================================================================

  const toggleMenu = (menuName: string): void => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  // ==========================================================================
  // SELECTION HANDLERS
  // ==========================================================================

  const handleSelectPrimary = (primary: PrimaryCategory): void => {
    setSelectedPrimary(primary);
    setSelectedSecondary(null);
    setSelectedMarket(null);
    setActiveMenu(null);
    setIsEditingPrimary(false);
    setIsEditingSecondary(false);
    setIsEditingMarket(false);
  };

  const handleSelectSecondary = (secondary: SecondaryCategory): void => {
    setSelectedSecondary(secondary);
    setSelectedMarket(null);
    setActiveMenu(null);
    setIsEditingSecondary(false);
    setIsEditingMarket(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: PRIMARY CATEGORY
  // ==========================================================================

  const startEditPrimary = (): void => {
    if (!selectedPrimary) return;
    setIsEditingPrimary(true);
    setEditPrimaryValue(selectedPrimary["Primary Name"]);
  };

  const cancelEditPrimary = (): void => {
    setIsEditingPrimary(false);
    setEditPrimaryValue("");
  };

  const saveEditPrimary = (): void => {
    if (!selectedPrimary) return;
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        return { ...primary, "Primary Name": editPrimaryValue };
      }
      return primary;
    });
    setCategories(updated);
    setSelectedPrimary(
      updated.find((primary) => primary["Primary ID"] === selectedPrimary["Primary ID"]) || null
    );
    setIsEditingPrimary(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: SECONDARY CATEGORY
  // ==========================================================================

  const startEditSecondary = (): void => {
    if (!selectedSecondary) return;
    setIsEditingSecondary(true);
    setEditSecondaryValue(selectedSecondary["Secondary Name"]);
  };

  const cancelEditSecondary = (): void => {
    setIsEditingSecondary(false);
    setEditSecondaryValue("");
  };

  const saveEditSecondary = (): void => {
    if (!selectedPrimary || !selectedSecondary) return;
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        const updatedSecondaries = (primary["Secondary Categories"] || []).map((sec) => {
          if (sec["Secondary ID"] === selectedSecondary["Secondary ID"]) {
            return { ...sec, "Secondary Name": editSecondaryValue };
          }
          return sec;
        });
        return { ...primary, "Secondary Categories": updatedSecondaries };
      }
      return primary;
    });
    setCategories(updated);
    const updatedPrimary = updated.find(
      (primary) => primary["Primary ID"] === selectedPrimary["Primary ID"]
    );
    if (updatedPrimary) {
      setSelectedSecondary(
        updatedPrimary["Secondary Categories"].find(
          (sec) => sec["Secondary ID"] === selectedSecondary["Secondary ID"]
        ) || null
      );
    }
    setIsEditingSecondary(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: MARKET
  // ==========================================================================

  const startEditMarket = (): void => {
    if (!selectedMarket) return;
    setIsEditingMarket(true);
    setEditMarketValue(selectedMarket["Market Name"]);
  };

  const cancelEditMarket = (): void => {
    setIsEditingMarket(false);
    setEditMarketValue("");
  };

  const saveEditMarket = (): void => {
    if (!selectedPrimary || !selectedSecondary || !selectedMarket) return;
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        const updatedSecondaries = (primary["Secondary Categories"] || []).map((sec) => {
          if (sec["Secondary ID"] === selectedSecondary["Secondary ID"]) {
            const updatedMarkets = (sec["Markets"] || []).map((mkt) => {
              if (mkt["Market ID"] === selectedMarket["Market ID"]) {
                return { ...mkt, "Market Name": editMarketValue };
              }
              return mkt;
            });
            return { ...sec, "Markets": updatedMarkets };
          }
          return sec;
        });
        return { ...primary, "Secondary Categories": updatedSecondaries };
      }
      return primary;
    });
    setCategories(updated);
    const updatedPrimary = updated.find(
      (primary) => primary["Primary ID"] === selectedPrimary["Primary ID"]
    );
    if (updatedPrimary) {
      const updatedSecondary = updatedPrimary["Secondary Categories"].find(
        (sec) => sec["Secondary ID"] === selectedSecondary["Secondary ID"]
      );
      if (updatedSecondary) {
        setSelectedMarket(
          updatedSecondary["Markets"].find((mkt) => mkt["Market ID"] === selectedMarket["Market ID"]) || null
        );
      }
    }
    setIsEditingMarket(false);
  };

  // ==========================================================================
  // DELETION HANDLERS
  // ==========================================================================

  const handleDeletePrimary = (primaryId: string): void => {
    if (window.confirm("Are you sure you want to delete this primary category?")) {
      const updated = categories.filter(
        (primary) => primary["Primary ID"] !== primaryId
      );
      setCategories(updated);
      if (selectedPrimary && selectedPrimary["Primary ID"] === primaryId) {
        setSelectedPrimary(null);
        setSelectedSecondary(null);
        setSelectedMarket(null);
      }
    }
  };

  const handleDeleteSecondary = (primaryId: string, secondaryId: string): void => {
    if (window.confirm("Are you sure you want to delete this secondary category?")) {
      const updated = categories.map((primary) => {
        if (primary["Primary ID"] === primaryId) {
          return {
            ...primary,
            "Secondary Categories": primary["Secondary Categories"].filter(
              (sec) => sec["Secondary ID"] !== secondaryId
            ),
          };
        }
        return primary;
      });
      setCategories(updated);
      if (selectedSecondary && selectedSecondary["Secondary ID"] === secondaryId) {
        setSelectedSecondary(null);
        setSelectedMarket(null);
      }
    }
  };

  const handleDeleteMarket = (primaryId: string, secondaryId: string, marketId: string): void => {
    if (window.confirm("Are you sure you want to delete this market?")) {
      const updated = categories.map((primary) => {
        if (primary["Primary ID"] === primaryId) {
          const updatedSecondaries = primary["Secondary Categories"].map((sec) => {
            if (sec["Secondary ID"] === secondaryId) {
              return {
                ...sec,
                "Markets": sec["Markets"].filter((mkt) => mkt["Market ID"] !== marketId),
              };
            }
            return sec;
          });
          return { ...primary, "Secondary Categories": updatedSecondaries };
        }
        return primary;
      });
      setCategories(updated);
      if (selectedMarket && selectedMarket["Market ID"] === marketId) {
        setSelectedMarket(null);
      }
    }
  };

  // ==========================================================================
  // ADDITION HANDLERS
  // ==========================================================================

  const handleAddPrimary = (): void => {
    if (!newPrimaryName.trim()) return;
    const newPrimary: PrimaryCategory = {
      "Primary ID": Date.now().toString(),
      "Primary Name": newPrimaryName.trim(),
      "Secondary Categories": [],
    };
    setCategories([...categories, newPrimary]);
    setNewPrimaryName("");
  };

  const handleAddSecondary = (): void => {
    if (!selectedPrimary || !newSecondaryName.trim()) return;
    const newSecondary: SecondaryCategory = {
      "Secondary ID": Date.now().toString(),
      "Secondary Name": newSecondaryName.trim(),
      "Markets": [],
    };
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        return {
          ...primary,
          "Secondary Categories": [...primary["Secondary Categories"], newSecondary],
        };
      }
      return primary;
    });
    setCategories(updated);
    setNewSecondaryName("");
  };

  const handleAddMarket = (): void => {
    if (!selectedPrimary || !selectedSecondary || !newMarketName.trim()) return;
    const newMarket: Market = {
      "Market ID": Date.now().toString(),
      "Market Name": newMarketName.trim(),
    };
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        const updatedSecondaries = primary["Secondary Categories"].map((sec) => {
          if (sec["Secondary ID"] === selectedSecondary["Secondary ID"]) {
            return {
              ...sec,
              "Markets": [...sec["Markets"], newMarket],
            };
          }
          return sec;
        });
        return { ...primary, "Secondary Categories": updatedSecondaries };
      }
      return primary;
    });
    setCategories(updated);
    setNewMarketName("");
  };

  // ==========================================================================
  // REORDERING HANDLERS
  // ==========================================================================

  const movePrimary = (index: number, direction: "up" | "down"): void => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === categories.length - 1)
    ) {
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...categories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCategories(updated);
  };

  const moveSecondary = (primaryId: string, index: number, direction: "up" | "down"): void => {
    const primary = categories.find((p) => p["Primary ID"] === primaryId);
    if (!primary) return;
    const secondaries = primary["Secondary Categories"];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === secondaries.length - 1)
    ) {
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...categories];
    const primaryIndex = updated.findIndex((p) => p["Primary ID"] === primaryId);
    const updatedSecondaries = [...secondaries];
    [updatedSecondaries[index], updatedSecondaries[newIndex]] = [
      updatedSecondaries[newIndex],
      updatedSecondaries[index],
    ];
    updated[primaryIndex] = {
      ...updated[primaryIndex],
      "Secondary Categories": updatedSecondaries,
    };
    setCategories(updated);
  };

  // ==========================================================================
  // RENDER FUNCTIONS
  // ==========================================================================

  const renderPrimaryReorder = () => (
    <div className={styles.reorderContainer}>
      <h3>Reorder Primary Categories</h3>
      {categories.map((primary, index) => (
        <div key={primary["Primary ID"]} className={styles.reorderItem}>
          <span>{primary["Primary Name"]}</span>
          <div className={styles.reorderButtons}>
            <button
              onClick={() => movePrimary(index, "up")}
              disabled={index === 0}
              className={styles.reorderButton}
            >
              ↑
            </button>
            <button
              onClick={() => movePrimary(index, "down")}
              disabled={index === categories.length - 1}
              className={styles.reorderButton}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSecondaryReorder = () => {
    if (!selectedPrimary) return null;
    const secondaries = selectedPrimary["Secondary Categories"];
    const primaryId = selectedPrimary!["Primary ID"];
    return (
      <div className={styles.reorderContainer}>
        <h3>Reorder Secondary Categories</h3>
        {secondaries.map((secondary, index) => (
          <div key={secondary["Secondary ID"]} className={styles.reorderItem}>
            <span>{secondary["Secondary Name"]}</span>
            <div className={styles.reorderButtons}>
              <button
                onClick={() => moveSecondary(primaryId, index, "up")}
                disabled={index === 0}
                className={styles.reorderButton}
              >
                ↑
              </button>
              <button
                onClick={() => moveSecondary(primaryId, index, "down")}
                disabled={index === secondaries.length - 1}
                className={styles.reorderButton}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <h1 className={styles.title}>Modify Categories</h1>
      
      {/* Primary Categories */}
      <div className={styles.section}>
        <h2>Primary Categories</h2>
        <div className={styles.addForm}>
          <input
            type="text"
            value={newPrimaryName}
            onChange={(e) => setNewPrimaryName(e.target.value)}
            placeholder="New Primary Category"
            className={styles.input}
          />
          <button onClick={handleAddPrimary} className={styles.addButton}>
            Add Primary
          </button>
        </div>
        <div className={styles.list}>
          {categories.map((primary) => (
            <div
              key={primary["Primary ID"]}
              className={`${styles.item} ${
                selectedPrimary?.["Primary ID"] === primary["Primary ID"] ? styles.selected : ""
              }`}
            >
              {isEditingPrimary && selectedPrimary?.["Primary ID"] === primary["Primary ID"] ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editPrimaryValue}
                    onChange={(e) => setEditPrimaryValue(e.target.value)}
                    className={styles.input}
                  />
                  <button onClick={saveEditPrimary} className={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={cancelEditPrimary} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => handleSelectPrimary(primary)}
                    className={styles.itemName}
                  >
                    {primary["Primary Name"]}
                  </span>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleSelectPrimary(primary)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePrimary(primary["Primary ID"])}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Categories */}
      {selectedPrimary && (
        <div className={styles.section}>
          <h2>Secondary Categories</h2>
          <div className={styles.addForm}>
            <input
              type="text"
              value={newSecondaryName}
              onChange={(e) => setNewSecondaryName(e.target.value)}
              placeholder="New Secondary Category"
              className={styles.input}
            />
            <button onClick={handleAddSecondary} className={styles.addButton}>
              Add Secondary
            </button>
          </div>
          <div className={styles.list}>
            {selectedPrimary["Secondary Categories"].map((secondary) => (
              <div
                key={secondary["Secondary ID"]}
                className={`${styles.item} ${
                  selectedSecondary?.["Secondary ID"] === secondary["Secondary ID"]
                    ? styles.selected
                    : ""
                }`}
              >
                {isEditingSecondary &&
                selectedSecondary?.["Secondary ID"] === secondary["Secondary ID"] ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editSecondaryValue}
                      onChange={(e) => setEditSecondaryValue(e.target.value)}
                      className={styles.input}
                    />
                    <button onClick={saveEditSecondary} className={styles.saveButton}>
                      Save
                    </button>
                    <button onClick={cancelEditSecondary} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      onClick={() => handleSelectSecondary(secondary)}
                      className={styles.itemName}
                    >
                      {secondary["Secondary Name"]}
                    </span>
                    <div className={styles.itemActions}>
                      <button
                        onClick={() => handleSelectSecondary(secondary)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSecondary(
                            selectedPrimary["Primary ID"],
                            secondary["Secondary ID"]
                          )
                        }
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Markets */}
      {selectedSecondary && (
        <div className={styles.section}>
          <h2>Markets</h2>
          <div className={styles.addForm}>
            <input
              type="text"
              value={newMarketName}
              onChange={(e) => setNewMarketName(e.target.value)}
              placeholder="New Market"
              className={styles.input}
            />
            <button onClick={handleAddMarket} className={styles.addButton}>
              Add Market
            </button>
          </div>
          <div className={styles.list}>
            {selectedSecondary["Markets"].map((market) => (
              <div
                key={market["Market ID"]}
                className={`${styles.item} ${
                  selectedMarket?.["Market ID"] === market["Market ID"] ? styles.selected : ""
                }`}
              >
                {isEditingMarket && selectedMarket?.["Market ID"] === market["Market ID"] ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editMarketValue}
                      onChange={(e) => setEditMarketValue(e.target.value)}
                      className={styles.input}
                    />
                    <button onClick={saveEditMarket} className={styles.saveButton}>
                      Save
                    </button>
                    <button onClick={cancelEditMarket} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      onClick={() => setSelectedMarket(market)}
                      className={styles.itemName}
                    >
                      {market["Market Name"]}
                    </span>
                    <div className={styles.itemActions}>
                      <button
                        onClick={() => setSelectedMarket(market)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteMarket(
                            selectedPrimary?.["Primary ID"] || "",
                            selectedSecondary["Secondary ID"],
                            market["Market ID"]
                          )
                        }
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reordering Sections */}
      <div className={styles.reorderSections}>
        {renderPrimaryReorder()}
        {renderSecondaryReorder()}
      </div>
    </div>
  );
};

export default ModifyCategories; 