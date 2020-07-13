const signUpForm = document.querySelector('#signupForm')
const errorDiv = document.querySelector('#error')

signUpForm.addEventListener('submit', async e => {
  e.preventDefault()

  const firstName = e.target.elements.firstName.value
  const lastName = e.target.elements.lastName.value
  const email = e.target.elements.email.value
  const staffId = e.target.elements.staffId.value
  const department = e.target.elements.department.value
  const subject = e.target.elements.subject.value
  const password = e.target.elements.password.value

  const res = await fetch('/staff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      staffId,
      department,
      subject,
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
  location.href = '/staff/profile'
})
