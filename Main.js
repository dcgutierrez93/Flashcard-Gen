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
    var waitMsg;
    switch (answer.menuOptions) {
      case 'Create':
        console.log("Okay, Lets Create a card!");
        waitMsg = setTimeOut(createCard, 1000);
        break;

      case 'Show All':
        console.log("Okay, Lets take a look at your cards!");
        waitMsg = setTimeOut(showCards, 1000);

      default:
        console.log("");
        console.log("Sorry I don't understand");
        console.log("");

    }
  });
}

menu();
// Function to create new card BasicCard or
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
    } else if (answer === 'cloze-flashcard') {
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
      addCard();
    } else if (answer.nextAction === 'show-all-cards') {
      showCards();
    } else if (answer.nextAction === 'nothing') {
      return;
    }
  });
}

var showCards = function(){
  fs.readFile('./log.txt', 'utf8', function(err, data){
    if(err) {
      console.log("Error occured: " + err);
    }
    var questions = data.split(';');
    var notBlank = function(value) {
      return value;
    };
    questions = questions.filter(notBlank);
    var count = 0;
    showQuestion(questions, count);
  });
};

var showQuestion = function(array, index){
  questions = array[index];
  var parsedQuestion = JSON.parse(questions);
  var questionText;
  var questionResponse;
  if(parsedQuestion.type === 'basic-flashcard'){
    questionText = parsedQuestion.front;
    correctResponse = parsedQuestion.back;
  } else if (parsedQuestion.type === 'cloze-flashcard') {
    questionText = parsedQuestion.clozeDeleted;
    correctResponse = parsedQuestion.cloze;
  }
  inquirer.prompt([
    {
      name: 'response',
      message: questionText
    }
  ]).then(function(answer){
    if(answer.response === correctResponse){
      console.log("Correct!");
      if(index < array.length - 1) {
        showQuestion(array, index + 1);
      }
    } else {
      console.log("Incorrect!");
      if(index < array.length - 1) {
        showQuestion(array, index + 1);
      }
    }
  });
};
