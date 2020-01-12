/***** Data Controller *****/
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });

    data.totals[type] = sum;
  }

  // create a single object to store all data instead of
  // having multiple variables floating around.
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function(type, des, val) {
      var id, newItem;

      // create a new id
      if (data.allItems[type].length > 0) {
          id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0
      }


      // create a new item based on 'type'
      if (type === 'exp') {
        newItem = new Expense(id, des, val);
      } else if (type === 'inc'){
        newItem = new Income(id, des, val);
      }

      // push the newItem into our data structure
      data.allItems[type].push(newItem);

      // return the new item
      return newItem;
    },

    calculateBudget: function() {

      // calculate  total income and  expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };

})();





/***** UI Controller *****/
var uiController = (function() {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetValue: '.budget__value',
    budgetIncomeValue: '.budget__income--value',
    budgetExpensesValue: '.budget__expenses--value',
    budgetExpensesPercentage: '.budget__expenses--percentage'
  };

  // public functions of the UIController.
  return {
    // fetches the input from UI and returns them in the
    // form of an object.
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    // adds a new item to either list depending on its 'type'.
    addListItem: function(obj, type) {

      var html, newhtml, element;

      // create placeholder HTML
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholders with data items
      newhtml = html.replace('%id%', obj.id);
      newhtml = newhtml.replace('%description%', obj.description);
      newhtml = newhtml.replace('%value%', obj.value);

      // add the HTML to the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);

    },

    // clears the description and value fields.
    clearFields: function() {
      var fields, fieldsArr;
      // select both fields - this query returns a list
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      // convert the list to array
      fieldsArr = Array.prototype.slice.call(fields);

      // loop through each field and set it to empty string
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });

      // change the focus to description element
      fieldsArr[0].focus();
    },

    displayBudget: function(budgetObj) {
      document.querySelector(DOMStrings.budgetValue).textContent = budgetObj.budget;
      document.querySelector(DOMStrings.budgetIncomeValue).textContent = budgetObj.totalInc;
      document.querySelector(DOMStrings.budgetExpensesValue).textContent = budgetObj.totalExp;

      if (budgetObj.percentage > 0) {
        document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = budgetObj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = "---";
      }
    },

    // make DOMStrings object publicly accessible.
    getDOMStrings: function() {
      return DOMStrings;
    }
  };

})();





/***** App Controller *****/
var controller = (function(budgetCtrl, uiCtrl) {

  var setupEventListeners = function() {
      var DOMStrings = uiCtrl.getDOMStrings();

      // add eventListener for 'add' button
      document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);

      // add eventListener for 'Enter' keypress
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
  }

  var updateBudget = function() {
    // calculate the budget
    budgetCtrl.calculateBudget();

    // get the budget data
    var budget = budgetCtrl.getBudget();

    // display the budget on the UI
    uiCtrl.displayBudget(budget);

  }

  var ctrlAddItem = function() {

    var input, newItem;

    // read input data
    input = uiCtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add item to UI controller
      uiCtrl.addListItem(newItem, input.type);
      uiCtrl.clearFields();

      // update budget
      updateBudget();

    }

  }

  return {
    init: function() {
      console.log('Application started.');
      setupEventListeners();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  }

})(budgetController, uiController);





controller.init();
