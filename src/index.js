import vorpal from 'vorpal'
import { prompt } from 'inquirer'

import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions
} from './lib'

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

const createQuiz = title =>
  prompt(askForQuestions)
    .then(answer =>
      prompt(createPrompt(answer)))
    .then(answer =>
      createQuestions(answer))
    .then(answer =>
      writeFile(`${title}.json`, JSON.stringify(answer)))
    .then(answer =>
      console.log(answer)
    )
    .catch(err => console.log('Error creating the quiz.', err)
    )


const takeQuiz = (title, output) =>
  readFile(`${title}.json`)
    .then(answer =>
      prompt(JSON.parse(answer)))
    .then(answer =>
      writeFile(`${output}.json`, JSON.stringify(answer)))
    .then(answer =>
      console.log(answer))
      .catch(err => console.log('Error taking quiz', err))


// TODO implement takeQuiz

const takeRandomQuiz = async (quizes, output, n) => {
  let quizPromises = [] 
  let quizQuestions = []
  for(let quiz of quizes){
    quizPromises.push(readFile(`${quiz}.json`))
  }
  return Promise.all(quizPromises).then(results =>{
  for(let result of results){
    //console.log('I am in the loop' + result)
    quizQuestions.push(...JSON.parse(result))
    ///console.log(quizQuestions)
  }
   
})
.then(() =>
  prompt(chooseRandom(quizQuestions, n))
  .then(answers =>
    writeFile(`${output}.json`, JSON.stringify(answers)))
    .then(answers =>
      console.log(answers))
)
  
  
}



// TODO implement takeRandomQuiz

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    // TODO update create command for correct functionality
    return createQuiz(input.fileName)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeQuiz(input.fileName, input.outputFile)
  })

cli
  .command(
    'random <outputFile> <numberOfQuestions> <fileNames...>',
    'Loads a quiz or' +
    ' multiple quizes and selects a random number of questions from each quiz.' +
    ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeRandomQuiz(input.fileNames, input.outputFile, input.numberOfQuestions)
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()


