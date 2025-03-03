console.log("=== Homework ===");
// 1. Difference(s) between == and ===?
console.log("`==` compares two values and will convert them to the same data type (if necessary), if both values are the same then returns true, otherwise returns false");
console.log("Ex:");
console.log("1 == '1' = " + (1 == '1')); // true, JS will convert '1' to 1 first
console.log("1 == 1 = " + (1 == 1)); // true
console.log("`===` compares two values and their data types, if both values and data types are the same then returns true, otherwise returns false");
console.log("Ex:");
console.log("1 === '1' = " + (1 === '1') + " the data type of 1 is number which is different from '1' which is string"); // false
console.log("1 === 1 = " + (1 === 1)); // true

// 2. Use variables and operators to:
//  1. Calculate BMI (Body Mass Index)
let w = 50; // kg
let h = 1.6; // m
// var weight = 50; // kg
// var height = 1.6; // m
// let bmi = weight / (height ** 2);
function BMI(weight, height) {
    return weight / (height ** 2);
}
console.log("BMI = " + BMI(w, h));

//  2. Calculate Simple Interest (principal * rate * time)
let principal = 1000;
let rate = 0.05; // %
let time = 2; // year
let interest = principal * (1 + rate) * time;
console.log(interest);

//  3. Convert Currency (USD to local currency)
let usd = 100;
function convertCurrency(usd) { 
    let exchangeRate = 24726; // 15h00 03/03/2025, use let instead of const because exchange rate can change over time
    return usd * exchangeRate;
}
let vnd = convertCurrency(usd);
console.log(`${usd} USD = ${vnd} VND`);

//  4. Calculate Time (hours:minutes:seconds)
let totalSeconds = 8515;
function convertTime(totalSeconds) {
    const oneMinute = 60; // 1 min = 60 sec
    const oneHour = 3600; // 1 hour = 3600 sec
    let hours = Math.floor(totalSeconds / oneHour);
    let minutes = Math.floor((totalSeconds % oneHour) / oneMinute);
    let seconds = totalSeconds % oneMinute;
    return `${hours}:${minutes}:${seconds}`;
}
let result = convertTime(totalSeconds);
console.log(result);
