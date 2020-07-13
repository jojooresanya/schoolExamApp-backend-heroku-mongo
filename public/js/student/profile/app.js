const userCourses = document.querySelector('.user-courses')
const Subjects = Array.from(userCourses.querySelector('ul').children)
const name = userCourses.querySelector('h3')
const signOutBtn = document.querySelector('#user-sign-out')
const availableTestsDiv = document.querySelector('.available-tests')

document.addEventListener('DOMContentLoaded', getSubjects)
document.addEventListener('DOMContentLoaded', getTests)
signOutBtn.addEventListener('click', signOut)

const token = localStorage.getItem('token')

async function getSubjects() {
  const res = await fetch('/student/user/courses', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (data.error) {
    return console.log(data.error)
  }

  name.textContent = data.name

  for (let i = 0; i < Subjects.length; i++) {
    Subjects[i].textContent = data.subjects[i].subject
  }
}

async function signOut() {
  await fetch('/student/user/logout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  localStorage.removeItem('token')
  location.href = '/'
}

async function getTests() {
  const res = await fetch('/student/user/tests/available', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()

  if (data.error) {
    return console.log(data.error)
  }

  if (data.available.length === 0) {
    availableTestsDiv.previousElementSibling.textContent = 'No available tests'
  } else {
    const availableTests = data.available.map(available => {
      return `
      <div class="available-test">
        <p>${available.subject}</p>
        <button class="btn start">Start</button>
      </div>
    `
    }).join('')

    availableTestsDiv.innerHTML = availableTests

    const startBtns = [...document.querySelectorAll('.start')]
    startBtns.forEach(btn => btn.addEventListener('click', startTest))
  }
}

async function startTest(e) {
  const subject = e.target.previousElementSibling.textContent
  localStorage.setItem('subject', subject)
  location.href = '/student/quiz'

  await fetch('/student/user/tests/unavailable', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject
    })
  })
}