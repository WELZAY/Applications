//// TO DO LIST///////
//Add Event Handler for the buttons
//Get Input values   (first)
//Add new item to the data structure
//add the new item to the UI
//Calculate the budget
//Update the UI

/////so basically we put all the methods in Budget controller and Ui Controller and call them in the controller 


//BUDGET CONTROLLER 
var budgetController  = (function () {
    
   var Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };
    
    
    Expense.prototype.calcPercentages = function(totalIncome) 
    
    {
       if(totalIncome > 0) {
           
           this.percentage = Math.round((this.value/ totalIncome)* 100)  
           
       }else {
           this.percentage = -1;
       }
        
        Expense.prototype.getPercentage = function() {
            return this.percentage;
        };
        
      
    };
   
    
   var Income = function(id, description, value) {
       this.id = id;
       this.description = description
       this.value = value;
   };
   
   
   //Calculate expensies and income 
   var calculateTotal =  function (type) {
       var sum = 0;
       data.allItems[type].forEach(function(cur)  {
            sum += cur.value;                                 
                                             
 });
       
     data.totals[type] = sum;  
   };
   
   //To STORE EXPENSES & INCOMES 
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        },
        budget : 0,
        percentage: -1
    };
    
    return {
        // additem designed to create and store new items (either expenses or incomes) in the data structure.
        addItem: function(type, des, val) {
            var newItem;
            
            // a new number to be assigned either to the exp or inc . it should be ID = last ID + 1
            
            //Create New ID
            if (data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
                
            }
            
            
            //CREATE NEW ITEM BASED ON 'INC' OR 'EXP' type
            if (type === 'exp') {
              newItem =  new Expense(ID,des, val);  
            }else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push into our data structure
            data.allItems[type].push(newItem);
            
            //Return the new element 
            return newItem;
            
        },
        
        
        deleteItem: function(type, id) {
            var ids, index;
            //ids = [1,2,4,6,8]
           ids = data.allItems[type].map(function(current) {
               return current.id; //So, ids will be an array of IDs for all items in the specified type. 
            });
            
            index = ids.indexOf(id); //returns the index of the ement id that we put 
            
            if (index !==-1) { // if the item exists 
                data.allItems[type].splice(index, 1);
            }
        },
        
        
        calculateBudget: function() {
            
            // Calculate total income and expenses
            
            calculateTotal('exp')
            calculateTotal('inc')
            
            
            // Calculate the budget :income - EXPENSES
            
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate the percentage of income that was spent
            
            if(data.totals.inc >0) {
                data.percentage = Math.round((data.totals.exp/ data.totals.inc) * 100);   
            }else {
                data.percentage = -1;
            }
            
            
 
        },
        
        
        calculatePercentages: function () {
            
          data.allItems.exp.forEach(function(curr){
              curr.calcPercentages(data.totals.inc);
          });
        },
         
        getPercentage : function() {
           var allPerc = data.allItems.exp.map(function (cur){   
                return cur.getPercentage();
        
        
    });
        
            return  allPerc;
    },
        
         getBudget : function() {
            
           return {
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
               
           };
        },
        
       testing: function (){
         console.log(data);
        
    } 
    };
        
        
      
})();
        


