let marketListWithoutName = [
    [10000, 10],
    [2000, 20],
    [5000, 10],
];

function calculateShoppingBudget(marketList) {
    let sum = 0;
    for (let i = 0; i < marketList.length; i = i + 1) {
        let unit = marketList[i][0];
        let price = marketList[i][1];
        sum = sum + unit * price;
    }
    return sum;
}

let money = calculateShoppingBudget(marketListWithoutName);
console.log(money);

const inputArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 1 2 3 6 9 8 7 4 5

function snail(inputArray) {
    const resultArray = [];
    while (inputArray.length) {
        for (let column = 0; inputArray[0].length; column++) {
          	resultArray.push(inputArray[0].shift());
        }
        inputArray.shift();
        for (let row = 0; row < inputArray.length; row++) {
            resultArray.push(inputArray[row].pop());
        }
        if (inputArray.length) { // end of row
            for (let column = inputArray[inputArray.length - 1].length - 1; column >= 0; column--) {
                resultArray.push(inputArray[inputArray.length - 1].pop());

            }
        }
        inputArray.pop()
        for (let row = inputArray.length - 1; row >= 0; row--) {
            resultArray.push(inputArray[row].shift());
        }
    }
    return resultArray;
}

let arrayResult = snail(inputArray)
console.log(arrayResult)

const inputArray2 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
];

arrayResult = snail(inputArray2)
console.log(arrayResult)
