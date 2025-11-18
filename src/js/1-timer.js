import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

startBtn.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        const pickedDate = selectedDates[0];

        if (pickedDate <= Date.now()) {
            iziToast.error({
                message: "Please choose a date in the future",
            });
            startBtn.disabled = true;
            return;
        }

        userSelectedDate = pickedDate;
        startBtn.disabled = false;
    },
};

flatpickr(input, options);

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    input.disabled = true;

    intervalId = setInterval(() => {
        const timeLeft = userSelectedDate - Date.now();

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            input.disabled = false;
            return;
        }

        const converted = convertMs(timeLeft);
        updateUI(converted);
    }, 1000);
});


function updateUI({ days, hours, minutes, seconds }) {
    daysEl.textContent = days;
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

