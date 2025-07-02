import axios from "axios";

const RESTAURANT_API = "https://684280b7e1347494c31cfa59.mockapi.io/api";
const DELIVERY_API = "https://68429017e1347494c31d29d1.mockapi.io/api/delivery";

function processOrder({ restaurantId, orderId, amount }) {
  console.log("\n🔄  Bắt đầu quy trình với promise chain");

  /* NOTE: Kiểm tra nhà hàng mở cửa */
  return fetch(`${RESTAURANT_API}/restaurants/${restaurantId}`)
    .then(restaurantResponse => {
      if (!restaurantResponse.ok) {
        throw { type: "API", response: restaurantResponse };
      }
      return restaurantResponse.json();
    })
    .then(restaurantData => {
      if (!restaurantData.isOpen) {
        console.log(`❌  Nhà hàng (ID: ${restaurantId}) "${restaurantData.name}" đang đóng cửa.`);
        throw "DONE";
      }
      console.log(`✅  Nhà hàng (ID: ${restaurantId}) "${restaurantData.name}" đang mở.`);

      /* NOTE: Kiểm tra đơn hàng đã gán tài xế hay chưa */
      return fetch(`${DELIVERY_API}/deliveryAssignments?orderId=${orderId}`);
    })
    .then(deliveryAssignmentsResponse => {
      if (deliveryAssignmentsResponse.status === 404) {
        return [];
      }
      if (!deliveryAssignmentsResponse.ok) {
        throw { type: "API", response: deliveryAssignmentsResponse };
      }
      return deliveryAssignmentsResponse.json();
    })
    .then(assignmentList => {
      if (assignmentList.length) {
        console.log(`🚚  Đơn hàng #${orderId} đã được gán tài xế. Kết thúc.`);
        throw "DONE";
      }

      /* NOTE: Xử lý thanh toán */
      return fetch(`${RESTAURANT_API}/payments?orderId=${orderId}`);
    })
    .then(paymentQueryResponse => {
      if (paymentQueryResponse.status === 404) {
        return [];
      }
      if (!paymentQueryResponse.ok) {
        throw { type: "API", response: paymentQueryResponse };
      }
      return paymentQueryResponse.json();
    })
    .then(paymentList => {
      /* NOTE: chưa có bản ghi thanh toán */
      if (paymentList.length === 0) {
        return fetch(`${RESTAURANT_API}/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount,
            paymentMethod: "Credit Card",
            status: true
          })
        })
          .then(createPaymentResponse => {
            if (!createPaymentResponse.ok) {
              throw { type: "API", response: createPaymentResponse };
            }
            return createPaymentResponse.json();
          })
          .then(createdPayment => {
            console.log(`✅  Tạo thanh toán mới (ID: ${createdPayment.id}) cho đơn hàng #${orderId}.`);
            return true;
          });
      }

      /* NOTE: đã có bản ghi thanh toán */
      const existingPayment = paymentList[0];
      if (!existingPayment.status) {
        return fetch(`${RESTAURANT_API}/payments/${existingPayment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existingPayment, status: true })
        })
          .then(updatePaymentResponse => {
            if (!updatePaymentResponse.ok) {
              throw { type: "API", response: updatePaymentResponse };
            }
            return updatePaymentResponse.json();
          })
          .then(() =>
            console.log(`✅  Cập nhật thanh toán (ID: ${existingPayment.id}) của đơn hàng #${orderId} ➜ ĐÃ THANH TOÁN.`)
          );
      }

      console.log(`ℹ️  Thanh toán (ID: ${existingPayment.id}), đơn hàng #${orderId} đã thực hiện trước đó.`);
      return true;
    })
    /* NOTE: Lấy danh sách tài xế rảnh */
    .then(() =>
      fetch(`${DELIVERY_API}/drivers?isAvailable=true`)
      .then(driverResponse => {
        if (driverResponse.status === 404) {
          return [];
        }
        if (!driverResponse.ok) {
          throw { type: "API", response: driverResponse };
        }
        return driverResponse.json();
      })
    )
    .then(driverList => {
      if (!driverList.length) {
        throw new Error("❌  Không có tài xế khả dụng.");
      }

      const selectedDriver = driverList[0];
      console.log(`🔎  Tìm thấy tài xế: ID: ${selectedDriver.id} - Tên: ${selectedDriver.name} - phương tiện: ${selectedDriver.vehicle}.`);

      /* NOTE: Chạy đồng thời: tạo assignment & cập nhật trạng thái tài xế */
      const createAssignmentPromise = fetch(`${DELIVERY_API}/deliveryAssignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          driverId: selectedDriver.id,
          status: "assigned"
        })
      });

      const lockDriverPromise = fetch(`${DELIVERY_API}/drivers/${selectedDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedDriver, isAvailable: false })
      });

      return Promise.all([createAssignmentPromise, lockDriverPromise]).then(responseArray => {
        for (const singleResponse of responseArray) {
          if (!singleResponse.ok) {
            throw { type: "API", response: singleResponse };
          }
        }
        return selectedDriver.name;
      });
    })
    .then(assignedDriverName => {
      console.log(`✅  Đã gán tài xế "${assignedDriverName}" cho đơn hàng #${orderId}.`);
      console.log("🎉  QUY TRÌNH HOÀN TẤT!");
    })
    .catch(error => {
      if (error === "DONE") {
        return;
      }
      if (error.type === "API") {
        console.error(`❌  Lỗi API ${error.response.status}: ${error.response.url}`);
      }
      else {
        console.error(`❌  ${error.message || error}`);
      }
    })
    .finally(() => console.log("🔚  Kết thúc quy trình.\n"));
}


