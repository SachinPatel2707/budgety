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
    }
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
    expensesContainer: '.expenses__list'
  };

  // public functions of the UIController.
  return {
    // fetches the input from UI and returns them in the
    // form of an object.
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
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

  var ctrlAddItem = function() {

    var input, newItem;

    // read input data
    input = uiCtrl.getInput();

    // add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // add item to UI controller
    uiCtrl.addListItem(newItem, input.type);
    uiCtrl.clearFields();

    // calculate the budget


    // display the budget on the UI


  }

  return {
    init: function() {
      console.log('Application started.');
      setupEventListeners();
    }
  }

})(budgetController, uiController);


controller.init();
