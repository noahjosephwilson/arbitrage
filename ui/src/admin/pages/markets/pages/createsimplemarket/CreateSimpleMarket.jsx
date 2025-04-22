"use client";

import React, { useState, useRef } from "react";
import styles from "./CreateSimpleMarket.module.css";

// Single market-creation endpoint (uploads image + metadata)
const API_GATEWAY_URL = "https://of4p5kgo9l.execute-api.us-east-1.amazonaws.com/dev/create-market";

export default function CreateSimpleMarket() {
  const [name, setName] = useState("");
  const [marketType, setMarketType] = useState("Yes/No");
  const [metadata, setMetadata] = useState({
    Options: { value: [{ option: "", nestedToggle: "Yes/No", choice1: "Yes", choice2: "No" }] },
  });
  const [uploadedImageBlob, setUploadedImageBlob] = useState(null);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const imageInputRef = useRef(null);

  // Handle market type toggles
  const handleMarketTypeSelect = (type) => {
    setMarketType(type);
    if (type === "Custom Options") {
      setMetadata({ Options: { value: [{ option: "", nestedToggle: "Yes/No", choice1: "", choice2: "" }] } });
    }
  };

  // Handle nested/custom options
  const handleNestedEntryChange = (idx, field, val) => {
    setMetadata((prev) => {
      const opts = [...prev.Options.value];
      if (field === "nestedToggle") {
        opts[idx] = {
          ...opts[idx],
          nestedToggle: val,
          choice1: val === "Yes/No" ? "Yes" : "",
          choice2: val === "Yes/No" ? "No" : "",
        };
      } else {
        opts[idx] = { ...opts[idx], [field]: val };
      }
      return { Options: { value: opts } };
    });
  };
  const addNestedOption = () =>
    setMetadata((prev) => ({
      Options: {
        value: [
          ...prev.Options.value,
          { option: "", nestedToggle: "Yes/No", choice1: "Yes", choice2: "No" },
        ],
      },
    }));
  const removeNestedOption = (idx) =>
    setMetadata((prev) => {
      const opts = [...prev.Options.value];
      if (opts.length > 1) opts.splice(idx, 1);
      return { Options: { value: opts } };
    });

  // Crop image to square via canvas, return DataURL
  const processImageToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas toBlob failed"));
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = reject;
            fr.readAsDataURL(blob);
          },
          file.type
        );
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Handle file input change
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await processImageToDataUrl(file);
      setUploadedImageDataUrl(dataUrl);
      setUploadedImageBlob(file);
    } catch (err) {
      setErrorMessage("Image processing error: " + err.message);
      setUploadedImageDataUrl(null);
      setUploadedImageBlob(null);
    }
  };

  const deleteImage = () => {
    setUploadedImageDataUrl(null);
    setUploadedImageBlob(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Submission handler: send metadata + imageBase64
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmissionSuccess(false);

    // Build options array
    let optionsArray = [];
    if (marketType === "Yes/No") {
      optionsArray = [
        { OptionName: "Yes/No", ChoiceName1: "Yes", ChoiceName2: "No", Choice1Value: 0, Choice2Value: 0 },
      ];
    } else {
      optionsArray = metadata.Options.value.map((ent) => ({
        OptionName: ent.option,
        ChoiceName1: ent.nestedToggle === "Yes/No" ? "Yes" : ent.choice1,
        ChoiceName2: ent.nestedToggle === "Yes/No" ? "No" : ent.choice2,
        Choice1Value: 0,
        Choice2Value: 0,
      }));
    }

    const payload = {
      DATA: "METADATA",
      attributes: {
        MarketName: name,
        Volume: 0,
        Options: optionsArray,
        ...(uploadedImageDataUrl && {
          imageBase64: uploadedImageDataUrl,
          imageName: imageInputRef.current.files[0].name,
          imageType: imageInputRef.current.files[0].type,
        }),
      },
    };

    try {
      const res = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubmissionSuccess(true);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Simple Market</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Market Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Market Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {/* Market Type */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Market Type</label>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              onClick={() => handleMarketTypeSelect("Yes/No")}
              className={`${styles.toggleButton} ${
                marketType === "Yes/No" ? styles.active : ""
              }`}
            >
              Yes/No
            </button>
            <button
              type="button"
              onClick={() => handleMarketTypeSelect("Custom Options")}
              className={`${styles.toggleButton} ${
                marketType === "Custom Options" ? styles.active : ""
              }`}
            >
              Custom Options
            </button>
          </div>
        </div>
        {/* Custom Options */}
        {marketType === "Custom Options" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Custom Options</label>
            {metadata.Options.value.map((ent, idx) => (
              <div key={idx} className={styles.nestedMapGroup}>
                <input
                  type="text"
                  placeholder="Option"
                  value={ent.option}
                  onChange={(e) => handleNestedEntryChange(idx, "option", e.target.value)}
                  className={styles.input}
                  required
                />
                <div className={styles.nestedToggleGroup}>
                  <button
                    type="button"
                    onClick={() => handleNestedEntryChange(idx, "nestedToggle", "Yes/No")}
                    className={`${styles.incrementToggle} ${
                      ent.nestedToggle === "Yes/No" ? styles.active : ""
                    }`}
                  >
                    Yes/No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNestedEntryChange(idx, "nestedToggle", "Custom Choices")}
                    className={`${styles.incrementToggle} ${
                      ent.nestedToggle === "Custom Choices" ? styles.active : ""
                    }`}
                  >
                    Custom Choices
                  </button>
                </div>
                {ent.nestedToggle === "Custom Choices" && (
                  <>
                    <input
                      type="text"
                      placeholder="Choice1"
                      value={ent.choice1}
                      onChange={(e) => handleNestedEntryChange(idx, "choice1", e.target.value)}
                      className={styles.input}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Choice2"
                      value={ent.choice2}
                      onChange={(e) => handleNestedEntryChange(idx, "choice2", e.target.value)}
                      className={styles.input}
                      required
                    />
                  </>
                )}
                {metadata.Options.value.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNestedOption(idx)}
                    className={styles.deletePairButton}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addNestedOption} className={styles.addPairLink}>
              + Add another
            </button>
          </div>
        )}
        {/* Image Upload */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Image</label>
          <label htmlFor="imageUpload" className={styles.uploadButton}>
            Select Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={imageInputRef}
            className={styles.fileInput}
          />
          {uploadedImageDataUrl && (
            <div className={styles.imageContainer}>
              <div className={styles.imagePreviewContainer}>
                <img
                  src={uploadedImageDataUrl}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              </div>
              <button type="button" onClick={deleteImage} className={styles.deleteButton}>
                Delete Image
              </button>
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div className={styles.formGroup}>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
        {/* Error & Success Messages */}
        {errorMessage && (
          <div className={styles.errorMessage} style={{ color: "red", marginTop: "1em" }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        {submissionSuccess && (
          <div className={styles.successMessage} style={{ color: "green", marginTop: "1em" }}>
            Market created successfully!
          </div>
        )}
      </form>
    </div>
  );
}


