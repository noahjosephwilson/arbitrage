"use client";

import React, { useState, useRef } from "react";
import styles from "./CreateSimpleMarket.module.css";

const API_GATEWAY_URL = "https://of4p5kgo9l.execute-api.us-east-1.amazonaws.com/dev/create-market";

const CreateSimpleMarket = () => {
  // State variables for user inputs.
  const [name, setName] = useState("");
  const [marketType, setMarketType] = useState("Yes/No");
  const [metadata, setMetadata] = useState({
    Options: {
      value: [
        { option: "", nestedToggle: "Yes/No", choice1: "Yes", choice2: "No" }
      ],
    },
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const imageInputRef = useRef(null);

  // Market type selection handler.
  const handleMarketTypeSelect = (type) => {
    setMarketType(type);
    if (type === "Custom Options") {
      setMetadata({
        Options: {
          value: [
            { option: "", nestedToggle: "Yes/No", choice1: "", choice2: "" }
          ],
        },
      });
    }
  };

  // Handler to update a custom option.
  const handleNestedEntryChange = (index, field, newValue) => {
    setMetadata((prev) => {
      const updatedOptions = [...prev.Options.value];
      if (field === "nestedToggle") {
        updatedOptions[index] = {
          ...updatedOptions[index],
          nestedToggle: newValue,
          choice1: newValue === "Yes/No" ? "Yes" : "",
          choice2: newValue === "Yes/No" ? "No" : "",
        };
      } else {
        updatedOptions[index] = { ...updatedOptions[index], [field]: newValue };
      }
      return { Options: { value: updatedOptions } };
    });
  };

  // Add an additional custom option.
  const addNestedOption = () => {
    setMetadata((prev) => {
      const updatedOptions = [
        ...prev.Options.value,
        { option: "", nestedToggle: "Yes/No", choice1: "Yes", choice2: "No" },
      ];
      return { Options: { value: updatedOptions } };
    });
  };

  // Remove a custom option.
  const removeNestedOption = (index) => {
    setMetadata((prev) => {
      const updatedOptions = [...prev.Options.value];
      if (updatedOptions.length > 1) {
        updatedOptions.splice(index, 1);
      }
      return { Options: { value: updatedOptions } };
    });
  };

  // Process the image by cropping it to a square.
  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const minSize = Math.min(img.width, img.height);
        canvas.width = minSize;
        canvas.height = minSize;
        const ctx = canvas.getContext("2d");
        const sx = (img.width - minSize) / 2;
        const sy = (img.height - minSize) / 2;
        ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, minSize, minSize);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, file.type);
      };
      img.onerror = (error) => reject(error);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle image file selection.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file)
        .then((blob) => {
          setUploadedImage(blob);
          const previewURL = URL.createObjectURL(blob);
          setImagePreview(previewURL);
        })
        .catch((error) => {
          setErrorMessage("Error processing image: " + error.message);
          setUploadedImage(null);
          setImagePreview(null);
        });
    } else {
      setUploadedImage(null);
      setImagePreview(null);
    }
  };

  // Delete image from state.
  const deleteImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmissionSuccess(false); // Reset success state for re-submission

    // Build the Options array.
    let optionsArray = [];
    if (marketType === "Yes/No") {
      optionsArray.push({
        OptionName: "Yes/No",
        ChoiceName1: "Yes",
        ChoiceName2: "No",
        Choice1Value: 0,
        Choice2Value: 0,
      });
    } else if (marketType === "Custom Options") {
      optionsArray = metadata.Options.value.map((entry) => ({
        OptionName: entry.option,
        ChoiceName1: entry.nestedToggle === "Yes/No" ? "Yes" : entry.choice1,
        ChoiceName2: entry.nestedToggle === "Yes/No" ? "No" : entry.choice2,
        Choice1Value: 0,
        Choice2Value: 0,
      }));
    } else {
      setErrorMessage("Invalid market type selected.");
      return;
    }

    // Construct the payload.
    const payload = {
      DATA: "METADATA",
      attributes: {
        MarketName: name,
        Volume: 0,
        Options: optionsArray,
      },
    };

    // Optionally add an image attribute if an image is present
    // Note: This implementation sends the local object URL since the image is not uploaded elsewhere.
    // If you need to send actual image data, consider encoding the image data in a suitable format.
    if (uploadedImage) {
      payload.attributes.ImageData = imagePreview;
    }

    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("API Gateway error: " + errorText);
      }

      // If needed, handle the response from the Lambda
      const responseData = await response.json();
      console.log("Response from API Gateway:", responseData);

      setSubmissionSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Simple Market</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Market Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Market Name</label>
          <input
            type="text"
            placeholder="Enter market name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {/* Market Type Selection */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Market Type</label>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                marketType === "Yes/No" ? styles.active : ""
              }`}
              onClick={() => handleMarketTypeSelect("Yes/No")}
            >
              Yes/No
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                marketType === "Custom Options" ? styles.active : ""
              }`}
              onClick={() => handleMarketTypeSelect("Custom Options")}
            >
              Custom Options
            </button>
          </div>
        </div>
        {/* Custom Options Section */}
        {marketType === "Custom Options" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Custom Options</label>
            {metadata.Options.value.map((entry, index) => (
              <div key={index} className={styles.nestedMapGroup}>
                <div className={styles.nestedMapMasterRow}>
                  <input
                    type="text"
                    placeholder="Option"
                    value={entry.option}
                    onChange={(e) =>
                      handleNestedEntryChange(index, "option", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                  {metadata.Options.value.length > 1 && (
                    <button
                      type="button"
                      className={styles.deletePairButton}
                      onClick={() => removeNestedOption(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
                <div className={styles.nestedToggleGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${
                      entry.nestedToggle === "Yes/No" ? styles.active : ""
                    }`}
                    onClick={() =>
                      handleNestedEntryChange(index, "nestedToggle", "Yes/No")
                    }
                  >
                    Yes/No
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${
                      entry.nestedToggle === "Custom Choices" ? styles.active : ""
                    }`}
                    onClick={() =>
                      handleNestedEntryChange(index, "nestedToggle", "Custom Choices")
                    }
                  >
                    Custom Choices
                  </button>
                </div>
                {entry.nestedToggle === "Custom Choices" && (
                  <div className={styles.nestedExtraInputs}>
                    <input
                      type="text"
                      placeholder="Choice1"
                      value={entry.choice1}
                      onChange={(e) =>
                        handleNestedEntryChange(index, "choice1", e.target.value)
                      }
                      className={styles.input}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Choice2"
                      value={entry.choice2}
                      onChange={(e) =>
                        handleNestedEntryChange(index, "choice2", e.target.value)
                      }
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
                addNestedOption();
              }}
            >
              + Add another option
            </a>
          </div>
        )}
        {/* Image Upload Section */}
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
          {imagePreview && (
            <div className={styles.imageContainer}>
              <div className={styles.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
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
        {/* Error Message Display */}
        {errorMessage && (
          <div className={styles.errorMessage} style={{ color: "red", marginTop: "1em" }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        {/* Success Message Display */}
        {submissionSuccess && (
          <div className={styles.successMessage} style={{ color: "green", marginTop: "1em" }}>
            Market created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateSimpleMarket;
