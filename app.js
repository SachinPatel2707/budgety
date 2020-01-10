/***** Data Controller *****/
var budgetController = (function() {



})();


/***** UI Controller *****/
var uiController = (function() {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

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

    // read input data
    var input = uiCtrl.getInput();
    console.log(input);

    // add item to budget controller


    // add item to UI controller


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
