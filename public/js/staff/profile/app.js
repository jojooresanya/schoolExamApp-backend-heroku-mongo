const userCourses = document.querySelector('.user-courses')
const subject = userCourses.querySelector('ul li')
const availableTestDiv = document.querySelector('.available-test')

const name = userCourses.querySelector('h3')
const signOutBtn = document.querySelector('#user-sign-out')

const setTestBtn = document.querySelector('#set-test')

document.addEventListener('DOMContentLoaded', getSubjects)
document.addEventListener('DOMContentLoaded', checkForSetTest)
signOutBtn.addEventListener('click', signOut)
setTestBtn.addEventListener('click', setTest)

const token = localStorage.getItem('token')

async function getSubjects() {
  const res = await fetch('/staff/user/subject', {
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

  subject.textContent = data.subject
}

async function signOut() {
  await fetch('/staff/user/logout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  localStorage.removeItem('token')
  location.href = '/'
}

async function setTest() {
  const res = await fetch('/staff/user/available', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (data.error) {
    return console.log(data.error)
  }

  checkForSetTest()
}

async function checkForSetTest() {
  const res = await fetch('/staff/user/available', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (data.setTest) {
    const btn = document.createElement('button')
    btn.setAttribute('id', 'stop-test')
    btn.classList = 'btn set'
    btn.textContent = 'Stop test'
    document.querySelector('#set-test').remove()
    availableTestDiv.appendChild(btn)
    btn.addEventListener('click', stopTest)
    document.querySelector('.available-tests-div h1').textContent = 'Test currently set'
  }
}

async function stopTest(e) {
  const res = await fetch('/staff/user/unavailable', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (!data.setTest) {
    const btn = document.createElement('button')
    btn.setAttribute('id', 'set-test')
    btn.classList = 'btn set'
    btn.textContent = 'Set test'
    e.target.remove()
    availableTestDiv.appendChild(btn)
    btn.addEventListener('click', setTest)
    document.querySelector('.available-tests-div h1').textContent = 'No test set'
  }
}