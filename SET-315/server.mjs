import http from "http";

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  TRACE: "TRACE",
  OPTIONS: "OPTIONS",
};

const ENDPOINT = {
  SUM: "/sum",
  SUM_CALL_COUNT: "/sum-call-count",
  CURRENT_TIME: "/current-time",
  HISTORY: "/history",
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const HEADER = {
  CONTENT_TYPE: "Content-Type",
};

const MIME_TYPE = {
  TEXT: "text/plain",
  JSON: "application/json",
};

let sumCallCount = 0;
const apiHistory = [];

const server = http.createServer((req, res) => {
  res.setHeader(HEADER.CONTENT_TYPE, MIME_TYPE.JSON);
  const { url, method } = req;

  if (url === ENDPOINT.SUM && method === HTTP_METHOD.POST) {
    handleSumRequest(req, res);
  } else if (url === ENDPOINT.SUM_CALL_COUNT && method === HTTP_METHOD.GET) {
    handleCountRequest(req, res);
  } else if (url === ENDPOINT.CURRENT_TIME && method === HTTP_METHOD.GET) {
    handleTimeRequest(req, res);
  } else if (url === ENDPOINT.HISTORY && method === HTTP_METHOD.GET) {
    handleHistoryRequest(req, res);
  } else {
    res.statusCode = HTTP_STATUS.NOT_FOUND;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
});

function handleSumRequest(req, res) {
  let body = "";
  const errorResponse = { error: "Invalid input" };
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      sumCallCount++;
      apiHistory.push({
        endpoint: ENDPOINT.SUM,
        input: {},
        output: errorResponse,
      });
      res.statusCode = HTTP_STATUS.BAD_REQUEST;
      res.end(JSON.stringify(errorResponse));
      return;
    }

    const { num1, num2 } = data; // đặt tên biến theo đề bài để in ra như đề bài
    const numberOne = parseFloat(num1);
    const numberTwo = parseFloat(num2);
    if (
      typeof numberOne !== "number" || // không phải là số
      typeof numberTwo !== "number" ||
      isNaN(numberOne) || // không có số
      isNaN(numberTwo)
    ) {
      sumCallCount++;
      apiHistory.push({
        endpoint: ENDPOINT.SUM,
        input: data,
        output: errorResponse,
      });
      res.statusCode = HTTP_STATUS.BAD_REQUEST;
      res.end(JSON.stringify(errorResponse));
      return;
    }

    const sum = numberOne + numberTwo;
    sumCallCount++;
    const response = { sum };
    apiHistory.push({
      endpoint: ENDPOINT.SUM,
      input: data,
      output: response,
    });
    res.statusCode = HTTP_STATUS.OK;
    res.end(JSON.stringify(response));
  });
}

function handleCountRequest(req, res) {
  const response = { totalCalls: sumCallCount }; // đặt tên biến JSON theo đề bài
  apiHistory.push({
    endpoint: ENDPOINT.SUM_CALL_COUNT,
    input: {},
    output: response,
  });
  res.statusCode = HTTP_STATUS.OK;
  res.end(JSON.stringify(response));
}

function handleTimeRequest(req, res) {
  const currentTime = new Date().toISOString();
  const response = { currentTime };
  apiHistory.push({
    endpoint: ENDPOINT.CURRENT_TIME,
    input: {},
    output: response,
  });
  res.statusCode = HTTP_STATUS.OK;
  res.end(JSON.stringify(response));
}

function handleHistoryRequest(req, res) {
  const response = { apiHistory };
  res.statusCode = HTTP_STATUS.OK;
  res.end(JSON.stringify(response));
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log("Các API có sẵn:");
  console.log(`1. POST   ${ENDPOINT.SUM}            - Tính tổng hai số`);
  console.log(`2. GET    ${ENDPOINT.SUM_CALL_COUNT} - Đếm số lần gọi API sum`);
  console.log(`3. GET    ${ENDPOINT.CURRENT_TIME}   - Lấy thời gian hiện tại`);
  console.log(`4. GET    ${ENDPOINT.HISTORY}        - Lấy lịch sử gọi API`);
});
