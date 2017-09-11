var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

var inquirer = require('inquirer');

var fs = require('fs');

function menu() {
  inquirer.prompt([{
    type: "list",
    message: "\nPlease choose from the following options\n",
    choices: ["Create", "Show All"],
    name: "menuOptions"
  }]).then(function(answer) {
    if(answer.menuOptions === 'Create'){
      createCard();
    } else if (answer.menuOptions === 'Show All') {
      showCards();
    }
  });
}

menu();

// Function to create new BasicCard or ClozeFlashcard
var createCard = function() {
  inquirer.prompt([
    {
      name: 'cardType',
      message: 'What type of card would you like to create?',
      type: 'list',
      choices: [{
        name: 'basic-flashcard'
      }, {
        name: 'cloze-flashcard'
      }]
    }
  ]).then(function(answer){
    if (answer.cardType === 'basic-flashcard') {
      inquirer.prompt([
        {
          name: 'front',
          message: 'What is the question?',
          validate: function(input){
            if (input === '') {
              console.log("Please provide a question...");
              return false;
            } else {
              return true;
            }
          }
        }, {
          name: 'back',
          message: 'What is the answer?',
          validate: function(input) {
            if (input === '') {
              console.log("Please provide an answer...");
              return false;
            } else {
              return true;
            }
          }
      }]).then(function(answer){
        var newBasic = new BasicCard(answer.front, answer.back);
        newBasic.create();
        whatsNext();
      });
    } else if (answer.cardType === 'cloze-flashcard') {
      inquirer.prompt([
        {
          name: 'text',
          message: 'What is the full text?',
          validate: function(input){
            if (input === ''){
              console.log("Please provide the full text");
              return false
            } else {
              return true;
            }
          }
        }, {
          name: 'cloze',
          message: 'What is the cloze portion?',
          validate: function(input){
            if (input === ''){
              console.log("Please complete the cloze portion...");
              return false;
            } else {
              return true;
            }
          }
      }]).then(function(answer){
        var text = answer.text;
        var cloze = answer.cloze;
        if(text.includes(cloze)) {
          var newCloze = new ClozeCard(text, cloze);
          newCloze.create();
          whatsNext();
        } else {
          console.log('The cloze portion you provided is not found in the full text. Please try again.');
          createCard();
        }
      });
    }
  });
}

// Gives option for whats next lists Create new card show all cards or nothing.
var whatsNext = function() {
  inquirer.prompt([
    {
      name: 'nextAction',
      message: 'What would you like to do next?',
      type: 'list',
      choices: [{
        name: 'create-new-card'
      }, {
        name: 'show-all-cards'
      }, {
        name: 'nothing'
      }]
    }
  ]).then(function(answer){
    if(answer.nextAction === 'create-new-card') {
      console.log("Okay lets create a new card!");
      addCard();
    } else if (answer.nextAction === 'show-all-cards') {
      console.log("Okay, lets take a look at your cards");
      showCards();
    } else if (answer.nextAction === 'nothing') {
      console.log("Thanks for using our service");
      return;
    }
  });
}
// Prints the cards to the console.
var showCards = function(){
  fs.readFile('./log.txt', 'utf8', function(err, data){
    if(err) {
      console.log("Error occured: " + err);
    }
    console.log(data);
    var questions = data.split(',');
    console.log(questions);
  });
};
