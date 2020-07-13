const loginForm = document.querySelector('#loginForm')
const errorDiv = document.querySelector('#error')

loginForm.addEventListener('submit', async e => {
  e.preventDefault()

  const studentId = e.target.elements.studentId.value
  const password = e.target.elements.password.value

  const res = await fetch('/student/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId,
      password
    })
  })
  const data = await res.json()

  if (data.error) {
    errorDiv.textContent = 'Invalid Credentials, try again'
    errorDiv.style.padding = '0.3em 1em'
    return errorDiv
  }

  const {
    token
  } = data
  localStorage.setItem('token', token)

  location.href = '/student/profile'
})