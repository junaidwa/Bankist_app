'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const displaymovements = function (mov,sort = false) {
  containerMovements.innerHTML = ' ';

const movs = sort ? mov.slice().sort((a,b) => a-b) :mov;




movs.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }} deposit</div>
         
          <div class="movements__value">${value.toFixed(2)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //Here we use afterbegin because we want new element add at the first position but with before end add new element at the end
  });
};
// displaymovements(account1.movements);

const convertname = function (accs) {
  //Here we create new property of every account object that is useername which contain only first letter of every words of name
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (access) {
        return access[0];
      })
      .join('');
  });
};
convertname(accounts);
// console.log(accounts)   //Now we create new property in every account.

const displaycurrbalance = function (movements) {
  const balance = movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  movements.balance = balance;
  labelBalance.textContent = `${movements.balance.toFixed(2)} €`;
};
// displaycurrbalance(account2.movements);

const displaycurrsummary = function (movements) {
  const incomes = movements
    .filter(mov1 => mov1 > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  const outcomes = movements
    .filter(mov1 => mov1 < 0)
    .reduce((acc, cur) => Math.abs(acc + cur), 0);

  labelSumOut.textContent = `${outcomes.toFixed(2)}€`;

  const interest = movements
    .filter(mov1 => mov1 > 0)
    .map(mov2 => mov2 * 0.2)
    .filter(mov3 => mov3 >= 1) // Add filter here because we want to exclude those deposit that is less than 1 and then sum the interest
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

//Update UI
function UpdateUI(current) {
  labelWelcome.textContent = `Welcome ${current.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;

  //Display Movements:

  displaymovements(current.movements);

  //Display Summary:
  displaycurrsummary(current.movements);

  //Display Balance:
  displaycurrbalance(current.movements);
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
}

// displaycurrsummary(account2.movements);

let currentaccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentaccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentaccount);

  if (currentaccount.pin === Number(inputLoginPin.value)) {
    console.log('Login');

    UpdateUI(currentaccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const ammount = Number(inputTransferAmount.value);
  console.log(ammount);
  const receiveaccount = inputTransferTo.value;
  console.log(receiveaccount);

  const receiveaccount1 = accounts.find(
    acc1 => acc1.username === receiveaccount
  );

  console.log(receiveaccount1);

  if (
    ammount > 0 &&
    receiveaccount &&
    receiveaccount !== currentaccount.username &&
    currentaccount.movements.balance >= ammount
  ) {
    console.log('Transfter');
    currentaccount.movements.push(-ammount);
    receiveaccount1.movements.push(ammount);
    UpdateUI(currentaccount);
  } else {
    console.log('Not Transfer');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentaccount.username &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    console.log('Match with account object');
    const index = accounts.findIndex(
      acv => acv.username === currentaccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    UpdateUI(currentaccount);
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
});


btnLoan.addEventListener( 'click' , (e)=>{
  e.preventDefault();

  if(Number(inputLoanAmount.value)>0 && currentaccount.movements.some((val) => val*0.1)){
    currentaccount.movements.push(Math.floor(inputLoanAmount.value));
    UpdateUI(currentaccount);
    

  }
})

let sorted = false;
btnSort.addEventListener('click' , (e)=> {
  e.preventDefault();
  displaymovements(currentaccount.movements ,!sorted);
  sorted= !sorted;

})



const label = new Date();
const year = label.getFullYear();
const day = `${label.getDay()}`.padStart(2,0);
const date = label.getDate();
const hours = label.getHours();
const min= label.getMinutes();
const mon = `${label.getMonth()}`.padStart(2,0); +1;
//Date /Month/Year Hours:min
labelDate.textContent =`${date}/${mon}/${year},${hours}:${min}`;