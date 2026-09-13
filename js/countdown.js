/**
 * EL QUILOMBO - COUNTDOWN TIMER
 * Calculates remaining time until October 3, 2026, 21:00:00 (Valencia Time)
 */

(function initCountdown() {
  // Target: October 3, 2026 21:00:00 (America/Caracas UTC-4)
  const targetDate = new Date('2026-10-03T21:00:00-04:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const navBadgeEl = document.getElementById('nav-cd-pill');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (navBadgeEl) navBadgeEl.textContent = '¡HOY ES LA FIESTA!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    if (navBadgeEl) {
      navBadgeEl.textContent = `3 Oct • Faltan ${days}d ${hours}h`;
    }
  }

  update();
  setInterval(update, 1000);
})();
