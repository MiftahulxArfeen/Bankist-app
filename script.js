"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
    "2025-04-10T10:17:24.185Z",
    "2025-04-13T09:15:04.904Z",
    "2025-04-14T07:42:02.383Z",
    "2025-04-15T21:31:17.178Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
// accounts[0].username;
// console.log(accounts);

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Showing Date
const now = new Date();
// const date = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// console.log(month);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;

const options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

//

// Formatting and internationalizing date functionality
const formattedDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(
      Math.abs((new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24))
    );
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const movDate = new Date(date);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Formatting and internationalizing number functionality
const formattedCur = function (locale, value, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
console.log(formattedCur("en-US", 349327947273490, "EUR"));
// console.log(formattedDate("2025-04-22T21:31:17.178Z"));
// console.log(new Date("2025-04-22T21:31:17.178Z"));
//

// Timer functionality
const setLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  };
  let time = 300;
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
};
// console.log(setLogoutTimer());
// Display Movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const combinedMovsDates = acc.movements.map((mov, i) => {
    return { movement: mov, movementDate: acc.movementsDates[i] };
  });
  console.log(combinedMovsDates);

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);
  console.log(combinedMovsDates);
  //
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    // console.log(typeof movement);
    // console.log(formattedNumber(acc.locale, movement));
    const movDate = new Date(movementDate);
    //
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${formattedDate(movDate, acc.locale)}</div>
  <div class="movements__value">${formattedCur(acc.locale, movement, acc.currency)}</div>
</div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
  // console.log(movements);
};

// displayMovements(account1.movements);

// Display sum of movements

const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formattedCur(acc.locale, balance, acc.currency)}`;
  return balance;
};
// displayBalance(account1.movements);

// Display summary
const calcDisplaySummary = function (acc) {
  // Deposits
  const deposits = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${formattedCur(acc.locale, deposits, acc.currency)}`;

  // Withdraws
  const out = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${formattedCur(acc.locale, out, acc.currency)}`;

  // Interests
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => {
      // console.log(arr);
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${formattedCur(acc.locale, interest, acc.currency)}`;
};

// calcDisplaySummary(account1.movements);

// Update UI function
const updateUI = function (currentUser) {
  // Display Movements
  displayMovements(currentUser);
  // Display Balance
  currentUser.balance = displayBalance(currentUser);
  // Display Summary
  calcDisplaySummary(currentUser);
};

// Login functionality

let currentUser, timer;
// FAKE LOGIN
// currentUser = account1;
// updateUI(currentUser);
// containerApp.style.opacity = 100;
//

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentUser = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentUser);
  if (currentUser?.pin === +inputLoginPin.value) {
    // Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;
    // Hide input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // Timer
    if (timer) clearInterval(timer);
    timer = setLogoutTimer();
    // Update UI
    updateUI(currentUser);
  }
});
// Transfer functionality
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAcc = accounts.find((acc) => {
    return acc.username === inputTransferTo.value;
  });
  // console.log(transferAcc);
  const transferAmount = +inputTransferAmount.value;
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
  //
  if (
    transferAmount > 0 &&
    transferAmount <= currentUser.balance &&
    transferAcc
  ) {
    // Restarts the timer
    clearInterval(timer);
    timer = setLogoutTimer();
    //
    currentUser.movements.push(-transferAmount);
    currentUser.movementsDates.push(now.toISOString());
    transferAcc.movements.push(transferAmount);
    transferAcc.movementsDates.push(now.toISOString());
    // Update UI
    updateUI(currentUser);
  }
});

// Closing Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("Delete");
  if (
    inputCloseUsername.value === currentUser.username &&
    +inputClosePin.value === currentUser.pin
  ) {
    console.log("deleted");
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
    inputCloseUsername.blur();
  }

  // finding index of the element which contains the account
  const index = accounts.findIndex(
    (acc) => acc.username === currentUser.username
  );
  accounts.splice(index, index + 1);
  // logging Out
  containerApp.style.opacity = 0;
});

// Loan requesting functionality
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.round(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentUser.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    // Restarts the timer
    clearInterval(timer);
    timer = setLogoutTimer();
    //
    setTimeout(function () {
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(now.toISOString());
      // Update UI
      updateUI(currentUser);
    }, 2500);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// Sorting functionality
let sortState = true;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentUser, sortState);
  sortState = !sortState;
});
// Create usernames

// const user = "Sarah Smith";
// console.log(
//   user
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
// );

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

// console.log(createUsernames("Steven Thomas Williams"));
createUsernames(accounts);
// console.log(accounts);
// console.log(account1);
let a = [4, 9, 5];
a.splice(3, 1);
console.log(a);

// const movementsUI = Array.from(
//   document.querySelectorAll(".movements__value"),
//   () => {
//     labelBalance.addEventListener("click", function (e) {
//       e.preventDefault();
//       console.log();
//     });
//   }
// );

// Using Array.from()
labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (cur) => +cur.textContent.replace("€", "")
  );
  console.log(movementsUI);
});
// Using Remainder operator
labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  Array.from(document.querySelectorAll(".movements__row"), (cur, i) => {
    if (i % 2 === 0) cur.style.backgroundColor = "orangered";
  });
});
