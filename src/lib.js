import fs from 'fs'

let hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

const readFile = fileName =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })

const writeFile = (fileName, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, err => {
      if (err) {
        reject(err)
      }
      resolve('File saved successfully')
    })
  })

  
const makeChoice = (questionNumber, choiceNumber) => {
  let choice = {
      type: 'input',
      name: `question-${(questionNumber)}-choice-${(choiceNumber)}`,
      message: `Enter answer choice ${(choiceNumber)} for question ${(questionNumber)}`
  }
  return choice
}


const makeQuestion = (questionNumber) => {
  let question = {
      type: 'input',
      name: `question-${(questionNumber)}`,
      message: `Enter question ${(questionNumber)}`
  }
  return question


}

const makeQuestionChoice = (numQuestions, numChoices) => {
  let questionArray = []
  for (let i = 1; i <= numQuestions; i++) {
      questionArray.push(makeQuestion(i))
      for (let j = 1; j <= numChoices; j++) {
          questionArray.push(makeChoice(i, j))
      }
  }
  return questionArray
}

const fillInQuestion = (array) => {
  let question = {
      type: 'list',
      name: array[0],
      message: array[1],
      choices: array.slice(2)
  }
  return question
}
// TODO copy chooseRandom() from previous assignment
const chooseRandom = (array = [], numItems) => {
  if (array.length < 2) {
    return array
  }

  if (array.length < numItems || numItems < 1) {
    numItems = Math.floor(Math.random() * array.length) + 1
  }

  let randomIndicies = []
  let counter = 0

  while (counter < numItems) {
    let newIndex = Math.floor(Math.random() * numItems)
    if (!(randomIndicies.includes(newIndex))) {
      randomIndicies.push(newIndex)
      counter++
    }
  }

  let returnArray = []

  for (let index of randomIndicies) {
    returnArray.push(array[index])
  }

  return returnArray
}

// TODO copy createPrompt() from previous assignment
const createPrompt = (args = {}) =>{
  let { numQuestions = 1, numChoices = 2 } = args
  if(isEmpty(args) || !numQuestions || !numChoices || numQuestions < 1 || numChoices < 2){
    args = {
      numQuestions: 1,
      numChoices: 2
    }
  }
   
   return makeQuestionChoice(numQuestions, numChoices)
}  
  

// TODO implement createQuestions()
const createQuestions = (questions) => {
   if(!questions){
       return []
   }
  let returnArray = []
  let numberOfKeys = Object.keys(questions).length
  let questionArray = []
  let counter = 1
  for (let property in questions) {
      if (!(property.includes('choice'))) {
          if (counter > 1) {
              returnArray.push(fillInQuestion(questionArray))
          }
          questionArray = []
          questionArray.push(property)
          questionArray.push(questions[property])
      } else {
          questionArray.push(questions[property])
          if (counter === numberOfKeys) {
              returnArray.push(fillInQuestion(questionArray))
          }

      }
      counter++
  }
  
  //console.log(returnArray)
  return returnArray
}

 console.log(createPrompt({}))
 console.log(createPrompt(undefined))
 console.log(createPrompt({numQuestions: 1, numChoices: 1}))

console.log(createQuestions({'question-1': '',
    'question-1-choice-1': '',
    'question-1-choice-2': '',
    'question-2': '',
    'question-2-choice-1': '',
    'question-2-choice-2': ''}))

export {chooseRandom, createPrompt, createQuestions}

// TODO copy your readFile, writeFile, chooseRandom, createPrompt, and createQuestions
// functions from your notes and assignments.

// TODO export your functions
