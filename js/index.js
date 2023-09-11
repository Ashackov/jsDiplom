localStorage.clear();

document.addEventListener("DOMContentLoaded", () => {
	const dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
	const dayNumbers = document.querySelectorAll(".page-nav__day-number");
	const weekDays = document.querySelectorAll(".page-nav__day-week");
	const currentTime = new Date();
	const timestampToday = currentTime.getTime();
	currentTime.setHours(0, 0, 0);

	dayNumbers.forEach((dayNum, i) => {
		const day = new Date(currentTime.getTime() + i * 24 * 60 * 60 * 1000);
		const timestamp = Math.trunc(day / 1000);
		dayNum.innerHTML = `${day.getDate()}`;
		weekDays[i].innerHTML = dayOfWeek[`${day.getDay()}`];
		const dayLink = dayNum.parentNode;
		dayLink.dataset.timestamp = timestamp;

		dayLink.classList.remove("page-nav__day_weekend");
		if (
			weekDays[i].innerHTML === "Сб" ||
			weekDays[i].innerHTML === "Вс"
		) {
			dayLink.classList.add("page-nav__day_weekend");
		}
	});

	request("event=update", (response) => {
		const data = {};
		data.films = response.films.result;
		data.halls = response.halls.result.filter((hall) => hall.hall_open == 1);
		data.seances = response.seances.result;
		const main = document.querySelector("main");

		data.films.forEach((film) => {
			let seancesSectionHTML = "";

			data.halls.forEach((hall) => {
				const seances = data.seances.filter(
					(seance) =>
					seance.seance_hallid == hall.hall_id &&
					seance.seance_filmid == film.film_id
				);

				if (seances.length > 0) {
					seancesSectionHTML += `
          <div class="movie-seances__hall">
            <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
            <ul class="movie-seances__list">`;
					seances.forEach((seance) => {
						seancesSectionHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html" 
            data-film-id="${film.film_id}"  data-film-name="${film.film_name}" 
            data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" 
            data-price-standart="${hall.hall_price_standart}" data-price-vip="${hall.hall_price_vip}" 
            data-seance-id="${seance.seance_id}" data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
					});
					seancesSectionHTML += `  
            </ul>
          </div>`;
				}
			});
			if (seancesSectionHTML) {
				main.innerHTML += `
        <section class="movie">
          <div class="movie__info">
            <div class="movie__poster">
              <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
          </div>
          <div class="movie__description">
            <h2 class="movie__title">${film.film_name}</h2>
            <p class="movie__synopsis">${film.film_description}</p>
            <p class="movie__data">
              <span class="movie__data-duration">${film.film_duration} мин.</span>
              <span class="movie__data-origin">${film.film_origin}</span>
            </p>
          </div>
        </div>
        ${seancesSectionHTML}
      </section>`;
			}
		});
		const navDayElements = document.querySelectorAll(".page-nav__day");

		navDayElements.forEach((page) =>
			page.addEventListener("click", (event) => {
				event.preventDefault();
				document
					.querySelector(".page-nav__day_chosen")
					.classList.remove("page-nav__day_chosen");
				page.classList.add("page-nav__day_chosen");

				let selectedDaytimestamp = Number(event.target.dataset.timestamp);
				if (isNaN(selectedDaytimestamp)) {
					selectedDaytimestamp = Number(
						event.target.closest(".page-nav__day").dataset.timestamp
					);
				}
				updateSeanceStatus(selectedDaytimestamp);
			})
		);
		const movieSeances = document.querySelectorAll(".movie-seances__time");

		function updateSeanceStatus(selectedDaytimestamp) {
			movieSeances.forEach((movieSeance) => {
				const timestampSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
				const timestampSeance = selectedDaytimestamp + timestampSeanceDay;
				const timestampNow = timestampToday / 1000;
				movieSeance.dataset.seancetimestamp = timestampSeance;
				if (timestampSeance - timestampNow > 0) {
					movieSeance.classList.remove("acceptin-button-disabled");
				} else {
					movieSeance.classList.add("acceptin-button-disabled");
				}
			});
		}
		navDayElements[0].click();

		movieSeances.forEach((movieSeance) =>
			movieSeance.addEventListener("click", (event) => {
				const ticketInfo = event.target.dataset;
				ticketInfo.hallConfig = data.halls.find(
					(hall) => hall.hall_id == ticketInfo.hallId
				).hall_config;
				localStorage.setItem("ticketInfo", JSON.stringify(ticketInfo));
			})
		);
	});
});