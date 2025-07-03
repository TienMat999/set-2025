export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  TRACE: "TRACE",
  OPTIONS: "OPTIONS",
};

export const ENDPOINT = {
  SUM: "/sum",
  SUM_CALL_COUNT: "/sum-call-count",
  CURRENT_TIME: "/current-time",
  HISTORY: "/history",
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const HEADER = {
  CONTENT_TYPE: "Content-Type",
};

export const MIME_TYPE = {
  TEXT: "text/plain",
  JSON: "application/json",
};

export const DATA_FILE_PATH = "./data/data.json";
