console.log("\n--- Bài tập 1: setTimeout ---");

function updateOrderStatus() {
    setTimeout(() => {
        console.log("Your order will be ready in 3 minutes");
    }, 3000);
}

console.log("Order placed");
updateOrderStatus();
console.log("Waiting for updates...");


// console.log("\n--- Bài tập 1: Synchronous Version ---");

// function sleep(milliseconds) {
//     const start = Date.now();
//     while (Date.now() - start < milliseconds) {
//     }
// }

// function updateOrderStatusSync() {
//     sleep(3000);
//     console.log("Your order will be ready in 3 minutes");
// }

// console.log("Order placed");
// updateOrderStatusSync();
// console.log("Waiting for updates...");
