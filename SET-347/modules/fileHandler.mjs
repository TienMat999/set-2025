import fs from "fs";
import path from "path";
import { DATA_FILE_PATH } from "./constants.mjs";

const dataDirectory = path.dirname(DATA_FILE_PATH);

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

export function loadData(callback) {
  fs.readFile(DATA_FILE_PATH, "utf8", (error, fileContent) => {
    if (error) {
      if (error.code === "ENOENT") {
        console.log("Data file not found, initializing with default values.");
        const defaultData = { sumCallCount: 0, apiHistory: [] };
        saveData(defaultData, (saveError) => {
          if (saveError) {
            callback(saveError, null);
          } else {
            callback(null, defaultData);
          }
        });
        return;
      }
      console.error("Error reading data file:", error);
      callback(error, null);
      return;
    }
    try {
      if (fileContent.trim() === "") {
        console.log("Data file is empty, initializing with default values.");
        const defaultData = { sumCallCount: 0, apiHistory: [] };
        saveData(defaultData, (saveError) => {
          if (saveError) {
            callback(saveError, null);
          } else {
            callback(null, defaultData);
          }
        });
        return;
      }
      const data = JSON.parse(fileContent);
      callback(null, data);
    } catch (parseErr) {
      console.error("Error parsing data file:", parseErr);
      const defaultData = { sumCallCount: 0, apiHistory: [] };
      saveData(defaultData, (saveErr) => {
        if (saveErr) {
          callback(saveErr, null);
        } else {
          callback(null, defaultData);
        }
      });
    }
  });
}

export function saveData(data, callback) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(DATA_FILE_PATH, jsonData, "utf8", (error) => {
    if (error) {
      console.error("Error writing data file:", error);
      if (callback) callback(error);
      return;
    }
    if (callback) callback(null);
  });
}
