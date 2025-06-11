function updateDeliveryStatus() {
  let minutes = 5;
  
  const statusMessages = {
      5: "Driver is picking up your order",
      4: "Driver is on the way",
      3: "Driver is approaching your location",
      2: "Driver is nearby",
      1: "Driver is just around the corner",
      0: "Order delivered!"
  };

  console.log(`[${minutes} min] ${statusMessages[minutes]}`);
  
  const intervalId = setInterval(() => {
      minutes--;
      
      if (minutes === 0) {
          console.log(`[${minutes} min] ${statusMessages[minutes]}`);
          clearInterval(intervalId);
      } else {
          console.log(`[${minutes} min] ${statusMessages[minutes]}`);
      }
  }, 1000); // NOTE: Sử dụng 1000ms (1 giây) cho demo nhanh, theo đề bài thì dùng 60000ms (1 phút)
}

updateDeliveryStatus();
