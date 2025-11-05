// Accessing the id's
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Local storage
let transactions;
try {
  transactions = JSON.parse(localStorage.getItem("transactions")) || [];
} catch (err) {
  transactions = [];
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter expense and amount...");
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateLocalStorage();
    updateValues();

    text.value = "";
    amount.value = "";
  }
}

// Add transactions to the dom list
function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  // adds a class (plus or minus) to style it.
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Adds the transaction name to the list item.
  const nameNode = document.createTextNode(transaction.text + " ");
  item.appendChild(nameNode);

  // Creates a span showing the amount with correct sign and 2 decimals.
  const amountSpan = document.createElement("span");
  amountSpan.textContent = `${sign}$${Math.abs(transaction.amount).toFixed(2)}`;
  item.appendChild(amountSpan);

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.textContent = "x";
  delBtn.addEventListener("click", () => removeTransaction(transaction.id));
  item.appendChild(delBtn);

  list.appendChild(item);
}

// Update the balance, income and expenses
function updateValues() {
  // Creates a new array containing only the numeric amount values from each transaction object.
  const amounts = transactions.map((transaction) => transaction.amount);
  // Sums every number in amounts. reduce iterates and accumulates...... 1. acc (accumulator) holds the running total..... 2. item is the current array element..... 3. 0 is the initial value of acc.
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  // First filter keeps only positive numbers (incomes). Then reduce sums them.
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0);
  // filter(item < 0) selects negative numbers (expenses). reduce(...) sums the negatives producing a negative total. * -1 flips sign so you display a positive expense number.
  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) *
    -1;

  balance.innerText = `$${total.toFixed(2)}`;
  money_plus.innerText = `$${income.toFixed(2)}`;
  money_minus.innerText = `$${expense.toFixed(2)}`;
}

// Removes transactions by id
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id != id);
  updateLocalStorage();
  init();
}

// Upadte the local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize the App
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

init();

// Generate a random id
function generateId() {
  return Math.floor(Math.random() * 100000);
}

form.addEventListener("submit", addTransaction);
