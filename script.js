const apiKey = 'IQwU3PQg3jZCMrtH95PmBuHbkk03HDvF';

document.addEventListener('DOMContentLoaded', () => {
  loadNextHoliday();

  document.getElementById('find-btn').addEventListener('click', fetchHolidays);
  document.getElementById('view-all').addEventListener('click', () => {
    document.getElementById('month-select').value = 'all';
    fetchHolidays(true);
  });
});

function fetchHolidays(showAll = false) {
  const year = document.getElementById('year-select').value;
  const month = document.getElementById('month-select').value;

  fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=LK&year=${year}`)
    .then(res => res.json())
    .then(data => {
      let holidays = data.response.holidays;
      if (!showAll && month !== 'all') {
        holidays = holidays.filter(h => h.date.datetime.month.toString().padStart(2, '0') === month);
      }

      const table = document.getElementById('holiday-table');
      table.innerHTML = '';

      if (holidays.length === 0) {
        table.innerHTML = '<tr><td colspan="4">No holidays found.</td></tr>';
        return;
      }

      holidays.forEach(h => {
        const date = new Date(h.date.iso);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        const row = `<tr>
          <td>${h.date.iso}</td>
          <td>${dayName}</td>
          <td>${h.name}</td>
          <td>${h.type[0]}</td>
        </tr>`;
        table.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('Error loading holidays:', err);
    });
}

function loadNextHoliday() {
  const year = new Date().getFullYear();
  fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=LK&year=${year}`)
    .then(res => res.json())
    .then(data => {
      const holidays = data.response.holidays;
      const today = new Date();
      const next = holidays.find(h => new Date(h.date.iso) > today);

      if (!next) {
        document.getElementById('next-holiday').innerText = 'No upcoming holidays.';
        return;
      }

      const date = new Date(next.date.iso);
      document.getElementById('next-holiday').innerHTML = `
        ${next.name} on ${next.date.iso}<br>
        ⏳ Countdown: <span id="countdown-timer"></span>
      `;
      startCountdown(date);
    });
}

function startCountdown(targetDate) {
  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("countdown-timer").textContent = "It's today!";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const m = Math.floor((distance / (1000 * 60)) % 60);
    const s = Math.floor((distance / 1000) % 60);

    document.getElementById("countdown-timer").textContent = `${d}d ${h}h ${m}m ${s}s`;
  }

  update();
  setInterval(update, 1000);
}


  