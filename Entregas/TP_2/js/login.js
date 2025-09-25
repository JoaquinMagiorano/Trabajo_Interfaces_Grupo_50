document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            const targetForm = document.getElementById(targetId);
            const currentActiveForm = document.querySelector('.form.active');
            if (currentActiveForm === targetForm) return;

            // Cambiar clase active en tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Cambiar clase active en formularios
            forms.forEach(f => f.classList.remove('active'));
            targetForm.classList.add('active');
        });
    });
});
