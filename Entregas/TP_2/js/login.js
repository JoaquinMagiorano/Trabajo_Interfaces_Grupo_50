const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    forms.forEach(f => f.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});