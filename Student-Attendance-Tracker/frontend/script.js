const API_BASE = 'http://localhost:5000/api'; // backend running on port 5000

// Add a student
document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const rollNo = document.getElementById('rollNo').value;
  const className = document.getElementById('className').value;

  const response = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rollNo, class: className })
  });

  const result = await response.json();
  document.getElementById('message').innerText = response.ok ? 'Student added!' : result.error;
  e.target.reset();
});

// Fetch and list students
async function fetchStudents() {
  const res = await fetch(`${API_BASE}/students`);
  const students = await res.json();

  const listDiv = document.getElementById('studentsList');
  listDiv.innerHTML = '';
  students.forEach(student => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>
        <input type="checkbox" name="attendance" value="${student._id}" checked />
        ${student.name} (${student.rollNo}) - ${student.class}
      </label>
    `;
    listDiv.appendChild(div);
  });
}

// Mark attendance
document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const checkboxes = document.querySelectorAll('input[name="attendance"]');

  const records = Array.from(checkboxes).map(cb => ({
    studentId: cb.value,
    date: today,
    status: cb.checked ? 'Present' : 'Absent'
  }));

  const res = await fetch(`${API_BASE}/attendance/mark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records })
  });

  const data = await res.json();
  document.getElementById('message').innerText = res.ok ? 'Attendance marked!' : data.error;
});
