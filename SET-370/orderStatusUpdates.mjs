console.log("\n--- Bài tập 1: setTimeout ---");

function updateOrderStatus() {
    setTimeout(() => {
        console.log("Your order will be ready in 3 minutes");
    }, 3000); // 3 giây
}

console.log("Order placed");
updateOrderStatus();
console.log("Waiting for updates...");