//UI CONTROLLER 
var UIController = (function() {
    //here we write a public function because we want to use it in the controller. it will haave an object that iife can return.
    
    var DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: ".container",
        expensePercLabel: '.item__percentage',
        dateLabel : '.budget__title--month'
    };
    
    
    var formatNumber =  function(num, type) {
            var numSplit, int, dec;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.')
            int = numSplit[0];
            
            if(int.length > 3) {
                int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3 ,3);  //input 2310, output 2,310
            } 
                
                   
            
            dec = numSplit[1];
            
            return (type ==='exp' ? '-' : '+') + ' ' + int +  '.' +dec;
            
            
        };
        
 
    
    return {
        getInput: function() {   // his function reads values directly from the UI (HTML).
        //Purpose: his function gathers input data, which will be passed to the budgetController module to create a new item.

            return {
            type : document.querySelector(DOMstrings.inputType).value,//will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
                

        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            //Create HTML string with placeholder text 
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';;
            }else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                     html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }

            //Replace the placeholder text with some actual data
            
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))
            
            
            
            //Insert the HTML into the DOM 
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
        },
        
        //DELETING ITEMS 
        deleteListItem: function (selectorID) {
        
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
        
    },
        
        
        
        //Clear fields
        
        clearFields: function() {
            var fields, fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +DOMstrings.inputValue);
            
           fieldsArr = Array.from(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = ""; 
                
            });
            fieldsArr[0].focus();
            
            
    },
        displayBudget: function(obj) {
            var type
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            
            if  (obj.percentage>0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },
        
        
        displayPercentages: function(percentages) {
    var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
    
    fields.forEach(function(current, index) {
        if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
        } else {
            current.textContent = '---';
        }
    });
},

         
        
      displayMonth : function () {
          var now, year, month, months
            now = new Date();
            
          months  = ['Janyary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          
          
            month = now.getMonth();
            year = now.getFullYear();
          
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
           
          
      }, 
        
        
        changedType: function() {
    var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
    );

    fields.forEach(function(cur) {
        cur.classList.toggle('red-focus');
    });
            
            
         document.querySelector(DOMstrings.inputBtn).classList.toggle('red') ;  
            
},
       
        
        
        
        getDomeStrings: function() {
            return DOMstrings;
        }
        

    };
    
    
    
})();


/// GLOBAL APP CONTROLLER (CONNECT THE 2 TOGETHER)
var controller = (function (budgerCtr, Uictr) {
    var setupeEventListeners = function(){
        
        var DOM = Uictr.getDomeStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', controlADDItem);

        document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
           controlADDItem(); 
        }
    });
        
        
       document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);
        
        
        document.querySelector(DOM.inputType).addEventListener('change', Uictr.changedType);
                     
    };
    
    
    
    var updateBudget = function(){
        
        //1. Calculate the budget 
        budgerCtr.calculateBudget();
        
        //2. Return the budget
        var budget = budgerCtr.getBudget();
        
        
        //3. Display the budget on the UI 
        Uictr.displayBudget(budget);
        
        
    }
    
    
    
    var updatePercentages = function () {
        
        // 1. Calculate the percentages 
        budgerCtr.calculatePercentages();
        
        // 2. Read the percentages from the budget controller 
        var percentages = budgerCtr.getPercentage();
        
        //3. Update the UI with the new percentages 
        Uictr.displayPercentages(percentages);
    };
    
    // When the button is clicked:
    var controlADDItem = function() {
        var input, newItem;
        
        
    // 1. Get field input data
        // ////input holds all the data the user entered and will be used to add a new item.
        input = UIController.getInput();
        
        
        if (input.description !== "" && !isNaN(input.value) && input.value >0 ) {
            
        // 2. Add item to the budget controller
        ///takes the user’s input (from input.type, input.description, and input.value) and passes it to the addItem method in budgetController (aliased here as budgerCtr).
        
         newItem = budgerCtr.addItem(input.type, input.description, input.value);
        
        
        // 3. Add the item to the UI
        
        Uictr.addListItem(newItem, input.type);
        
        //4. Clear the fields
        Uictr.clearFields();
        
        // 5. Calculate the budget and update Budget 
        
       updateBudget(); 
            
        // 6. Calculate and Update percentages 
       updatePercentages();
            
        }


    };

   //DELETING ITEMS 
    var ctrDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID)  {
           //inc-1 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. Delete item from the data structure
            budgetController.deleteItem(type, ID);
            
            //2. Delete the item from the UI
             Uictr.deleteListItem(itemID);
            // 3. Update and show the new budget 
            
            updateBudget();
            
            //4. Calculate and update percentages:
            
            updatePercentages();
            
        }
    }
    
    
    
    
   return {
       init : function() {
           console.log('Application has started');
           Uictr.displayMonth();
           Uictr.displayBudget({
               budget:0,
               totalInc: 0,
               totalExp: 0,
               percentage: -1
               });
           setupeEventListeners();
       }
   };
    
})(budgetController, UIController);

controller.init();


