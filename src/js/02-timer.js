import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const btnStart = document.querySelector('button[data-start]');
const day = document.querySelector('[data-days]');
const hour = document.querySelector('[data-hours]');
const minute = document.querySelector('[data-minutes]');
const second = document.querySelector('[data-seconds]');
const inputData = document.querySelector('#datetime-picker');
btnStart.disabled = true;
let timerId = null;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    btnStart.disabled = false;
  },
};

flatpickr(inputData, options);

btnStart.addEventListener('click', startCount);

function startCount() {
  inputData.disabled = true;
  btnStart.disabled = true;
  timerId = setInterval(() => {
    const selectedDates = new Date(inputData.value);
    const remainingTime = convertMs(selectedDates - new Date());
    day.textContent = addLeadingZero(remainingTime.days);
    hour.textcontent = addLeadingZero(remainingTime.hours);
    minute.textContent = addLeadingZero(remainingTime.minutes);
    second.textContent = addLeadingZero(remainingTime.seconds);
    if (
      remainingTime.days === 0 &&
      remainingTime.hours === 0 &&
      remainingTime.minutes === 0 &&
      remainingTime.seconds === 0
    ) {
      Notify.success('The timer has expired');
      clearInterval(timerId);
      inputData.disabled = false;
    }
  }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
