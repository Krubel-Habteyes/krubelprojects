var budgetController = (function() {

        /* expense object */
        
        var Expense = function(id, description, value) {
                this.id = id;
                this.description = description;
                this.value = value;
                this.percentage= -1;
        };


        Expense.prototype.calcPercentage = function(totalIncome) {

            if (totalIncome > 0) {
                /* value of expense / total income given by user * 100 */
                this.percentage = Math.round((this.value /totalIncome) * 100);
            } else {
                this.percentage = -1;
            }

        };

        Expense.prototype.getPercentage = function() {
            return this.percentage; /* returns whatever the value of the above calculation is */
        }

        /* income object */

        var Income = function(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
       };

       var allExpense = []
       var allIncomes = []
       var totalExpenses = 0;

       var calculateTotal = function(type) {
            var sum = 0;
            /* go into the proper array and for each item in that array add it to the previous item */
            data.allItems[type].forEach(function(current) {
                sum = sum + current.value; /* keep adding the current value to the previous value and save it in the same place */
            });
            data.totals[type] = sum; /* go to the correct type  of list and put the sum in there */
       };

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
       };

            return {
                addItem: function(type, des, val) {
                    var newItem, ID;

                    /* generating an id */
                    if(data.allItems[type].length > 0) {
                        ID = data.allItems[type][data.allItems[type].length -1].id + 1; /* -1 to get to the last element & + 1 to make it last element */
                    } else {
                        ID = 0;
                    }

                    if (type === 'exp') {
                        newItem = new  Expense(ID, des, val); /* creating a expense object */
                    } else if (type == 'inc'){
                        newItem = new  Income(ID, des, val); /* creating a income object */
                    }

                    data.allItems[type].push(newItem); /* stores values to  the proper arrays based on type */
                    return newItem; /* returns an object of expense or income */


                    },

                    deleteItem: function(type, id) {

                        /* create a new array using maps */
                        /* the new array contains the id of every element within the proper array */
                        var ids = data.allItems[type].map(function(current){
                            return current.id;

                        });

                            index = ids.indexOf(id); /* from the new ids array find the index of the id the user gave us */
                            /* if index does not exist */
                            if (index !== -1 ) {
                                    data.allItems[type].splice(index, 1);
                            }
                    },

                    calculateBudget: function() {
                        calculateTotal('exp'); /* passing in the required type */
                        calculateTotal('inc');

                        data.budget = data.totals.inc - data.totals.exp; /* income - expenses */
                        
                        if (data.totals.inc > 0) {
                            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); /* getting whole number percentage */
                        } else {
                            data.percentage = -1;
                        }
                    },

                    calculatePercentages: function() {
                            /* for each item in the exp array apply the cal percentage method*/
                        data.allItems.exp.forEach(function(current){
                            current.calcPercentage(data.totals.inc); /* take in an income as an argument */
                        });
                    },

                    getPercentages: function() {
                        var allPerc = data.allItems.exp.map(function(cur) {
                                return cur.getPercentage(); 
                        });

                        return allPerc;
                    },

                     getBudget: function() {
                         return {
                             budget: data.budget, 
                             totalInc: data.totals.inc,
                             totalExp: data.totals.exp,
                             percentage: data.percentage
                         }
                     }
                    
                   
                }
            
})();

var UIController = (function () {

    /* refering to classes from the html document */
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list', 
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLable: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {

        var numSplit, int1, dec, type;

        num = Math.abs(num);
        num  = num.toFixed(2); /* returing two decimal places */

        numSplit = num.split('.'); /* Split integer and decimal part into two */

        int1 = numSplit[0]; /* main integer = before decimal */
        if (int1.length >  3) {
            int1 = int1.substr(0, int1.length - 3) + ',' + int1.substr(int1.length - 3, 3); /* adding the comma to the right place */
        }

        dec = numSplit[1]; /* decimal point = after decimal */

        return (type === 'exp' ? '-' : '+') + ' ' + int1 + '.' + dec /* if expense use a minus, else use + because it is a income */

    };


    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i); /* current , index */
        }
    };

    return {
        getInput: function() {

            return {
                /* returns all these at once */
                 type: document.querySelector(DOMStrings.inputType).value, 
                 description: document.querySelector(DOMStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMStrings.inputValue).value) /* This is a number be default but we convert it to a number */
            };
        }, 

        addListItem: function(obj, type)  {
            var html, newHTML, element;
            if (type === 'inc') { 
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            } else if (type === 'exp') { 
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }

            newHTML = html.replace('%id%', obj.id); /* replacing the id text inside of the html with the object id */
            newHTML = newHTML.replace('%description%', obj.description); /* replacing the description text inside of the html with the object description */
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type)); /* replacing the value text inside of the html with the object value */
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML) /* go to the income list or expenses list and add the newHTML */
           
        },

        deleteListItem: function(selectorID) {

           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);

        },

        clearfields: function() {
            var fields;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            var fieldsArray = Array.prototype.slice.call(fields); /* creating a new array using slice for inputvalue and input description */

            fieldsArray.forEach(function (current, index, array) { /* for each item in the new array set the value of the item to an empty string */
                    current.value = ""; /* clearing user input */
            });

            fieldsArray[0].focus(); /* highligth the description boxes by default */
            
        },  

        displayBudget: function(obj) {

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc'); /* formmating income value properly */
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp'); /* formatting expense value properly */
            
            /* dont show the negative one to users */

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';

            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'; /* change the content of the current index we are on to the correspoind percentage for that index */
                } else {
                    current.textContent = '---';
                }
                
            });
        },


        displayMonth: function() {

            var now, year;

            now = new Date();
            var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year; /* Displaying date header up top */
           
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue);

                /* changing every field to red to match the exp color */
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red'); /* changing the button color to red when expense is selected */

        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

var controller = (function(budgtCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings(); 

        /* if the checkmark button is clicked call ctrlAddItem */
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
        /* checking if the enter key was clicked */
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();

        }

   });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function() {

        budgtCtrl.calculateBudget();

        var budget = budgtCtrl.getBudget();

        UICtrl.displayBudget(budget);


    };

    var updatePercentages = function() {
        budgtCtrl.calculatePercentages();
        var percentages = budgtCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    }

    var  ctrlAddItem = function() {
            var input = UICtrl.getInput(); /* a function that returns the type description value */
            /* description shouldnt be an empty string */
            /* value should be a number not anything else */
            /* Specifically, the value should be > than zero */
            if (input.description != "" && !isNaN(input.value) && input.value > 0) {

            var newItem = budgtCtrl.addItem(input.type, input.description, input.value); /* input is getinput so it has access to type description and values */

            UICtrl.addListItem(newItem, input.type); /* adding the users input into the HTML */

            UICtrl.clearfields(); /* clear the input fields after user submits values */

            updateBudget();

            updatePercentages();
            
            }
            
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; /* getting the id of the ver top parent node */
        /* if the id exists */
        if (itemID) {

            splitID = itemID.split('-'); /* split into two parts before and after the hypen */
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            budgtCtrl.deleteItem(type, ID);


            UICtrl.deleteListItem(itemID);

            updateBudget();

            updatePercentages();


        }

    };
   return {
       init: function() { 
           /* resetting everyhting to zero at the start */
           UICtrl.displayMonth();
           UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
        });
           setUpEventListeners();
       }
   };


})(budgetController, UIController);

controller.init();
