'use strict';

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _inquirer = require('inquirer');

var _lib = require('./lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const cli = (0, _vorpal2.default)();

const askForQuestions = [{
  type: 'input',
  name: 'numQuestions',
  message: 'How many questions do you want in your quiz?',
  validate: input => {
    const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/);
    return pass ? true : 'Please enter a valid number!';
  }
}, {
  type: 'input',
  name: 'numChoices',
  message: 'How many choices should each question have?',
  validate: input => {
    const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/);
    return pass ? true : 'Please enter a valid number!';
  }
}];

const createQuiz = title => (0, _inquirer.prompt)(askForQuestions).then(answer => (0, _inquirer.prompt)((0, _lib.createPrompt)(answer))).then(answer => (0, _lib.createQuestions)(answer)).then(answer => (0, _lib.writeFile)(`${title}.json`, JSON.stringify(answer))).then(answer => console.log(answer)).catch(err => console.log('Error creating the quiz.', err));

const takeQuiz = (title, output) => (0, _lib.readFile)(`${title}.json`).then(answer => (0, _inquirer.prompt)(JSON.parse(answer))).then(answer => (0, _lib.writeFile)(`${output}.json`, JSON.stringify(answer))).then(answer => console.log(answer)).catch(err => console.log('Error taking quiz', err));

// TODO implement takeQuiz

const takeRandomQuiz = (() => {
  var _ref = _asyncToGenerator(function* (quizes, output, n) {
    let quizPromises = [];
    let quizQuestions = [];
    for (let quiz of quizes) {
      quizPromises.push((0, _lib.readFile)(`${quiz}.json`));
    }
    return Promise.all(quizPromises).then(function (results) {
      for (let result of results) {
        //console.log('I am in the loop' + result)
        quizQuestions.push(...JSON.parse(result));
        ///console.log(quizQuestions)
      }
    }).then(function () {
      return (0, _inquirer.prompt)((0, _lib.chooseRandom)(quizQuestions, n)).then(function (answers) {
        return (0, _lib.writeFile)(`${output}.json`, JSON.stringify(answers));
      }).then(function (answers) {
        return console.log(answers);
      });
    });
  });

  return function takeRandomQuiz(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

// TODO implement takeRandomQuiz

cli.command('create <fileName>', 'Creates a new quiz and saves it to the given fileName').action(function (input, callback) {
  // TODO update create command for correct functionality
  return createQuiz(input.fileName);
});

cli.command('take <fileName> <outputFile>', 'Loads a quiz and saves the users answers to the given outputFile').action(function (input, callback) {
  return takeQuiz(input.fileName, input.outputFile);
});

cli.command('random <outputFile> <numberOfQuestions> <fileNames...>', 'Loads a quiz or' + ' multiple quizes and selects a random number of questions from each quiz.' + ' Then, saves the users answers to the given outputFile').action(function (input, callback) {
  return takeRandomQuiz(input.fileNames, input.outputFile, input.numberOfQuestions);
});

cli.delimiter(cli.chalk['yellow']('quizler>')).show();