import express from "express";
import { ENDPOINT } from "./modules/constants.mjs";
import routes from "./routes/index.mjs";

const app = express();

app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("Available APIs:");
  console.log(`1. POST  ${ENDPOINT.SUM}            - Calculate sum of two numbers`);
  console.log(`2. GET   ${ENDPOINT.SUM_CALL_COUNT} - Count sum API calls`);
  console.log(`3. GET   ${ENDPOINT.CURRENT_TIME}   - Get current time`);
  console.log(`4. GET   ${ENDPOINT.HISTORY}        - Get API call history`);
});
