const coursesBtn = [...document.querySelectorAll('.select')]

coursesBtn.forEach(btn => btn.addEventListener('click', saveCourses))

async function saveCourses() {
  const department = this.previousElementSibling.previousElementSibling.innerText
  const subjects = []
  Array.from(this.previousElementSibling.children).forEach(li => {
    subjects.push(li.innerText)
  })

  const token = localStorage.getItem('token')

  const res = await fetch('/student/user/courses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      department,
      subjects
    })
  })
  const data = await res.json()

  if (data.error) {
    return console.log(data.error)
  }
  location.href = '/student/profile'
}