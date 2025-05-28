import { HTTP_STATUS, ENDPOINT, MIME_TYPE, HEADER } from "./constants.mjs";
import { loadData, saveData } from "./fileHandler.mjs";

export function handleSumRequest(request, response) {
  let body = "";
  const errorResponse = { error: "Invalid input" };

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
    loadData((loadErr, dataStore) => {
      if (loadErr) {
        console.error("Failed to load data in handleSumRequest:", loadErr);
        response.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        response.end(JSON.stringify({ error: "Failed to load data" }));
        return;
      }

      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch {
        dataStore.sumCallCount++;
        const historyEntry = {
          endpoint: ENDPOINT.SUM,
          input: {}, // Body parsing failed, so input is empty or indeterminate
          output: errorResponse,
          timestamp: new Date().toISOString(),
        };
        dataStore.apiHistory.push(historyEntry);
        saveData(dataStore, (saveErr) => {
          if (saveErr) console.error("Failed to save data after sum parse error:", saveErr);
        });
        response.statusCode = HTTP_STATUS.BAD_REQUEST;
        response.end(JSON.stringify(errorResponse));
        return;
      }

      const { num1, num2 } = parsedBody;
      const numberOne = parseFloat(num1);
      const numberTwo = parseFloat(num2);

      if (
        typeof numberOne !== "number" ||
        typeof numberTwo !== "number" ||
        isNaN(numberOne) ||
        isNaN(numberTwo)
      ) {
        dataStore.sumCallCount++;
        const historyEntry = {
          endpoint: ENDPOINT.SUM,
          input: parsedBody,
          output: errorResponse,
          timestamp: new Date().toISOString(),
        };
        dataStore.apiHistory.push(historyEntry);
        saveData(dataStore, (saveErr) => {
          if (saveErr)
            console.error(
              "Failed to save data after sum validation error:",
              saveErr
            );
        });
        response.statusCode = HTTP_STATUS.BAD_REQUEST;
        response.end(JSON.stringify(errorResponse));
        return;
      }

      const sum = numberOne + numberTwo;
      dataStore.sumCallCount++;
      const responseData = { sum };
      const historyEntry = {
        endpoint: ENDPOINT.SUM,
        input: parsedBody,
        output: responseData,
        timestamp: new Date().toISOString(),
      };
      dataStore.apiHistory.push(historyEntry);
      saveData(dataStore, (saveErr) => {
        if (saveErr)
          console.error("Failed to save data after sum success:", saveErr);
      });
      response.statusCode = HTTP_STATUS.OK;
      response.end(JSON.stringify(responseData));
    });
  });
}

export function handleCountRequest(request, response) {
  loadData((loadErr, dataStore) => {
    if (loadErr) {
      console.error("Failed to load data in handleCountRequest:", loadErr);
      response.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      response.end(JSON.stringify({ error: "Failed to load data" }));
      return;
    }

    const responseData = { totalCalls: dataStore.sumCallCount };
    const historyEntry = {
      endpoint: ENDPOINT.SUM_CALL_COUNT,
      input: {},
      output: responseData,
      timestamp: new Date().toISOString(),
    };
    dataStore.apiHistory.push(historyEntry);
    saveData(dataStore, (saveErr) => {
      if (saveErr)
        console.error("Failed to save data after count request:", saveErr);
    });
    response.statusCode = HTTP_STATUS.OK;
    response.end(JSON.stringify(responseData));
  });
}

export function handleTimeRequest(request, response) {
  loadData((loadErr, dataStore) => {
    if (loadErr) {
      console.error("Failed to load data in handleTimeRequest:", loadErr);
      response.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      response.end(JSON.stringify({ error: "Failed to load data" }));
      return;
    }

    const currentTime = new Date().toISOString();
    const responseData = { currentTime };
    const historyEntry = {
      endpoint: ENDPOINT.CURRENT_TIME,
      input: {},
      output: responseData,
      timestamp: new Date().toISOString(),
    };
    dataStore.apiHistory.push(historyEntry);
    saveData(dataStore, (saveErr) => {
      if (saveErr)
        console.error("Failed to save data after time request:", saveErr);
    });
    response.statusCode = HTTP_STATUS.OK;
    response.end(JSON.stringify(responseData));
  });
}

export function handleHistoryRequest(request, response) {
  loadData((loadErr, dataStore) => {
    if (loadErr) {
      console.error("Failed to load data in handleHistoryRequest:", loadErr);
      response.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      response.end(JSON.stringify({ error: "Failed to load data" }));
      return;
    }
    const responseData = { apiHistory: dataStore.apiHistory };
    response.statusCode = HTTP_STATUS.OK;
    response.end(JSON.stringify(responseData));
  });
}
