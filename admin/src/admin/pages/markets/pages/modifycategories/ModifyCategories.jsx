"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./ModifyCategories.module.css";

const API_URL =
  "https://lxqyajwdrd.execute-api.us-east-1.amazonaws.com/dev/readcategories";

const ModifyCategories = () => {
  // ==========================================================================
  // STATE VARIABLES
  // ==========================================================================

  // Data & Status
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown & Selected Items
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);

  // Edit states
  const [isEditingPrimary, setIsEditingPrimary] = useState(false);
  const [editPrimaryValue, setEditPrimaryValue] = useState("");
  const [isEditingSecondary, setIsEditingSecondary] = useState(false);
  const [editSecondaryValue, setEditSecondaryValue] = useState("");
  const [isEditingMarket, setIsEditingMarket] = useState(false);
  const [editMarketValue, setEditMarketValue] = useState("");

  // New Item Form States
  const [newPrimaryName, setNewPrimaryName] = useState("");
  const [newSecondaryName, setNewSecondaryName] = useState("");
  const [newMarketName, setNewMarketName] = useState("");

  // Ref for outside click listener
  const containerRef = useRef(null);

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
        const data = await response.json();

        let categoriesData = null;
        if (data && data["Primary Categories"]) {
          categoriesData = data["Primary Categories"];
        } else if (Array.isArray(data)) {
          categoriesData = data;
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
        setError(err.message);
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
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================================================================
  // DROPDOWN TOGGLING
  // ==========================================================================

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  // ==========================================================================
  // SELECTION HANDLERS
  // ==========================================================================

  const handleSelectPrimary = (primary) => {
    setSelectedPrimary(primary);
    setSelectedSecondary(null);
    setSelectedMarket(null);
    setActiveMenu(null);
    setIsEditingPrimary(false);
    setIsEditingSecondary(false);
    setIsEditingMarket(false);
  };

  const handleSelectSecondary = (secondary) => {
    setSelectedSecondary(secondary);
    setSelectedMarket(null);
    setActiveMenu(null);
    setIsEditingSecondary(false);
    setIsEditingMarket(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: PRIMARY CATEGORY
  // ==========================================================================

  const startEditPrimary = () => {
    setIsEditingPrimary(true);
    setEditPrimaryValue(selectedPrimary["Primary Name"]);
  };

  const cancelEditPrimary = () => {
    setIsEditingPrimary(false);
    setEditPrimaryValue("");
  };

  const saveEditPrimary = () => {
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        return { ...primary, "Primary Name": editPrimaryValue };
      }
      return primary;
    });
    setCategories(updated);
    setSelectedPrimary(
      updated.find((primary) => primary["Primary ID"] === selectedPrimary["Primary ID"])
    );
    setIsEditingPrimary(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: SECONDARY CATEGORY
  // ==========================================================================

  const startEditSecondary = () => {
    setIsEditingSecondary(true);
    setEditSecondaryValue(selectedSecondary["Secondary Name"]);
  };

  const cancelEditSecondary = () => {
    setIsEditingSecondary(false);
    setEditSecondaryValue("");
  };

  const saveEditSecondary = () => {
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
    setSelectedSecondary(
      updatedPrimary["Secondary Categories"].find(
        (sec) => sec["Secondary ID"] === selectedSecondary["Secondary ID"]
      )
    );
    setIsEditingSecondary(false);
  };

  // ==========================================================================
  // EDITING HANDLERS: MARKET
  // ==========================================================================

  const startEditMarket = () => {
    setIsEditingMarket(true);
    setEditMarketValue(selectedMarket["Market Name"]);
  };

  const cancelEditMarket = () => {
    setIsEditingMarket(false);
    setEditMarketValue("");
  };

  const saveEditMarket = () => {
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
    const updatedSecondary = updatedPrimary["Secondary Categories"].find(
      (sec) => sec["Secondary ID"] === selectedSecondary["Secondary ID"]
    );
    setSelectedMarket(
      updatedSecondary["Markets"].find((mkt) => mkt["Market ID"] === selectedMarket["Market ID"])
    );
    setIsEditingMarket(false);
  };

  // ==========================================================================
  // DELETION HANDLERS
  // ==========================================================================

  const handleDeletePrimary = (primaryId) => {
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

  const handleDeleteSecondary = (primaryId, secondaryId) => {
    if (
      window.confirm("Are you sure you want to delete this secondary category?")
    ) {
      const updated = categories.map((primary) => {
        if (primary["Primary ID"] === primaryId) {
          const filteredSecondaries = (primary["Secondary Categories"] || []).filter(
            (sec) => sec["Secondary ID"] !== secondaryId
          );
          return { ...primary, "Secondary Categories": filteredSecondaries };
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

  const handleDeleteMarket = (primaryId, secondaryId, marketId) => {
    if (window.confirm("Are you sure you want to delete this market?")) {
      const updated = categories.map((primary) => {
        if (primary["Primary ID"] === primaryId) {
          const updatedSecondaries = (primary["Secondary Categories"] || []).map(
            (sec) => {
              if (sec["Secondary ID"] === secondaryId) {
                const filteredMarkets = (sec["Markets"] || []).filter(
                  (mkt) => mkt["Market ID"] !== marketId
                );
                return { ...sec, "Markets": filteredMarkets };
              }
              return sec;
            }
          );
          return { ...primary, "Secondary Categories": updatedSecondaries };
        }
        return primary;
      });
      setCategories(updated);
    }
  };

  // ==========================================================================
  // ADD NEW ITEM HANDLERS
  // ==========================================================================

  const handleAddPrimary = () => {
    if (newPrimaryName.trim() === "") {
      alert("Please enter a valid primary category name.");
      return;
    }
    const newPrimary = {
      "Primary ID": Date.now().toString(),
      "Primary Name": newPrimaryName,
      "Secondary Categories": [],
    };
    setCategories([...categories, newPrimary]);
    setNewPrimaryName("");
  };

  const handleAddSecondary = () => {
    if (!selectedPrimary) {
      alert("Please select a primary category first.");
      return;
    }
    if (newSecondaryName.trim() === "") {
      alert("Please enter a valid secondary category name.");
      return;
    }
    const newSecondary = {
      "Secondary ID": Date.now().toString(),
      "Secondary Name": newSecondaryName,
      "Markets": [],
    };
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        const updatedSecondaries = [
          ...(primary["Secondary Categories"] || []),
          newSecondary,
        ];
        return { ...primary, "Secondary Categories": updatedSecondaries };
      }
      return primary;
    });
    setCategories(updated);
    setSelectedPrimary(
      updated.find((primary) => primary["Primary ID"] === selectedPrimary["Primary ID"])
    );
    setNewSecondaryName("");
  };

  const handleAddMarket = () => {
    if (!selectedSecondary) {
      alert("Please select a secondary category first.");
      return;
    }
    if (newMarketName.trim() === "") {
      alert("Please enter a valid market name.");
      return;
    }
    const newMarket = {
      "Market ID": Date.now().toString(),
      "Market Name": newMarketName,
    };
    const updated = categories.map((primary) => {
      if (primary["Primary ID"] === selectedPrimary["Primary ID"]) {
        const updatedSecondaries = (primary["Secondary Categories"] || []).map((sec) => {
          if (sec["Secondary ID"] === selectedSecondary["Secondary ID"]) {
            const updatedMarkets = [...(sec["Markets"] || []), newMarket];
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
    setSelectedSecondary(
      updatedPrimary["Secondary Categories"].find(
        (sec) => sec["Secondary ID"] === selectedSecondary["Secondary ID"]
      )
    );
    setNewMarketName("");
  };

  // ==========================================================================
  // REORDERING FUNCTIONS
  // ==========================================================================

  const movePrimary = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[newIndex]] = [
      newCategories[newIndex],
      newCategories[index],
    ];
    setCategories(newCategories);
  };

  const moveSecondary = (primaryId, index, direction) => {
    const primary = categories.find((p) => p["Primary ID"] === primaryId);
    if (!primary) return;
    const secondaries = [...(primary["Secondary Categories"] || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= secondaries.length) return;
    [secondaries[index], secondaries[newIndex]] = [
      secondaries[newIndex],
      secondaries[index],
    ];
    const updated = categories.map((p) =>
      p["Primary ID"] === primaryId ? { ...p, "Secondary Categories": secondaries } : p
    );
    setCategories(updated);
  };

  // ==========================================================================
  // RENDER: REORDER SECTIONS
  // ==========================================================================

  const renderPrimaryReorder = () => (
    <div className={styles.reorderSection}>
      <h2>Reorder Primary Categories</h2>
      {categories.map((primary, index) => (
        <div key={primary["Primary ID"]} className={styles.reorderItem}>
          <span>{primary["Primary Name"]}</span>
          <div className={styles.orderButtonsContainer}>
            <button onClick={() => movePrimary(index, -1)} className={styles.orderButton}>
              Up
            </button>
            <button onClick={() => movePrimary(index, 1)} className={styles.orderButton}>
              Down
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSecondaryReorder = () => {
    if (!selectedPrimary) return null;
    const secondaries = selectedPrimary["Secondary Categories"] || [];
    return (
      <div className={styles.reorderSection}>
        <h2>Reorder Secondary Categories</h2>
        {secondaries.map((sec, index) => (
          <div key={sec["Secondary ID"]} className={styles.reorderItem}>
            <span>{sec["Secondary Name"]}</span>
            <div className={styles.orderButtonsContainer}>
              <button
                onClick={() => moveSecondary(selectedPrimary["Primary ID"], index, -1)}
                className={styles.orderButton}
              >
                Up
              </button>
              <button
                onClick={() => moveSecondary(selectedPrimary["Primary ID"], index, 1)}
                className={styles.orderButton}
              >
                Down
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
    return (
      <div className={styles.container}>
        <p>Loading categories...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <h1 className={styles.header}>Modify Categories &amp; Markets</h1>
      <div className={styles.backLink}>
        <Link href="/">
          <button className={styles.backButton}>Back to Home</button>
        </Link>
      </div>

      {/* ---------------------------------------------------------------------
          MANAGE CATEGORIES SECTION
      --------------------------------------------------------------------- */}
      <section className={styles.manageSection}>
        <h2>Manage Categories</h2>

        {/* Primary Category Selection */}
        <div className={styles.dropdownSection}>
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton} onClick={() => toggleMenu("primary")}>
              {selectedPrimary ? selectedPrimary["Primary Name"] : "Select Primary Category"}
            </button>
            {activeMenu === "primary" && (
              <div className={styles.dropdownMenu}>
                {categories.map((primary) => (
                  <div
                    key={primary["Primary ID"]}
                    className={styles.dropdownItem}
                    onClick={() => handleSelectPrimary(primary)}
                  >
                    {primary["Primary Name"]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add New Primary Category */}
        <div className={`${styles.addSection} ${styles.vertical}`}>
          <h3>Add Primary Category</h3>
          <input
            type="text"
            placeholder="New primary category name"
            value={newPrimaryName}
            onChange={(e) => setNewPrimaryName(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddPrimary} className={styles.addButton}>
            Add Primary
          </button>
        </div>

        {selectedPrimary && (
          <>
            {/* Secondary Category Selection */}
            <div className={styles.dropdownSection}>
              <div className={styles.dropdown}>
                <button className={styles.dropdownButton} onClick={() => toggleMenu("secondary")}>
                  {selectedSecondary
                    ? selectedSecondary["Secondary Name"]
                    : "Select Secondary Category"}
                </button>
                {activeMenu === "secondary" && (
                  <div className={styles.dropdownMenu}>
                    {(selectedPrimary["Secondary Categories"] || []).map((sec) => (
                      <div
                        key={sec["Secondary ID"]}
                        className={styles.dropdownItem}
                        onClick={() => handleSelectSecondary(sec)}
                      >
                        {sec["Secondary Name"]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add New Secondary Category */}
            <div className={`${styles.addSection} ${styles.vertical}`}>
              <h3>Add Secondary Category</h3>
              <input
                type="text"
                placeholder="New secondary category name"
                value={newSecondaryName}
                onChange={(e) => setNewSecondaryName(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleAddSecondary} className={styles.addButton}>
                Add Secondary
              </button>
            </div>
          </>
        )}

        {selectedSecondary && (
          <>
            {/* Markets List */}
            <div className={styles.marketsList}>
              <h3>Markets</h3>
              {(selectedSecondary["Markets"] || []).length === 0 ? (
                <p>No markets available.</p>
              ) : (
                <ul className={styles.marketList}>
                  {selectedSecondary["Markets"].map((mkt) => (
                    <li key={mkt["Market ID"]} className={styles.marketItem}>
                      <span className={styles.marketText}>{mkt["Market Name"]}</span>
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => {
                            setSelectedMarket(mkt);
                            startEditMarket();
                          }}
                          className={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMarket(
                              selectedPrimary["Primary ID"],
                              selectedSecondary["Secondary ID"],
                              mkt["Market ID"]
                            )
                          }
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add New Market */}
            <div className={`${styles.addSection} ${styles.vertical}`}>
              <h3>Add Market</h3>
              <input
                type="text"
                placeholder="New market name"
                value={newMarketName}
                onChange={(e) => setNewMarketName(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleAddMarket} className={styles.addButton}>
                Add Market
              </button>
            </div>
          </>
        )}
      </section>

      {/* ---------------------------------------------------------------------
          EDIT SELECTED ITEMS SECTION
      --------------------------------------------------------------------- */}
      <section className={styles.editSection}>
        {selectedPrimary && (
          <div className={styles.selectedDetails}>
            <h2>Selected Primary Category</h2>
            {isEditingPrimary ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editPrimaryValue}
                  onChange={(e) => setEditPrimaryValue(e.target.value)}
                  className={styles.input}
                />
                <div className={styles.buttonGroup}>
                  <button onClick={saveEditPrimary} className={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={cancelEditPrimary} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>{selectedPrimary["Primary Name"]}</p>
                <div className={styles.buttonGroup}>
                  <button onClick={startEditPrimary} className={styles.editButton}>
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeletePrimary(selectedPrimary["Primary ID"])
                    }
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedSecondary && (
          <div className={styles.selectedDetails}>
            <h2>Selected Secondary Category</h2>
            {isEditingSecondary ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editSecondaryValue}
                  onChange={(e) => setEditSecondaryValue(e.target.value)}
                  className={styles.input}
                />
                <div className={styles.buttonGroup}>
                  <button onClick={saveEditSecondary} className={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={cancelEditSecondary} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>{selectedSecondary["Secondary Name"]}</p>
                <div className={styles.buttonGroup}>
                  <button onClick={startEditSecondary} className={styles.editButton}>
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteSecondary(
                        selectedPrimary["Primary ID"],
                        selectedSecondary["Secondary ID"]
                      )
                    }
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isEditingMarket && selectedMarket && (
          <div className={styles.selectedDetails}>
            <h2>Edit Market</h2>
            <div className={styles.editContainer}>
              <input
                type="text"
                value={editMarketValue}
                onChange={(e) => setEditMarketValue(e.target.value)}
                className={styles.input}
              />
              <div className={styles.buttonGroup}>
                <button onClick={saveEditMarket} className={styles.saveButton}>
                  Save
                </button>
                <button onClick={cancelEditMarket} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------
          REORDER CATEGORIES SECTION (Markets Reorder removed)
      --------------------------------------------------------------------- */}
      <section className={styles.reorderContainer}>
        {renderPrimaryReorder()}
        {renderSecondaryReorder()}
      </section>
    </div>
  );
};

export default ModifyCategories;
