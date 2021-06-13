const showCurrentYear = () => {
	const yearElem = document.querySelector('.year');
	const year = new Date().getFullYear();
	yearElem.textContent = year;
}

const showSkillsList = () => {
	const skillsTitle = document.querySelector('.skills__title');
	const skillsList = document.querySelector('.skills__list');
	skillsTitle.addEventListener('click', () => {
		skillsList.classList.toggle('skills__list--visible');
	});
}

showCurrentYear();
showSkillsList();