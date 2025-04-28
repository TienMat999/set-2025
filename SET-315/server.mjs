import http from 'http';

let sumCallCount = 0;
const apiHistory = [];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { url, method } = req;

  if (url === '/sum' && method === 'POST') {
    handleSumRequest(req, res);
  } else if (url === '/count' && method === 'GET') {
    handleCountRequest(req, res);
  } else if (url === '/current-time' && method === 'GET') {
    handleTimeRequest(req, res);
  } else if (url === '/history' && method === 'GET') {
    handleHistoryRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

function handleSumRequest(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      const err = { error: 'Invalid JSON' };
      sumCallCount++;
      apiHistory.push({ endpoint: '/sum', input: {}, output: err });
      res.end(JSON.stringify(err));
      return;
    }

    const { num1, num2 } = data;
    if (isNaN(num1) || isNaN(num2)) {
      const errorResponse = { error: 'Invalid input' };
      sumCallCount++;
      apiHistory.push({ endpoint: '/sum', input: data, output: errorResponse });
      res.statusCode = 400;
      res.end(JSON.stringify(errorResponse));
      return;
    }

    const sum = Number(num1) + Number(num2);
    sumCallCount++;
    const response = { sum };
    apiHistory.push({ endpoint: '/sum', input: { num1, num2 }, output: response });
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  });
}

function handleCountRequest(req, res) {
  const response = { sumCallCount };
  apiHistory.push({ endpoint: '/count', input: {}, output: response });
  res.statusCode = 200;
  res.end(JSON.stringify(response));
}

function handleTimeRequest(req, res) {
  const currentTime = new Date().toISOString();
  const response = { currentTime };
  apiHistory.push({ endpoint: '/current-time', input: {}, output: response });
  res.statusCode = 200;
  res.end(JSON.stringify(response));
}

function handleHistoryRequest(req, res) {
  const response = { apiHistory };
  res.statusCode = 200;
  res.end(JSON.stringify(response));
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log('Các API có sẵn:');
  console.log('1. POST   /sum          - Tính tổng hai số');
  console.log('2. GET    /count        - Đếm số lần gọi API sum');
  console.log('3. GET    /current-time - Lấy thời gian hiện tại');
  console.log('4. GET    /history      - Lấy lịch sử cuộc gọi API');
});
