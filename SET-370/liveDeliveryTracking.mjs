console.log("\n--- Bài tập 2: setInterval ---");

let simulateCountdownMinutes = 5;

const statusMessages = [
  "Order confirmed, preparing your food (5 minutes left)...", // Index 0
  "Driver is picking up your order (4 minutes left)...",      // Index 1
  "Food is being prepared (3 minutes left)...",               // Index 2
  "Driver is on the way (2 minutes left)...",                 // Index 3
  "Driver is almost there (1 minute left)...",                // Index 4
  "Order delivered!"                                          // Index 5
];

function updateDeliveryStatus() {
  if (simulateCountdownMinutes >= 0) {
      const messageIndex = Math.min(simulateCountdownMinutes, statusMessages.length - 1);
      let currentMessage = statusMessages[statusMessages.length - 1 - messageIndex] || statusMessages[0];
      if (simulateCountdownMinutes === 0) currentMessage = statusMessages[5];

      console.log(`[${5 - simulateCountdownMinutes}s passed] ${currentMessage}`);
      simulateCountdownMinutes--;
  } else {
      clearInterval(deliveryInterval);
      console.log("Interval stopped.");
  }
}

updateDeliveryStatus();
// const deliveryInterval = setInterval(updateDeliveryStatus, 1000);
// console.log(deliveryInterval);

// setInterval(function, delay, ...args): trả về intervalId
// giúp lặp lại callback function (là tham số function trong setInterval) sau mỗi khoảng thời gian delay (ms)
// clearInterval(intervalId) để dừng lặp lại
// code trên ví dụ lặp lại hàm updateDeliveryStatus sau mỗi 1s
// tổng cộng có 7 lần lặp lại, lặp cho đến khi simulateCountdownMinutes = -1 (< 0) thì biểu thức else được kích hoạt, cho phép dừng interval
