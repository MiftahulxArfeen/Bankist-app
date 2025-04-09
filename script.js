"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
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

// Display Movements

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  // Sort
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //
  movs.forEach(function (val, i) {
    const type = val > 0 ? "deposit" : "withdrawal";
    const html = `
<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${val}€</div>
</div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
  // console.log(movements);
};

// displayMovements(account1.movements);

// Display sum of movements

const displayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
  return balance;
};
// displayBalance(account1.movements);

// Display summary
const calcDisplaySummary = function (acc) {
  // Deposits
  const deposits = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${deposits}€`;

  // Withdraws
  const out = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${out}€`;

  // Interests
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => {
      // console.log(arr);
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// calcDisplaySummary(account1.movements);

// Update UI function
const updateUI = function (currentUser) {
  // Display Movements
  displayMovements(currentUser.movements);
  // Display Balance
  currentUser.balance = displayBalance(currentUser.movements);
  // Display Summary
  calcDisplaySummary(currentUser);
};

// Login functionality

let currentUser;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentUser = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentUser);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Welcome message
    labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;
    // Hide input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

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
  const transferAmount = Number(inputTransferAmount.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
  //
  if (
    transferAmount > 0 &&
    transferAmount <= currentUser.balance &&
    transferAcc
  ) {
    currentUser.movements.push(-transferAmount);
    transferAcc.movements.push(transferAmount);
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
    Number(inputClosePin.value) === currentUser.pin
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
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentUser.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    currentUser.movements.push(loanAmount);
    // Update UI
    updateUI(currentUser);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// Sorting functionality
let sortState = true;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, sortState);
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

labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (cur) => Number(cur.textContent.replace("€", ""))
  );
  console.log(movementsUI);
});
