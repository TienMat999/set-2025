const marketListWithoutName = [
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

const money = calculateShoppingBudget(marketListWithoutName);
console.log(money);

const inputArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 1 2 3 6 9 8 7 4 5

function snail(inputArray) { // function snail - the name define by Mr.Dang
    const resultArray = [];
    while (inputArray.length) {
        for (let columnIndex = 0; inputArray[0].length; columnIndex++) {
          	resultArray.push(inputArray[0].shift());
        }
        inputArray.shift();
        for (let rowIndex = 0; rowIndex < inputArray.length; rowIndex++) {
            resultArray.push(inputArray[rowIndex].pop());
        }
        if (inputArray.length) { // end of row
            for (let columnIndex = inputArray[inputArray.length - 1].length - 1; columnIndex >= 0; columnIndex--) {
                resultArray.push(inputArray[inputArray.length - 1].pop());

            }
        }
        inputArray.pop();
        for (let row = inputArray.length - 1; row >= 0; row--) {
            resultArray.push(inputArray[row].shift());
        }
    }
    return resultArray;
}

const arrayResult = snail(inputArray)
console.log(arrayResult)

const inputArrayTwo = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
];

const arrayResultTwo = snail(inputArrayTwo)
console.log(arrayResultTwo)
