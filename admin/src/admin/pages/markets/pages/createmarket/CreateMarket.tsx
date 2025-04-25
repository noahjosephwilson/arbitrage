"use client";
import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from "react";
import styles from "./CreateMarket.module.css";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  identifier: string;
  openDropdown: string | null;
  setOpenDropdown: (value: string | null) => void;
  options: (string | DropdownOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  variant?: "default" | "large";
}

// CustomDropdown component accepts an identifier, shared openDropdown state,
// and an optional "variant" prop for alternative styling (e.g. "large").
const CustomDropdown: React.FC<CustomDropdownProps> = ({
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
  const toggleOpen = (e: MouseEvent) => {
    // Prevent click from triggering the global listener.
    e.stopPropagation();
    if (isOpen) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(identifier);
    }
  };

  const handleOptionClick = (option: string | DropdownOption, e: MouseEvent) => {
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
const convertToDate = (dateStr: string, timeStr: string, period: "AM" | "PM"): Date | null => {
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

interface Metadata {
  Name: { value: string };
  Event: { value: string };
  Options: { type: string; value: string };
}

interface Outcome {
  text: string;
  link: string;
}

interface CategoryMapping {
  [key: string]: DropdownOption[];
}

interface MarketAttributes {
  MarketName: string;
  Event: string;
  Options: string;
  PrimaryCategory: string;
  SecondaryCategory: string;
  RulesSummary: {
    optionInput: string;
    subOptionInput: string;
    outcomes: Outcome[];
    rulesClarification: string;
  };
  Timeline: {
    closesOption: string;
    closesDate: string;
    closesTime: string;
    closesTimePeriod: "AM" | "PM";
    closesOther: string;
    paysOutOption: string;
    paysOutDate: string;
    paysOutTime: string;
    paysOutTimePeriod: "AM" | "PM";
    paysOutOther: string;
  };
  imageBase64?: string;
  imageName?: string;
  imageType?: string;
  fullRulesBase64?: string;
  fullRulesName?: string;
  fullRulesType?: string;
}

interface Payload {
  DATA: string;
  attributes: MarketAttributes;
}

const CreateMarket: React.FC = () => {
  // Metadata for Market Details and Options.
  const [metadata, setMetadata] = useState<Metadata>({
    Name: { value: "" },
    Event: { value: "" },
    Options: { type: "string", value: "Yes/No" },
  });
  const [message, setMessage] = useState<string>("");

  // Options toggle state; default is "Yes/No."
  const [optionsType, setOptionsType] = useState<string>("Yes/No");

  // File upload states.
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [fullRules, setFullRules] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const fullRulesInputRef = useRef<HTMLInputElement>(null);

  // Rules Summary states.
  const [optionInput, setOptionInput] = useState<string>("");
  const [subOptionInput, setSubOptionInput] = useState<string>("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([{ text: "", link: "" }]);
  const [rulesClarification, setRulesClarification] = useState<string>("");

  // Timeline states.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closesOption, setClosesOption] = useState<string>("When the outcome occurs");
  const [closesDate, setClosesDate] = useState<string>("");
  const [closesTime, setClosesTime] = useState<string>("");
  const [closesTimePeriod, setClosesTimePeriod] = useState<"AM" | "PM">("AM");
  const [closesOther, setClosesOther] = useState<string>("");
  const [paysOutOption, setPaysOutOption] = useState<string>("2 hours after close");
  const [paysOutDate, setPaysOutDate] = useState<string>("");
  const [paysOutTime, setPaysOutTime] = useState<string>("");
  const [paysOutTimePeriod, setPaysOutTimePeriod] = useState<"AM" | "PM">("AM");
  const [paysOutOther, setPaysOutOther] = useState<string>("");

  // New state for category mapping fetched from a database.
  const [categoryMapping, setCategoryMapping] = useState<CategoryMapping>({});

  // States for selected categories.
  const [primaryCategory, setPrimaryCategory] = useState<string>("");
  const [secondaryCategory, setSecondaryCategory] = useState<string>("");

  // Simulated fetch from database for the category mapping.
  useEffect(() => {
    // In production, replace this with an API/database call.
    const fetchCategoryMapping = async () => {
      const fetchedMapping: CategoryMapping = {
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
  const [timelineError, setTimelineError] = useState<string>("");

  // Close dropdowns when clicking anywhere else on the page.
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as Element;
      if (
        !target.closest(`.${styles.customDropdown}`) &&
        !target.closest(`.${styles.largeDropdown}`)
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
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadedImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleFullRulesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFullRules(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPdfPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPdfPreview(null);
    }
  };

  const deleteUploadedImage = (): void => {
    setUploadedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const deleteFullRules = (): void => {
    setFullRules(null);
    setPdfPreview(null);
    if (fullRulesInputRef.current) {
      fullRulesInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: keyof Metadata, value: string): void => {
    setMetadata((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const handleOptionsToggle = (choice: string): void => {
    setOptionsType(choice);
    setMetadata((prev) => ({
      ...prev,
      Options: { ...prev.Options, value: choice },
    }));
  };

  const handleNestedEntryChange = (
    outerIndex: number,
    field: string,
    newValue: string
  ): void => {
    setOutcomes((prev) => {
      const updated = [...prev];
      updated[outerIndex] = { ...updated[outerIndex], [field]: newValue };
      return updated;
    });
  };

  const addNestedMap = (): void => {
    setOutcomes((prev) => [...prev, { text: "", link: "" }]);
  };

  const removeNestedMap = (outerIndex: number): void => {
    setOutcomes((prev) => prev.filter((_, index) => index !== outerIndex));
  };

  const handleOutcomeChange = (
    index: number,
    field: keyof Outcome,
    value: string
  ): void => {
    setOutcomes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOutcome = (): void => {
    setOutcomes((prev) => [...prev, { text: "", link: "" }]);
  };

  const removeOutcome = (index: number): void => {
    setOutcomes((prev) => prev.filter((_, i) => i !== index));
  };

  const validateTimeline = (): boolean => {
    if (closesOption === "Date") {
      if (!closesDate || !closesTime) {
        setTimelineError("Please select both date and time for market close");
        return false;
      }
      const closeDate = convertToDate(closesDate, closesTime, closesTimePeriod);
      if (!closeDate) {
        setTimelineError("Invalid close date/time");
        return false;
      }
    }

    if (paysOutOption === "Date") {
      if (!paysOutDate || !paysOutTime) {
        setTimelineError("Please select both date and time for payout");
        return false;
      }
      const payoutDate = convertToDate(
        paysOutDate,
        paysOutTime,
        paysOutTimePeriod
      );
      if (!payoutDate) {
        setTimelineError("Invalid payout date/time");
        return false;
      }
    }

    setTimelineError("");
    return true;
  };

  const preparePayload = (): Payload => {
    const payload: Payload = {
      DATA: "METADATA",
      attributes: {
        MarketName: metadata.Name.value,
        Event: metadata.Event.value,
        Options: metadata.Options.value,
        PrimaryCategory: primaryCategory,
        SecondaryCategory: secondaryCategory,
        RulesSummary: {
          optionInput,
          subOptionInput,
          outcomes,
          rulesClarification,
        },
        Timeline: {
          closesOption,
          closesDate,
          closesTime,
          closesTimePeriod,
          closesOther,
          paysOutOption,
          paysOutDate,
          paysOutTime,
          paysOutTimePeriod,
          paysOutOther,
        },
      },
    };

    if (uploadedImage && imageInputRef.current?.files?.[0]) {
      payload.attributes.imageBase64 = imagePreview || undefined;
      payload.attributes.imageName = imageInputRef.current.files[0].name;
      payload.attributes.imageType = imageInputRef.current.files[0].type;
    }

    if (fullRules && fullRulesInputRef.current?.files?.[0]) {
      payload.attributes.fullRulesBase64 = pdfPreview || undefined;
      payload.attributes.fullRulesName = fullRulesInputRef.current.files[0].name;
      payload.attributes.fullRulesType = fullRulesInputRef.current.files[0].type;
    }

    return payload;
  };

  const downloadJSON = (): void => {
    const payload = preparePayload();
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "market-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendToAPI = async (): Promise<void> => {
    try {
      const payload = preparePayload();
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      setMessage("Market created successfully!");
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleAPISubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateTimeline()) {
      sendToAPI();
    }
  };

  const handleDownloadJSON = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateTimeline()) {
      downloadJSON();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Market</h1>
      <form onSubmit={handleAPISubmit} className={styles.form}>
        {/* Market Details */}
        <div className={styles.section}>
          <h2>Market Details</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Market Name</label>
            <input
              type="text"
              value={metadata.Name.value}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Event</label>
            <input
              type="text"
              value={metadata.Event.value}
              onChange={(e) => handleInputChange("Event", e.target.value)}
              className={styles.input}
              required
            />
          </div>
        </div>

        {/* Categories */}
        <div className={styles.section}>
          <h2>Categories</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Primary Category</label>
            <CustomDropdown
              identifier="primary-category"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={primaryCategoryOptions}
              value={primaryCategory}
              onChange={setPrimaryCategory}
              placeholder="Select Primary Category"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Secondary Category</label>
            <CustomDropdown
              identifier="secondary-category"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={secondaryCategoryOptions}
              value={secondaryCategory}
              onChange={setSecondaryCategory}
              placeholder="Select Secondary Category"
              variant={!primaryCategory ? "default" : "large"}
            />
          </div>
        </div>

        {/* Options */}
        <div className={styles.section}>
          <h2>Options</h2>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              onClick={() => handleOptionsToggle("Yes/No")}
              className={`${styles.toggleButton} ${
                optionsType === "Yes/No" ? styles.active : ""
              }`}
            >
              Yes/No
            </button>
            <button
              type="button"
              onClick={() => handleOptionsToggle("Custom")}
              className={`${styles.toggleButton} ${
                optionsType === "Custom" ? styles.active : ""
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Rules Summary */}
        <div className={styles.section}>
          <h2>Rules Summary</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Option</label>
            <input
              type="text"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Sub-option</label>
            <input
              type="text"
              value={subOptionInput}
              onChange={(e) => setSubOptionInput(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Outcomes</label>
            {outcomes.map((outcome, index) => (
              <div key={index} className={styles.outcomeGroup}>
                <input
                  type="text"
                  value={outcome.text}
                  onChange={(e) =>
                    handleOutcomeChange(index, "text", e.target.value)
                  }
                  placeholder="Outcome text"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={outcome.link}
                  onChange={(e) =>
                    handleOutcomeChange(index, "link", e.target.value)
                  }
                  placeholder="Outcome link"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOutcome}
              className={styles.addButton}
            >
              Add Outcome
            </button>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Rules Clarification</label>
            <textarea
              value={rulesClarification}
              onChange={(e) => setRulesClarification(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.section}>
          <h2>Timeline</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Closes</label>
            <CustomDropdown
              identifier="closes-option"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={[
                "When the outcome occurs",
                "Date",
                "Other",
              ]}
              value={closesOption}
              onChange={setClosesOption}
              placeholder="Select close option"
            />
          </div>
          {closesOption === "Date" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Close Date</label>
                <input
                  type="date"
                  value={closesDate}
                  onChange={(e) => setClosesDate(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Close Time</label>
                <div className={styles.timeInputGroup}>
                  <input
                    type="text"
                    value={closesTime}
                    onChange={(e) => setClosesTime(e.target.value)}
                    placeholder="HH"
                    className={styles.timeInput}
                  />
                  <select
                    value={closesTimePeriod}
                    onChange={(e) =>
                      setClosesTimePeriod(e.target.value as "AM" | "PM")
                    }
                    className={styles.timePeriodSelect}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {closesOption === "Other" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Other Close Condition</label>
              <input
                type="text"
                value={closesOther}
                onChange={(e) => setClosesOther(e.target.value)}
                className={styles.input}
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.label}>Pays Out</label>
            <CustomDropdown
              identifier="pays-out-option"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={[
                "2 hours after close",
                "Date",
                "Other",
              ]}
              value={paysOutOption}
              onChange={setPaysOutOption}
              placeholder="Select payout option"
            />
          </div>
          {paysOutOption === "Date" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Payout Date</label>
                <input
                  type="date"
                  value={paysOutDate}
                  onChange={(e) => setPaysOutDate(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Payout Time</label>
                <div className={styles.timeInputGroup}>
                  <input
                    type="text"
                    value={paysOutTime}
                    onChange={(e) => setPaysOutTime(e.target.value)}
                    placeholder="HH"
                    className={styles.timeInput}
                  />
                  <select
                    value={paysOutTimePeriod}
                    onChange={(e) =>
                      setPaysOutTimePeriod(e.target.value as "AM" | "PM")
                    }
                    className={styles.timePeriodSelect}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {paysOutOption === "Other" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Other Payout Condition</label>
              <input
                type="text"
                value={paysOutOther}
                onChange={(e) => setPaysOutOther(e.target.value)}
                className={styles.input}
              />
            </div>
          )}
          {timelineError && (
            <div className={styles.errorMessage}>{timelineError}</div>
          )}
        </div>

        {/* File Uploads */}
        <div className={styles.section}>
          <h2>File Uploads</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Market Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={imageInputRef}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.previewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.preview} />
                <button
                  type="button"
                  onClick={deleteUploadedImage}
                  className={styles.deleteButton}
                >
                  Delete Image
                </button>
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Rules (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFullRulesUpload}
              ref={fullRulesInputRef}
              className={styles.fileInput}
            />
            {pdfPreview && (
              <div className={styles.previewContainer}>
                <embed
                  src={pdfPreview}
                  type="application/pdf"
                  className={styles.pdfPreview}
                />
                <button
                  type="button"
                  onClick={deleteFullRules}
                  className={styles.deleteButton}
                >
                  Delete PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Create Market
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className={styles.downloadButton}
          >
            Download JSON
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`${styles.message} ${
              message.includes("Error") ? styles.error : styles.success
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateMarket; 