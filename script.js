const alarmAudio = document.getElementById("alarm-audio");
const ttAudio = document.getElementById("tt-audio");

let alarmTimeout = null;
let ttTimeouts = [];

document.getElementById("mode").addEventListener("change", function () {
  const alarmSection = document.getElementById("alarm-section");
  const timetableSection = document.getElementById("timetable-section");

  if (this.value === "alarm") {
    alarmSection.classList.remove("hidden");
    timetableSection.classList.add("hidden");
  } else {
    alarmSection.classList.add("hidden");
    timetableSection.classList.remove("hidden");
  }
});

document.getElementById("alarm-music").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    alarmAudio.src = URL.createObjectURL(file);
  }
});

document.getElementById("tt-music").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    ttAudio.src = URL.createObjectURL(file);
  }
});

function setAlarm() {
  clearTimeout(alarmTimeout);

  const time = document.getElementById("alarm-time").value;
  const date = document.getElementById("alarm-date").value;

  const alarmDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  if (alarmDateTime <= now) {
    document.getElementById("message").innerText = "Please choose a future time.";
    return;
  }

  const timeDiff = alarmDateTime - now;

  alarmTimeout = setTimeout(() => {
    alarmAudio.play();
    document.getElementById("message").innerText = "Alarm is ringing!";
  }, timeDiff);

  document.getElementById("message").innerText = "Alarm set successfully.";
}

function stopAlarm() {
  clearTimeout(alarmTimeout);
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  document.getElementById("message").innerText = "Alarm stopped.";
}

function setTimetable() {
  stopTimetableAlarm(); // Clear any existing

  const now = new Date();

  const workTime = new Date(now.toDateString() + ' ' + document.getElementById("work-time").value);
  const breakTime = new Date(now.toDateString() + ' ' + document.getElementById("break-time").value);
  const lunchTime = new Date(now.toDateString() + ' ' + document.getElementById("lunch-time").value);

  const times = [workTime, breakTime, lunchTime];
  const labels = ["Working Time", "Break Time", "Lunch Time"];

  times.forEach((time, index) => {
    const delay = time - now;
    if (delay > 0) {
      const timeout = setTimeout(() => {
        ttAudio.play();
        document.getElementById("message").innerText = `${labels[index]} Alarm ringing!`;
      }, delay);
      ttTimeouts.push(timeout);
    }
  });

  document.getElementById("message").innerText = "Timetable alarms set.";
}

function stopTimetableAlarm() {
  ttTimeouts.forEach(timeout => clearTimeout(timeout));
  ttTimeouts = [];
  ttAudio.pause();
  ttAudio.currentTime = 0;
  document.getElementById("message").innerText = "Timetable alarms stopped.";
}
