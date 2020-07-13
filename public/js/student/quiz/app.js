class UI {
  static show(element) {
    element.classList.remove('hide')
  }

  static hide(element) {
    element.classList.add('hide')
  }

  static updateInnerText(element, text) {
    element.innerText = text
  }
}

const questionDiv = document.getElementById('quiz-question')
const questionContainer = document.getElementById('question-container')
const scoreContainer = document.querySelector('.quiz-score')
const timerDiv = document.getElementById('timer')
const timeUpDiv = document.getElementById('time-out')
const secondsContainer = document.getElementById('seconds')
const minutesContainer = document.getElementById('minutes')
const timercolumn = document.getElementById('timer-column')
const answerButtons = document.querySelector('.quiz-answer-buttons')
const startButton = document.getElementById('start-btn')
const exitButton = document.getElementById('exit-btn')
const nextButton = document.getElementById('next-btn')
const submitButton = document.getElementById('submit-btn')
const footer = document.querySelector('footer')
const currentQuestionContainer = document.getElementById('current-question')
const totalQuestionsContainer = document.getElementById('total-questions')

let shuffledQuestions, CurrentQuestionIndex, score, currentQuestion, totalQuestions, seconds, minutes, interval

startButton.addEventListener('click', () => {
  minutes = 49
  seconds = 60
  startQuiz()
})

nextButton.addEventListener('click', () => {
  CurrentQuestionIndex++
  Array.from(answerButtons.children).forEach(button => {
    if (button.classList.contains('choice')) {
      if (button.dataset.correct) {
        score++
      }
    }
  })
  currentQuestion++
  setNextQuestion()
})

submitButton.addEventListener('click', async () => {
  Array.from(answerButtons.children).forEach(button => {
    if (button.classList.contains('choice')) {
      if (button.dataset.correct) {
        score++
      }
    }
  })
  endQuiz()
})

exitButton.addEventListener('click', () => {
  location.href = '/student/profile'
})

function startQuiz() {
  UI.hide(startButton)
  UI.show(questionContainer)
  UI.show(timerDiv)
  UI.hide(timeUpDiv)
  interval = setInterval(UpdateTime, 1000)
  shuffledQuestions = questions.sort(() => Math.random() - 0.5)
  CurrentQuestionIndex = 0
  score = 0
  currentQuestion = 1
  totalQuestions = shuffledQuestions.length
  setNextQuestion()
  UI.show(footer)
  UI.hide(scoreContainer)
}

function setNextQuestion() {
  resetOptions()
  showQuestion(shuffledQuestions[CurrentQuestionIndex])
  updateFooter()
}

function resetOptions() {
  UI.hide(nextButton)
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild)
  }
}

function showQuestion(question) {
  questionDiv.innerText = question.question
  question.answers.forEach(answer => {
    var button = document.createElement('button')
    button.classList.add('quiz-btn')
    UI.updateInnerText(button, answer.option)
    answerButtons.appendChild(button)
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', showAnswer)
  })
}

function showAnswer(e) {
  const selectedButton = e.target
  indicateChoice(selectedButton)
  if (shuffledQuestions.length > CurrentQuestionIndex + 1) {
    UI.show(nextButton)
  } else {
    UI.show(submitButton)
  }
}

async function endQuiz() {
  UI.hide(submitButton)
  UI.updateInnerText(startButton, 'Exit')
  UI.hide(nextButton)
  UI.hide(questionDiv)
  UI.hide(answerButtons)
  UI.updateInnerText(timeUpDiv, 'submitted successfully')
  UI.show(timeUpDiv)
  UI.hide(timerDiv)
  clearInterval(interval)
  UI.hide(footer)
  UI.show(exitButton)

  const token = localStorage.getItem('token')
  const subject = localStorage.getItem('subject')
  const res = await fetch('/score', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject,
      score
    })
  })
  const data = await res.json()
  console.log(data)
  localStorage.removeItem('subject')
}

function indicateChoice(element) {
  Array.from(answerButtons.children).forEach(button => {
    if (button.classList.contains('choice')) {
      button.classList.remove('choice')
    }
  })
  element.classList.add('choice')
}

function updateFooter() {
  UI.updateInnerText(currentQuestionContainer, currentQuestion)
  UI.updateInnerText(totalQuestionsContainer, totalQuestions)
}

function UpdateTime() {
  seconds--
  if (seconds === 0) {
    minutes--
    seconds = 59
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  displayTime(minutes, seconds)
}

async function displayTime(minutes, seconds) {
  UI.updateInnerText(secondsContainer, seconds)
  UI.updateInnerText(minutesContainer, minutes)
  UI.updateInnerText(timercolumn, ':')
  if (minutes === -1 && seconds === 59) {
    UI.updateInnerText(timeUpDiv, 'time up, submitted successfully')
    UI.show(timeUpDiv)
    UI.hide(timerDiv)
    UI.show(exitButton)
    UI.hide(nextButton)
    clearInterval(interval)
    UI.hide(footer)
    UI.hide(questionDiv)
    UI.hide(answerButtons)

    const token = localStorage.getItem('token')
    const subject = localStorage.getItem('subject')
    const res = await fetch('/score', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject,
        score
      })
    })
    const data = await res.json()
    console.log(data)
    localStorage.removeItem('subject')
  }
}

let questions = [];
(async function () {
  const token = localStorage.getItem('token')
  const subject = localStorage.getItem('subject')
  const response = await fetch(`/student/quiz/questions?subject=${subject}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  questions = [...data.question]
})()