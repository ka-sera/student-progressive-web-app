var students = [];
var listEl = document.getElementById('student-list');
var emptyEl = document.getElementById('empty');
var searchEl = document.getElementById('search');
var filterEl = document.getElementById('course-filter');
var noteEl = document.getElementById('source-note');
var statusEl = document.getElementById('net-status');

/* ---------- 1. Display student information ---------- */
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initials(name) {
  return name.split(' ').map(function (w) { return w.charAt(0); }).slice(0, 2).join('').toUpperCase();
}

function render() {
  var term = searchEl.value.trim().toLowerCase();
  var course = filterEl.value;

  var visible = students.filter(function (s) {
    var text = (s.name + ' ' + s.regNo + ' ' + s.course).toLowerCase();
    return text.indexOf(term) !== -1 && (course === '' || s.course === course);
  });

  listEl.innerHTML = visible.map(function (s) {
    return '<article class="card">' +
      '<div class="avatar">' + escapeHtml(initials(s.name)) + '</div>' +
      '<h3>' + escapeHtml(s.name) + '</h3>' +
      '<p>' + escapeHtml(s.regNo) + '</p>' +
      '<p class="course">' + escapeHtml(s.course) + '</p>' +
      '<p>Year ' + Number(s.year) + '</p>' +
      '<p>' + escapeHtml(s.email) + '</p>' +
      '</article>';
  }).join('');

  emptyEl.hidden = visible.length !== 0;
}

function fillCourseFilter() {
  var courses = [];
  students.forEach(function (s) { if (courses.indexOf(s.course) === -1) { courses.push(s.course); } });
  courses.sort().forEach(function (c) {
    var option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    filterEl.appendChild(option);
  });
}

function loadStudents() {
  fetch('students.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('Bad response'); }
      return res.json();
    })
    .then(function (data) {
      students = data;
      localStorage.setItem('students-backup', JSON.stringify(data));  // extra offline copy
      noteEl.textContent = navigator.onLine
        ? students.length + ' students loaded.'
        : students.length + ' students loaded from the saved offline copy.';
    })
    .catch(function () {
      // Last resort: the copy kept in localStorage
      var backup = localStorage.getItem('students-backup');
      students = backup ? JSON.parse(backup) : [];
      noteEl.textContent = students.length
        ? 'Offline: showing the last saved copy.'
        : 'No data saved yet. Connect to the internet once to load the students.';
    })
    .then(function () {
      fillCourseFilter();
      render();
    });
}

searchEl.addEventListener('input', render);
filterEl.addEventListener('change', render);

/* ---------- 4. Online / offline indicator ---------- */
function updateNetworkStatus() {
  var online = navigator.onLine;
  statusEl.textContent = online ? 'Online' : 'Offline';
  statusEl.className = 'badge ' + (online ? 'badge-online' : 'badge-offline');
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

/* ---------- Tabs ---------- */
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.panel').forEach(function (p) { p.hidden = true; });
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).hidden = false;
  });
});

/* ---------- 5. Install button ---------- */
var deferredPrompt = null;
var installBar = document.getElementById('install-bar');

window.addEventListener('beforeinstallprompt', function (event) {
  event.preventDefault();          // stop the browser's default mini-bar
  deferredPrompt = event;          // keep it so our own button can show it
  installBar.hidden = false;
});

document.getElementById('install-btn').addEventListener('click', function () {
  if (!deferredPrompt) { return; }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function () {
    deferredPrompt = null;
    installBar.hidden = true;
  });
});

window.addEventListener('appinstalled', function () { installBar.hidden = true; });

/* ---------- 3. Register the service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js')
      .then(function (reg) { console.log('Service worker registered. Scope:', reg.scope); })
      .catch(function (err) { console.error('Service worker failed:', err); });
  });
}

loadStudents();
