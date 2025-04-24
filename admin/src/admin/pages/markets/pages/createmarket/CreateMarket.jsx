"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./CreateMarket.module.css";

// CustomDropdown component accepts an identifier, shared openDropdown state,
// and an optional "variant" prop for alternative styling (e.g. "large").
const CustomDropdown = ({
  identifier,
  openDropdown,
  setOpenDropdown,
  options,
  value,
  onChange,
  placeholder,
  variant = "default",
}) => {
  const isOpen = openDropdown === identifier;
  const toggleOpen = (e) => {
    // Prevent click from triggering the global listener.
    e.stopPropagation();
    if (isOpen) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(identifier);
    }
  };

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    if (typeof option === "object" && option.disabled) {
      return;
    }
    onChange(typeof option === "object" ? option.value : option);
    setOpenDropdown(null);
  };

  // Determine class names based on the variant prop.
  const containerClass =
    variant === "large" ? styles.largeDropdown : styles.customDropdown;
  const headerClass =
    variant === "large" ? styles.largeDropdownHeader : styles.dropdownHeader;
  const listClass =
    variant === "large" ? styles.largeDropdownList : styles.dropdownList;
  const listItemClass =
    variant === "large" ? styles.largeDropdownListItem : styles.dropdownListItem;

  return (
    <div className={containerClass} onClick={(e) => e.stopPropagation()}>
      <div className={headerClass} onClick={toggleOpen}>
        {value || placeholder}
      </div>
      {isOpen && (
        <div className={listClass}>
          {options.map((option, index) => {
            const label =
              typeof option === "object" ? option.label : option;
            const disabled = typeof option === "object" && option.disabled;
            return (
              <div
                key={index}
                className={`${listItemClass} ${disabled ? styles.disabledItem : ""}`}
                onClick={(e) => handleOptionClick(option, e)}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to convert date, time string, and period to a JavaScript Date object.
const convertToDate = (dateStr, timeStr, period) => {
  const date = new Date(dateStr);
  let hour = parseInt(timeStr, 10);
  if (isNaN(hour)) return null;
  if (period === "PM" && hour < 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const API_ENDPOINT =
  "https://of4p5kgo9l.execute-api.us-east-1.amazonaws.com/dev/create-market";

const CreateMarket = () => {
  // Metadata for Market Details and Options.
  const [metadata, setMetadata] = useState({
    Name: { value: "" },
    Event: { value: "" },
    Options: { type: "string", value: "Yes/No" },
  });
  const [message, setMessage] = useState("");

  // Options toggle state; default is "Yes/No."
  const [optionsType, setOptionsType] = useState("Yes/No");

  // File upload states.
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const [fullRules, setFullRules] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const fullRulesInputRef = useRef(null);

  // Rules Summary states.
  const [optionInput, setOptionInput] = useState("");
  const [subOptionInput, setSubOptionInput] = useState("");
  const [outcomes, setOutcomes] = useState([{ text: "", link: "" }]);
  const [rulesClarification, setRulesClarification] = useState("");

  // Timeline states.
  const [openDropdown, setOpenDropdown] = useState(null);
  const [closesOption, setClosesOption] = useState("When the outcome occurs");
  const [closesDate, setClosesDate] = useState("");
  const [closesTime, setClosesTime] = useState("");
  const [closesTimePeriod, setClosesTimePeriod] = useState("AM");
  const [closesOther, setClosesOther] = useState("");
  const [paysOutOption, setPaysOutOption] = useState("2 hours after close");
  const [paysOutDate, setPaysOutDate] = useState("");
  const [paysOutTime, setPaysOutTime] = useState("");
  const [paysOutTimePeriod, setPaysOutTimePeriod] = useState("AM");
  const [paysOutOther, setPaysOutOther] = useState("");

  // New state for category mapping fetched from a database.
  const [categoryMapping, setCategoryMapping] = useState({});

  // States for selected categories.
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [secondaryCategory, setSecondaryCategory] = useState("");

  // Simulated fetch from database for the category mapping.
  useEffect(() => {
    // In production, replace this with an API/database call.
    const fetchCategoryMapping = async () => {
      const fetchedMapping = {
        Sports: [
          { value: "Football", label: "Football" },
          { value: "Basketball", label: "Basketball" },
          { value: "Baseball", label: "Baseball" },
          { value: "Soccer", label: "Soccer" },
          { value: "Tennis", label: "Tennis" }
        ],
        Politics: [
          { value: "Domestic", label: "Domestic" },
          { value: "International", label: "International" },
          { value: "Elections", label: "Elections" },
          { value: "Legislation", label: "Legislation" },
          { value: "Policy", label: "Policy" }
        ],
        Entertainment: [
          { value: "Movies", label: "Movies" },
          { value: "Music", label: "Music" },
          { value: "Television", label: "Television" },
          { value: "Celebrities", label: "Celebrities" },
          { value: "Theater", label: "Theater" }
        ],
        Technology: [
          { value: "Gadgets", label: "Gadgets" },
          { value: "Software", label: "Software" },
          { value: "Hardware", label: "Hardware" },
          { value: "AI", label: "AI" },
          { value: "Cybersecurity", label: "Cybersecurity" }
        ],
        Business: [
          { value: "Finance", label: "Finance" },
          { value: "Startups", label: "Startups" },
          { value: "Economics", label: "Economics" },
          { value: "Retail", label: "Retail" },
          { value: "Marketing", label: "Marketing" }
        ]
      };
      setCategoryMapping(fetchedMapping);
    };

    fetchCategoryMapping();
  }, []);

  // Derive primary category options from the keys of the mapping.
  const primaryCategoryOptions = Object.keys(categoryMapping).map((key) => ({
    value: key,
    label: key,
  }));

  // Derive secondary category options based on the selected primary category.
  const secondaryCategoryOptions =
    primaryCategory && categoryMapping[primaryCategory]
      ? categoryMapping[primaryCategory]
      : [];

  // Clear secondary category if the primary category changes and the current value is not valid.
  useEffect(() => {
    if (
      secondaryCategoryOptions.length &&
      !secondaryCategoryOptions.some((item) => item.value === secondaryCategory)
    ) {
      setSecondaryCategory("");
    }
  }, [primaryCategory, secondaryCategory, secondaryCategoryOptions]);

  // Timeline error state for validation.
  const [timelineError, setTimelineError] = useState("");

  // Close dropdowns when clicking anywhere else on the page.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(`.${styles.customDropdown}`) &&
        !e.target.closest(`.${styles.largeDropdown}`)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Ensure that if "Close" is set to "When the outcome occurs," then "Date" cannot be chosen for Pays Out.
  useEffect(() => {
    if (closesOption === "When the outcome occurs" && paysOutOption === "Date") {
      setPaysOutOption("2 hours after close");
    }
  }, [closesOption, paysOutOption]);

  // File Upload Handlers.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleFullRulesUpload = (e) => {
    const file = e.target.files[0];
    setFullRules(file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPdfPreview(fileUrl);
    } else {
      setPdfPreview(null);
    }
  };

  const deleteUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const deleteFullRules = () => {
    setFullRules(null);
    setPdfPreview(null);
    if (fullRulesInputRef.current) {
      fullRulesInputRef.current.value = "";
    }
  };

  // Input handlers for Market Details.
  const handleInputChange = (field, value) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  // Options Toggle Handler.
  const handleOptionsToggle = (choice) => {
    setOptionsType(choice);
    if (choice === "Yes/No") {
      setMetadata((prev) => ({
        ...prev,
        Options: { type: "string", value: "Yes/No" },
      }));
    } else {
      setMetadata((prev) => ({
        ...prev,
        Options: {
          type: "nestedMap",
          value: [{ primaryKey: "", nestedToggle: "Yes/No", extra1: "", extra2: "" }],
        },
      }));
    }
  };

  // Nested Map Handlers.
  const handleNestedEntryChange = (outerIndex, field, newValue) => {
    setMetadata((prev) => {
      const updatedEntries = [...prev.Options.value];
      updatedEntries[outerIndex] = { ...updatedEntries[outerIndex], [field]: newValue };
      return { ...prev, Options: { ...prev.Options, value: updatedEntries } };
    });
  };

  const addNestedMap = () => {
    setMetadata((prev) => {
      const updatedEntries = [
        ...prev.Options.value,
        { primaryKey: "", nestedToggle: "Yes/No", extra1: "", extra2: "" },
      ];
      return { ...prev, Options: { ...prev.Options, value: updatedEntries } };
    });
  };

  const removeNestedMap = (outerIndex) => {
    setMetadata((prev) => {
      const updatedEntries = [...prev.Options.value];
      if (updatedEntries.length > 1) {
        updatedEntries.splice(outerIndex, 1);
      }
      return { ...prev, Options: { ...prev.Options, value: updatedEntries } };
    });
  };

  // Outcomes Handlers.
  const handleOutcomeChange = (index, field, value) => {
    setOutcomes((prev) => {
      const newOutcomes = [...prev];
      newOutcomes[index] = { ...newOutcomes[index], [field]: value };
      return newOutcomes;
    });
  };

  const addOutcome = () => {
    setOutcomes((prev) => [...prev, { text: "", link: "" }]);
  };

  const removeOutcome = (index) => {
    setOutcomes((prev) => {
      if (prev.length > 1) {
        const newOutcomes = [...prev];
        newOutcomes.splice(index, 1);
        return newOutcomes;
      }
      return prev;
    });
  };

  // Helper to validate timeline inputs.
  const validateTimeline = () => {
    if (closesOption === "Date" && paysOutOption === "Date") {
      if (!closesDate || !closesTime || !paysOutDate || !paysOutTime) {
        setTimelineError("Please provide date and time for both Closes and Pays Out.");
        return false;
      }
      const closeDateTime = convertToDate(closesDate, closesTime, closesTimePeriod);
      const payoutDateTime = convertToDate(paysOutDate, paysOutTime, paysOutTimePeriod);
      if (!closeDateTime || !payoutDateTime || payoutDateTime <= closeDateTime) {
        setTimelineError("Payout date/time must be after Close date/time.");
        return false;
      }
    }
    setTimelineError("");
    return true;
  };

  // Prepare payload including timeline details and category fields.
  const preparePayload = () => {
    const preparedMetadata = {};
    preparedMetadata["Name"] = metadata.Name.value;
    preparedMetadata["Event"] = metadata.Event.value;
    if (optionsType === "Yes/No") {
      preparedMetadata["Options"] = metadata.Options.value;
    } else {
      preparedMetadata["Options"] = metadata.Options.value.map((entry) => ({
        [entry.primaryKey]:
          entry.nestedToggle === "Yes/No"
            ? "Yes/No"
            : { extra1: entry.extra1, extra2: entry.extra2 },
      }));
    }
    preparedMetadata["Image"] = uploadedImage ? uploadedImage.name : "";
    preparedMetadata["RulesSummary"] = {
      if: optionInput,
      then: subOptionInput,
      outcomes: outcomes.filter((item) => item.text.trim() !== "" || item.link.trim() !== ""),
    };
    preparedMetadata["RulesClarification"] = rulesClarification;
    preparedMetadata["FullRules"] = fullRules ? fullRules.name : "";

    // Timeline payload.
    const timeline = {};
    if (closesOption === "Date") {
      timeline.closes = {
        type: "Date",
        date: closesDate,
        time: closesTime,
        timePeriod: closesTimePeriod,
      };
    } else if (closesOption === "Other") {
      timeline.closes = closesOther;
    } else {
      timeline.closes = closesOption;
    }
    if (paysOutOption === "Date") {
      timeline.paysOut = {
        type: "Date",
        date: paysOutDate,
        time: paysOutTime,
        timePeriod: paysOutTimePeriod,
      };
    } else if (paysOutOption === "Other") {
      timeline.paysOut = paysOutOther;
    } else {
      timeline.paysOut = paysOutOption;
    }
    preparedMetadata["Timeline"] = timeline;

    // Category fields.
    preparedMetadata["Primary Category"] = primaryCategory;
    preparedMetadata["Secondary Category"] = secondaryCategory;

    console.log("Prepared metadata:", preparedMetadata);
    return {
      ATTRIBUTE: "METADATA",
      attributes: preparedMetadata,
    };
  };

  const downloadJSON = () => {
    const payload = preparePayload();
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "marketPayload.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sendToAPI = async () => {
    const payload = preparePayload();
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Market created successfully!");
      } else {
        setMessage(result.message || "Error creating market");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Error submitting data: " + error.message);
    }
  };

  // New handler for sending to API after validating timeline.
  const handleAPISubmit = (e) => {
    e.preventDefault();
    if (validateTimeline()) {
      sendToAPI();
    }
  };

  // New handler for downloading JSON after validating timeline.
  const handleDownloadJSON = (e) => {
    e.preventDefault();
    if (validateTimeline()) {
      downloadJSON();
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.fixedContainer}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Market</h1>
          {/* Prevent default form submission since we are using custom button handlers */}
          <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            {/* Market Details */}
            <h2 className={styles.sectionTitle}>Market Details</h2>
            {["Name", "Event"].map((field) => (
              <div key={field} className={styles.formGroup}>
                <label htmlFor={field} className={styles.label}>
                  {field} {field === "Event" && "(Optional)"}
                </label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    id={field}
                    placeholder={field}
                    value={metadata[field].value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={styles.input}
                    required={field !== "Event"}
                  />
                </div>
              </div>
            ))}

            {/* Options Section with Toggle */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Options</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${optionsType === "Yes/No" ? styles.activeToggle : ""}`}
                  onClick={() => handleOptionsToggle("Yes/No")}
                >
                  Yes/No
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${optionsType === "Other" ? styles.activeToggle : ""}`}
                  onClick={() => handleOptionsToggle("Other")}
                >
                  Other
                </button>
              </div>
              {optionsType === "Other" && (
                <div className={styles.nestedMapContainer}>
                  {metadata.Options.value.map((entry, outerIndex) => (
                    <div key={outerIndex} className={styles.nestedMapGroup}>
                      <div className={styles.nestedMapMasterRow}>
                        <input
                          type="text"
                          placeholder="Option"
                          value={entry.primaryKey}
                          onChange={(e) => handleNestedEntryChange(outerIndex, "primaryKey", e.target.value)}
                          className={styles.input}
                          required
                        />
                        {metadata.Options.value.length > 1 && (
                          <button
                            type="button"
                            className={styles.deletePairButton}
                            onClick={() => removeNestedMap(outerIndex)}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      <div className={styles.nestedToggleGroup}>
                        <button
                          type="button"
                          className={`${styles.toggleButton} ${entry.nestedToggle === "Yes/No" ? styles.activeToggle : ""}`}
                          onClick={() => handleNestedEntryChange(outerIndex, "nestedToggle", "Yes/No")}
                        >
                          Yes/No
                        </button>
                        <button
                          type="button"
                          className={`${styles.toggleButton} ${entry.nestedToggle === "Other" ? styles.activeToggle : ""}`}
                          onClick={() => handleNestedEntryChange(outerIndex, "nestedToggle", "Other")}
                        >
                          Other
                        </button>
                      </div>
                      {entry.nestedToggle === "Other" && (
                        <div className={styles.nestedExtraInputs}>
                          <input
                            type="text"
                            placeholder="Sub-Option 1"
                            value={entry.extra1}
                            onChange={(e) => handleNestedEntryChange(outerIndex, "extra1", e.target.value)}
                            className={styles.input}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Sub-Option 2"
                            value={entry.extra2}
                            onChange={(e) => handleNestedEntryChange(outerIndex, "extra2", e.target.value)}
                            className={styles.input}
                            required
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <a
                    href="#"
                    className={styles.addPairLink}
                    onClick={(e) => {
                      e.preventDefault();
                      addNestedMap();
                    }}
                  >
                    + Add another nested map
                  </a>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className={styles.imageUploadSection}>
              <h2 className={styles.sectionTitle}>Upload Image</h2>
              <div className={styles.fileUploadContainer}>
                <label htmlFor="imageUpload" className={styles.uploadButton}>
                  Choose Image
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={imageInputRef}
                  className={styles.hiddenInput}
                />
              </div>
              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className={styles.imagePreview}
                  />
                </div>
              )}
              {uploadedImage && (
                <>
                  <p className={styles.fileName}>{uploadedImage.name}</p>
                  <button type="button" onClick={deleteUploadedImage} className={styles.secondaryButton}>
                    Delete Image
                  </button>
                </>
              )}
            </div>

            {/* Rules Summary */}
            <div className={styles.rulesSummarySection}>
              <h2 className={styles.sectionTitle}>Rules Summary</h2>
              <div className={styles.resolutionRow}>
                <span className={styles.resolutionText}>If</span>
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  className={`${styles.input} ${styles.resolutionInput}`}
                />
                <span className={styles.resolutionText}>[Option]</span>
                <input
                  type="text"
                  value={subOptionInput}
                  onChange={(e) => setSubOptionInput(e.target.value)}
                  className={`${styles.input} ${styles.resolutionInput}`}
                />
                <span className={styles.resolutionText}>, then the market resolves to [Sub-Option]</span>
              </div>
              <div className={styles.outcomesSection}>
                <label className={styles.label}>Outcomes Verified By:</label>
                {outcomes.map((outcome, index) => (
                  <div key={index} className={styles.outcomeRow}>
                    <input
                      type="text"
                      placeholder="Source Text"
                      value={outcome.text}
                      onChange={(e) => handleOutcomeChange(index, "text", e.target.value)}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Source URL"
                      value={outcome.link}
                      onChange={(e) => handleOutcomeChange(index, "link", e.target.value)}
                      className={styles.input}
                    />
                    {outcomes.length > 1 && (
                      <button type="button" className={styles.deleteOutcomeButton} onClick={() => removeOutcome(index)}>
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <a
                  href="#"
                  className={styles.addPairLink}
                  onClick={(e) => {
                    e.preventDefault();
                    addOutcome();
                  }}
                >
                  + Add another outcome
                </a>
              </div>
            </div>

            {/* Rules Clarification */}
            <div className={styles.rulesClarificationSection}>
              <h2 className={styles.sectionTitle}>Rules Clarification</h2>
              <textarea
                placeholder="Enter further clarification of the rules..."
                value={rulesClarification}
                onChange={(e) => setRulesClarification(e.target.value)}
                className={styles.textarea}
              />
            </div>

            {/* Full Rules Upload */}
            <div className={styles.fullRulesSection}>
              <h2 className={styles.sectionTitle}>Full Rules</h2>
              <div className={styles.fileUploadContainer}>
                <label htmlFor="fullRulesUpload" className={styles.uploadButton}>
                  Choose File
                </label>
                <input
                  id="fullRulesUpload"
                  type="file"
                  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFullRulesUpload}
                  ref={fullRulesInputRef}
                  className={styles.hiddenInput}
                />
              </div>
              {fullRules && (
                <div className={styles.fullRulesPreview}>
                  <a href={pdfPreview} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                    {fullRules.name}
                  </a>
                  <button type="button" onClick={deleteFullRules} className={styles.secondaryButton}>
                    Delete File
                  </button>
                </div>
              )}
            </div>

            {/* Timeline Section */}
            <div className={styles.timelineSection}>
              <h2 className={styles.sectionTitle}>Timeline</h2>
              <div className={styles.timelineGroup}>
                <label className={styles.label}>Closes</label>
                <div className={styles.dropdownRow}>
                  <CustomDropdown
                    identifier="closes"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    options={[
                      { value: "When the outcome occurs", label: "When the outcome occurs" },
                      { value: "Date", label: "Date" },
                      { value: "Other", label: "Other" },
                    ]}
                    value={closesOption}
                    onChange={setClosesOption}
                    placeholder="Select close option"
                  />
                </div>
                {closesOption === "Date" && (
                  <div className={styles.dateTimeRow}>
                    <input
                      type="date"
                      value={closesDate}
                      onChange={(e) => setClosesDate(e.target.value)}
                      className={styles.dateInput}
                    />
                    <input
                      type="number"
                      placeholder="Hour"
                      value={closesTime}
                      onChange={(e) => setClosesTime(e.target.value)}
                      className={styles.timeInput}
                      min="1"
                      max="12"
                    />
                    <select
                      value={closesTimePeriod}
                      onChange={(e) => setClosesTimePeriod(e.target.value)}
                      className={styles.dropdownNative}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                )}
                {closesOption === "Other" && (
                  <div className={styles.dropdownRow}>
                    <input
                      type="text"
                      placeholder="Enter custom close time"
                      value={closesOther}
                      onChange={(e) => setClosesOther(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}
              </div>
              <div className={styles.timelineGroup}>
                <label className={styles.label}>Pays Out</label>
                <div className={styles.dropdownRow}>
                  <CustomDropdown
                    identifier="paysOut"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    options={[
                      { value: "2 hours after close", label: "2 hours after close" },
                      { value: "Date", label: "Date", disabled: closesOption === "When the outcome occurs" },
                      { value: "Other", label: "Other" },
                    ]}
                    value={paysOutOption}
                    onChange={setPaysOutOption}
                    placeholder="Select payout option"
                  />
                </div>
                {paysOutOption === "Date" && (
                  <div className={styles.dateTimeRow}>
                    <input
                      type="date"
                      value={paysOutDate}
                      onChange={(e) => setPaysOutDate(e.target.value)}
                      className={styles.dateInput}
                    />
                    <input
                      type="number"
                      placeholder="Hour"
                      value={paysOutTime}
                      onChange={(e) => setPaysOutTime(e.target.value)}
                      className={styles.timeInput}
                      min="1"
                      max="12"
                    />
                    <select
                      value={paysOutTimePeriod}
                      onChange={(e) => setPaysOutTimePeriod(e.target.value)}
                      className={styles.dropdownNative}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                )}
                {paysOutOption === "Other" && (
                  <div className={styles.dropdownRow}>
                    <input
                      type="text"
                      placeholder="Enter custom payout time"
                      value={paysOutOther}
                      onChange={(e) => setPaysOutOther(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}
                {timelineError && (
                  <div className={styles.timelineError}>{timelineError}</div>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className={styles.categoriesSection}>
              <h2 className={styles.sectionTitle}>Categories</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Primary Category</label>
                <CustomDropdown
                  identifier="primaryCategory"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  options={primaryCategoryOptions}
                  value={primaryCategory}
                  onChange={setPrimaryCategory}
                  placeholder="Select a primary category"
                  variant="large"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Secondary Category</label>
                <CustomDropdown
                  identifier="secondaryCategory"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  options={secondaryCategoryOptions}
                  value={secondaryCategory}
                  onChange={setSecondaryCategory}
                  placeholder="Select a secondary category"
                  variant="large"
                />
              </div>
            </div>

            {/* Button Group with two side-by-side buttons */}
            <div className={styles.buttonGroup}>
              <button type="button" onClick={handleDownloadJSON} className={styles.secondaryButton}>
                Download JSON
              </button>
              <button type="button" onClick={handleAPISubmit} className={styles.submitButton}>
                Send to API
              </button>
            </div>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreateMarket;