async function handleOrder({ restaurantId, orderId, amount }) {
  console.log("\n🔄  Bắt đầu quy trình với async/await");

  try {
    /* NOTE: Kiểm tra nhà hàng mở cửa */
    const restaurantResponse = await axios.get(
      `${RESTAURANT_API}/restaurants/${restaurantId}`,
    );
    const restaurantInfo = restaurantResponse.data;

    if (!restaurantInfo.isOpen) {
      console.log(`❌  Nhà hàng (ID: ${restaurantId}) "${restaurantInfo.name}" đang đóng cửa.`,);
      return;
    } else {
      console.log(`✅  Nhà hàng (ID: ${restaurantId}) "${restaurantInfo.name}" đang mở.`,);
    }

    let deliveryAssignmentList = [];
    try {
      /* NOTE: Kiểm tra đơn hàng đã gán tài xế hay chưa */
      const assignmentResponse = await axios.get(
        `${DELIVERY_API}/deliveryAssignments`,
        { params: { orderId } },
      );
      deliveryAssignmentList = assignmentResponse.data;
    } catch (apiError) {
      if (apiError.response?.status !== 404) {
        throw apiError;
      }
    }

    if (deliveryAssignmentList.length > 0) {
      console.log(`🚚  Đơn hàng #${orderId} đã được gán tài xế. Kết thúc quy trình.`,);
      return;
    }

    /* NOTE: Xử lý thanh toán */
    let paymentRecordList = [];
    try {
      const paymentQueryResponse = await axios.get(
        `${RESTAURANT_API}/payments`,
        { params: { orderId } },
      );
      paymentRecordList = paymentQueryResponse.data;
    } catch (apiError) {
      if (apiError.response?.status !== 404) {
        throw apiError;
      }
    }

    let currentPaymentId;
    /* NOTE: chưa có bản ghi thanh toán */
    if (paymentRecordList.length === 0) {
      const createPaymentResponse = await axios.post(
        `${RESTAURANT_API}/payments`,
        {
          orderId: orderId,
          amount: amount,
          paymentMethod: "Credit Card",
          status: true,
        },
      );
      currentPaymentId = createPaymentResponse.data.id;
      console.log(`✅  Tạo thanh toán mới (ID: ${currentPaymentId}) cho đơn hàng #${orderId}.`,);
    } else {
      /* NOTE: đã có bản ghi thanh toán */
      const existingPaymentRecord = paymentRecordList[0];
      currentPaymentId = existingPaymentRecord.id;

      if (!existingPaymentRecord.status) {
        await axios.put(`${RESTAURANT_API}/payments/${currentPaymentId}`, {
          ...existingPaymentRecord,
          status: true,
        });
        console.log(`✅  Cập nhật thanh toán (ID: ${currentPaymentId}) của đơn hàng #${orderId} ➜ ĐÃ THANH TOÁN.`,);
      } else {
        console.log(`ℹ️  Thanh toán (ID: ${currentPaymentId}), đơn hàng #${orderId} đã được thực hiện trước đó.`,);
      }
    }
    /* NOTE: Lấy danh sách tài xế rảnh */
    let availableDriverList = [];
    try {
      const freeDriverResponse = await axios.get(
        `${DELIVERY_API}/drivers`,
        { params: { isAvailable: true } },
      );
      availableDriverList = freeDriverResponse.data;
    } catch (driverError) {
      if (driverError.response?.status === 404) {
        availableDriverList = [];
      } else {
        throw driverError;
      }
    }
    if (availableDriverList.length === 0) {
      throw new Error("❌  Không có tài xế khả dụng.");
    }

    const selectedDriver = availableDriverList[0];
    console.log(`🔎  Tìm thấy tài xế: ID: ${selectedDriver.id} - Tên: ${selectedDriver.name} - Phương tiện: ${selectedDriver.vehicle}.`,);
    /* NOTE: Chạy đồng thời: tạo assignment & cập nhật trạng thái tài xế */
    await Promise.all([
      axios.post(`${DELIVERY_API}/deliveryAssignments`, {
        orderId: orderId,
        driverId: selectedDriver.id,
        status: "assigned",
      }),
      axios.put(`${DELIVERY_API}/drivers/${selectedDriver.id}`, {
        ...selectedDriver,
        isAvailable: false,
      }),
    ]);

    console.log(`✅  Đã gán tài xế "${selectedDriver.name}" cho đơn hàng #${orderId}.`,);
    console.log("🎉  QUY TRÌNH HOÀN TẤT!");
  } catch (caughtError) {
    if (caughtError.response) {
      console.error(`❌  Lỗi API ${caughtError.response.status}: ${caughtError.response.config.url}`,);
    } else {
      console.error(`❌  ${caughtError.message}`);
    }
  } finally {
    console.log("🔚  Kết thúc quy trình.\n");
  }
}

async function main() {
  const order1 = { restaurantId: "1", orderId: "1", amount: 250000 };
  await processOrder(order1);

  const order2 = { restaurantId: "3", orderId: "3", amount: 180000 };
  await handleOrder(order2);
}

main()
