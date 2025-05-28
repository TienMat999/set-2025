import http from "http";
import {
  HTTP_METHOD,
  ENDPOINT,
  HTTP_STATUS,
  HEADER,
  MIME_TYPE,
} from "./modules/constants.mjs";
import {
  handleSumRequest,
  handleCountRequest,
  handleTimeRequest,
  handleHistoryRequest,
} from "./modules/requestHandler.mjs";

const server = http.createServer((request, response) => {
  response.setHeader(HEADER.CONTENT_TYPE, MIME_TYPE.JSON);
  const { url, method } = request;

  if (url === ENDPOINT.SUM && method === HTTP_METHOD.POST) {
    handleSumRequest(request, response);
  } else if (url === ENDPOINT.SUM_CALL_COUNT && method === HTTP_METHOD.GET) {
    handleCountRequest(request, response);
  } else if (url === ENDPOINT.CURRENT_TIME && method === HTTP_METHOD.GET) {
    handleTimeRequest(request, response);
  } else if (url === ENDPOINT.HISTORY && method === HTTP_METHOD.GET) {
    handleHistoryRequest(request, response);
  } else {
    response.statusCode = HTTP_STATUS.NOT_FOUND;
    response.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("Available APIs:");
  console.log(`1. POST  ${ENDPOINT.SUM}            - Calculate sum of two numbers`);
  console.log(`2. GET   ${ENDPOINT.SUM_CALL_COUNT} - Count sum API calls`);
  console.log(`3. GET   ${ENDPOINT.CURRENT_TIME}   - Get current time`);
  console.log(`4. GET   ${ENDPOINT.HISTORY}        - Get API call history`);
});
