const studentBtn = document.querySelector('#student')
const staffBtn = document.querySelector('#staff')

studentBtn.addEventListener('click', () => {
  location.href = '/student/login'
})

staffBtn.addEventListener('click', () => {
  location.href = '/staff/login'
})