"use client";
import React, { useState } from 'react';
import styles from './CreateMarket.module.css';

const metadataFields = [
  "Name",
  "Image",
  "Volume",
  "Options",
];

// List of common variable types plus map and nestedMap
const variableTypes = ["string", "number", "boolean", "object", "array", "map", "nestedMap"];

// Replace with your actual API Gateway endpoint URL.
const API_ENDPOINT = "https://of4p5kgo9l.execute-api.us-east-1.amazonaws.com/dev/create-market";

const CreateMarket = () => {
  const [marketNumber, setMarketNumber] = useState('');
  const [metadata, setMetadata] = useState(() => {
    const init = {};
    metadataFields.forEach(field => {
      init[field] = { type: "string", value: "" };
    });
    return init;
  });
  const [message, setMessage] = useState('');

  // When switching variable type, clear the old value and initialize new empty structure.
  const handleTypeChange = (field, newType) => {
    console.log(`Changing type for ${field} to ${newType}`);
    setMetadata(prev => {
      const newField = { ...prev[field], type: newType };
      if (newType === "map") {
        newField.value = [{ key: '', value: '' }];
      } else if (newType === "nestedMap") {
        // For nestedMap, initialize with five fields.
        newField.value = [{
          primaryKey: '',
          innerKey1: '',
          innerValue1: '',
          innerKey2: '',
          innerValue2: ''
        }];
      } else {
        newField.value = "";
      }
      console.log(`New field structure for ${field}:`, newField);
      return { ...prev, [field]: newField };
    });
  };

  // For non-map types.
  const handleInputChange = (field, value) => {
    console.log(`Input change for ${field}: ${value}`);
    setMetadata(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  // For "map" type fields.
  const handleMapChange = (field, index, keyOrValue, newValue) => {
    console.log(`Map change for ${field} at index ${index}, ${keyOrValue}: ${newValue}`);
    setMetadata(prev => {
      const updatedPairs = [...prev[field].value];
      updatedPairs[index] = { ...updatedPairs[index], [keyOrValue]: newValue };
      return { ...prev, [field]: { ...prev[field], value: updatedPairs } };
    });
  };

  const addMapPair = (field) => {
    console.log(`Adding map pair for ${field}`);
    setMetadata(prev => {
      const updatedPairs = [...prev[field].value, { key: '', value: '' }];
      return { ...prev, [field]: { ...prev[field], value: updatedPairs } };
    });
  };

  const removeMapPair = (field, index) => {
    console.log(`Removing map pair for ${field} at index ${index}`);
    setMetadata(prev => {
      const updatedPairs = [...prev[field].value];
      if (updatedPairs.length > 1) {
        updatedPairs.splice(index, 1);
      }
      return { ...prev, [field]: { ...prev[field], value: updatedPairs } };
    });
  };

  // For "nestedMap" type fields.
  const handleNestedMapChange = (field, outerIndex, property, newValue) => {
    console.log(`Nested map change for ${field} at index ${outerIndex}, ${property}: ${newValue}`);
    setMetadata(prev => {
      const updatedNested = [...prev[field].value];
      updatedNested[outerIndex] = { ...updatedNested[outerIndex], [property]: newValue };
      return { ...prev, [field]: { ...prev[field], value: updatedNested } };
    });
  };

  // Add a new nested map entry.
  const addNestedMap = (field) => {
    console.log(`Adding nested map entry for ${field}`);
    setMetadata(prev => {
      const updatedNested = [
        ...prev[field].value, 
        { primaryKey: '', innerKey1: '', innerValue1: '', innerKey2: '', innerValue2: '' }
      ];
      return { ...prev, [field]: { ...prev[field], value: updatedNested } };
    });
  };

  // Remove a nested map entry (if more than one exists).
  const removeNestedMap = (field, outerIndex) => {
    console.log(`Removing nested map entry for ${field} at index ${outerIndex}`);
    setMetadata(prev => {
      const updatedNested = [...prev[field].value];
      if (updatedNested.length > 1) {
        updatedNested.splice(outerIndex, 1);
      }
      return { ...prev, [field]: { ...prev[field], value: updatedNested } };
    });
  };

  // Prepare the metadata to match the payload expected by your Lambda function.
  const preparePayload = () => {
    const preparedMetadata = {};
    Object.keys(metadata).forEach(field => {
      if (metadata[field].type === "nestedMap") {
        preparedMetadata[field] = metadata[field].value.map(entry => ({
          [entry.primaryKey]: {
            [entry.innerKey1]: entry.innerValue1,
            [entry.innerKey2]: entry.innerValue2
          }
        }));
      } else if (metadata[field].type === "map") {
        const mapObj = {};
        metadata[field].value.forEach(pair => {
          if (pair.key) { // Only include pairs with a non-empty key.
            mapObj[pair.key] = pair.value;
          }
        });
        preparedMetadata[field] = mapObj;
      } else {
        preparedMetadata[field] = metadata[field].value;
      }
    });
    console.log("Prepared metadata:", preparedMetadata);
    return {
      MARKET: marketNumber,
      ATTRIBUTE: "METADATA",
      attributes: preparedMetadata,
    };
  };

  // Function to download the payload JSON as a file.
  const downloadJSON = () => {
    const payload = preparePayload();
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    console.log("Downloading JSON payload:", json);
    const link = document.createElement('a');
    link.href = url;
    link.download = "marketPayload.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Send the payload to your API Gateway endpoint.
  const sendToAPI = async () => {
    const payload = preparePayload();
    console.log("Sending payload to API:", payload);
    console.log("API Endpoint:", API_ENDPOINT);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Send the payload directly (without extra wrapping).
        body: JSON.stringify(payload)
      });
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);
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

  // Modified handleSubmit to send payload via API Gateway and download the JSON payload.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    sendToAPI();
    downloadJSON();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Market</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="marketNumber" className={styles.label}>Market Number</label>
            <input
              type="text"
              id="marketNumber"
              placeholder="MARKET#001"
              value={marketNumber}
              onChange={(e) => {
                console.log("Market number changed:", e.target.value);
                setMarketNumber(e.target.value);
              }}
              className={styles.input}
              required
            />
          </div>
          <h2 className={styles.sectionTitle}>Market Details</h2>
          {metadataFields.map(field => (
            <div key={field} className={styles.formGroup}>
              <label htmlFor={field} className={styles.label}>{field}</label>
              <div className={styles.inputRow}>
                {/* "map" type */}
                {metadata[field].type === "map" && (
                  <div className={styles.mapContainer}>
                    {metadata[field].value.map((pair, index) => (
                      <div key={index} className={styles.mapPair}>
                        <input
                          type="text"
                          placeholder="Key"
                          value={pair.key}
                          onChange={(e) => handleMapChange(field, index, 'key', e.target.value)}
                          className={styles.input}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={pair.value}
                          onChange={(e) => handleMapChange(field, index, 'value', e.target.value)}
                          className={styles.input}
                          required
                        />
                        {metadata[field].value.length > 1 && (
                          <button 
                            type="button" 
                            className={styles.deletePairButton}
                            onClick={() => removeMapPair(field, index)}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    <a
                      href="#"
                      className={styles.addPairLink}
                      onClick={(e) => { e.preventDefault(); addMapPair(field); }}
                    >
                      + Add another key-value pair
                    </a>
                  </div>
                )}

                {/* "nestedMap" type */}
                {metadata[field].type === "nestedMap" && (
                  <div className={styles.nestedMapContainer}>
                    {metadata[field].value.map((entry, outerIndex) => (
                      <div key={outerIndex} className={styles.nestedMapGroup}>
                        {/* Row 1: Primary Key */}
                        <div className={styles.nestedMapMasterRow}>
                          <input
                            type="text"
                            placeholder="Primary Key"
                            value={entry.primaryKey}
                            onChange={(e) => handleNestedMapChange(field, outerIndex, 'primaryKey', e.target.value)}
                            className={styles.input}
                            required
                          />
                          {metadata[field].value.length > 1 && (
                            <button 
                              type="button" 
                              className={styles.deletePairButton}
                              onClick={() => removeNestedMap(field, outerIndex)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                        {/* Row 2: First inner key/value pair */}
                        <div className={styles.nestedMapFirstRow}>
                          <input
                            type="text"
                            placeholder="Inner Key 1"
                            value={entry.innerKey1}
                            onChange={(e) => handleNestedMapChange(field, outerIndex, 'innerKey1', e.target.value)}
                            className={`${styles.input} ${styles.innerInput}`}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Inner Value 1"
                            value={entry.innerValue1}
                            onChange={(e) => handleNestedMapChange(field, outerIndex, 'innerValue1', e.target.value)}
                            className={`${styles.input} ${styles.innerInput}`}
                            required
                          />
                        </div>
                        {/* Row 3: Second inner key/value pair */}
                        <div className={styles.nestedMapSecondRow}>
                          <input
                            type="text"
                            placeholder="Inner Key 2"
                            value={entry.innerKey2}
                            onChange={(e) => handleNestedMapChange(field, outerIndex, 'innerKey2', e.target.value)}
                            className={`${styles.input} ${styles.innerInput}`}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Inner Value 2"
                            value={entry.innerValue2}
                            onChange={(e) => handleNestedMapChange(field, outerIndex, 'innerValue2', e.target.value)}
                            className={`${styles.input} ${styles.innerInput}`}
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <a
                      href="#"
                      className={styles.addPairLink}
                      onClick={(e) => { e.preventDefault(); addNestedMap(field); }}
                    >
                      + Add another nested map
                    </a>
                  </div>
                )}

                {/* Other types */}
                {metadata[field].type !== "map" && metadata[field].type !== "nestedMap" && (
                  <input
                    type="text"
                    id={field}
                    placeholder={field}
                    value={metadata[field].value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={styles.input}
                    required
                  />
                )}

                {/* Dropdown for variable type */}
                <select
                  value={metadata[field].type}
                  onChange={(e) => handleTypeChange(field, e.target.value)}
                  className={styles.select}
                >
                  {variableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Create Market & Send to API
            </button>
          </div>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default CreateMarket;
