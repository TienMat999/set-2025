import { HTTP_STATUS, ENDPOINT, MIME_TYPE, HEADER } from "./constants.mjs";
import { saveData } from "./fileHandler.mjs";

export function handleSumRequest(request, response, serverState) {
  let body = "";
  const errorResponse = { error: "Invalid input" };

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      serverState.sumCallCount++;
      const historyEntry = {
        endpoint: ENDPOINT.SUM,
        input: {},
        output: errorResponse,
        timestamp: new Date().toISOString(),
      };
      serverState.apiHistory.push(historyEntry);
      saveData(
        {
          sumCallCount: serverState.sumCallCount,
          apiHistory: serverState.apiHistory,
        },
        (err) => {
          if (err) console.error("Failed to save data after sum error:", err);
        }
      );
      res.statusCode = HTTP_STATUS.BAD_REQUEST;
      res.end(JSON.stringify(errorResponse));
      return;
    }

    const { num1, num2 } = data;
    const numberOne = parseFloat(num1);
    const numberTwo = parseFloat(num2);

    if (
      typeof numberOne !== "number" ||
      typeof numberTwo !== "number" ||
      isNaN(numberOne) ||
      isNaN(numberTwo)
    ) {
      serverState.sumCallCount++;
      const historyEntry = {
        endpoint: ENDPOINT.SUM,
        input: data,
        output: errorResponse,
        timestamp: new Date().toISOString(),
      };
      serverState.apiHistory.push(historyEntry);
      saveData(
        {
          sumCallCount: serverState.sumCallCount,
          apiHistory: serverState.apiHistory,
        },
        (error) => {
          if (error)
            console.error(
              "Failed to save data after sum validation error:",
              error
            );
        }
      );
      response.statusCode = HTTP_STATUS.BAD_REQUEST;
      response.end(JSON.stringify(errorResponse));
      return;
    }

    const sum = numberOne + numberTwo;
    serverState.sumCallCount++;
    const responseData = { sum };
    const historyEntry = {
      endpoint: ENDPOINT.SUM,
      input: data,
      output: responseData,
      timestamp: new Date().toISOString(),
    };
    serverState.apiHistory.push(historyEntry);
    saveData(
      {
        sumCallCount: serverState.sumCallCount,
        apiHistory: serverState.apiHistory,
      },
      (error) => {
        if (error)
          console.error("Failed to save data after sum success:", error);
      }
    );
    response.statusCode = HTTP_STATUS.OK;
    response.end(JSON.stringify(responseData));
  });
}

export function handleCountRequest(request, response, serverState) {
  const responseData = { totalCalls: serverState.sumCallCount };
  const historyEntry = {
    endpoint: ENDPOINT.SUM_CALL_COUNT,
    input: {},
    output: responseData,
    timestamp: new Date().toISOString(),
  };
  serverState.apiHistory.push(historyEntry);
  saveData(
    {
      sumCallCount: serverState.sumCallCount,
      apiHistory: serverState.apiHistory,
    },
    (error) => {
      if (error)
        console.error("Failed to save data after count request:", error);
    }
  );
  response.statusCode = HTTP_STATUS.OK;
  response.end(JSON.stringify(responseData));
}

export function handleTimeRequest(request, response, serverState) {
  const currentTime = new Date().toISOString();
  const responseData = { currentTime };
  const historyEntry = {
    endpoint: ENDPOINT.CURRENT_TIME,
    input: {},
    output: responseData,
    timestamp: new Date().toISOString(),
  };
  serverState.apiHistory.push(historyEntry);
  saveData(
    {
      sumCallCount: serverState.sumCallCount,
      apiHistory: serverState.apiHistory,
    },
    (error) => {
      if (error)
        console.error("Failed to save data after time request:", error);
    }
  );
  response.statusCode = HTTP_STATUS.OK;
  response.end(JSON.stringify(responseData));
}

export function handleHistoryRequest(request, response, serverState) {
  const responseData = { apiHistory: serverState.apiHistory };
  response.statusCode = HTTP_STATUS.OK;
  response.end(JSON.stringify(responseData));
}
