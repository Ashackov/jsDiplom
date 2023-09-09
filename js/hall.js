const ticketInfo = JSON.parse(localStorage.getItem("ticketInfo"));

document.addEventListener("DOMContentLoaded", () => {
	const confStepWrapperElement = document.querySelector(".conf-step__wrapper");
	const buyingInfoTitleElement = document.querySelector(".buying__info-title");
	const buyingInfoStartElement = document.querySelector(".buying__info-start");
	const buyingInfoHallElement = document.querySelector(".buying__info-hall");
	const priceStandart = document.querySelector(".price-standart");

	const acceptinButtonElement = document.querySelector(".acceptin-button");

	buyingInfoTitleElement.innerHTML = ticketInfo.filmName;
	buyingInfoStartElement.innerHTML = `Начало сеанса ${ticketInfo.seanceTime}`;
	buyingInfoHallElement.innerHTML = ticketInfo.hallName;
	priceStandart.innerHTML = ticketInfo.priceStandart;

	request(
		`event=get_hallConfig&timeStamp=${ticketInfo.seancetimeStamp}&hallId=${ticketInfo.hallId}&seanceId=${ticketInfo.seanceId}`,
		(response) => {
			console.log(response);
			if (response) {
				ticketInfo.hallConfig = response;
			}
			confStepWrapperElement.innerHTML = ticketInfo.hallConfig;

			console.log(ticketInfo);

			const chairs = document.querySelectorAll(
				".conf-step__row .conf-step__chair"
			);
			let chairsSelected = document.querySelectorAll(
				".conf-step__row .conf-step__chair_selected"
			);
			if (chairsSelected.length) {
				acceptinButtonElement.removeAttribute("disabled");
			} else {
				acceptinButtonElement.setAttribute("disabled", true);
			}
			chairs.forEach((chair) => {
				chair.addEventListener("click", (event) => {
					if (event.target.classList.contains("conf-step__chair_taken")) return;
					event.target.classList.toggle("conf-step__chair_selected");
					chairsSelected = document.querySelectorAll(
						".conf-step__row .conf-step__chair_selected"
					);
					if (chairsSelected.length) {
						acceptinButtonElement.removeAttribute("disabled");
					} else {
						acceptinButtonElement.setAttribute("disabled", true);
					}
				});
			});
		}
	);

	acceptinButtonElement.addEventListener("click", (event) => {
		event.preventDefault();
		const selectedSeats = [];
		const rows = Array.from(document.querySelectorAll(".conf-step__row"));

		for (let i = 0; i < rows.length; i++) {
			const places = Array.from(rows[i].querySelectorAll(".conf-step__chair"));
			for (let j = 0; j < places.length; j++) {
				if (places[j].classList.contains("conf-step__chair_selected")) {
					places[j].classList.replace(
						"conf-step__chair_selected",
						"conf-step__chair_taken"
					);
					const seatType = places[j].classList.contains(
							"conf-step__chair_standart"
						) ?
						"standart" :
						"vip";

					selectedSeats.push({
						row: i + 1,
						place: j + 1,
						type: seatType,
					});
				}
			}
		}

		const updatedHallConfig = document.querySelector(".conf-step__wrapper").innerHTML;

		ticketInfo.hallConfig = updatedHallConfig;
		ticketInfo.salesPlaces = selectedSeats;
		localStorage.clear();
		localStorage.setItem("ticketInfo", JSON.stringify(ticketInfo));
		const linkPay = document.createElement("a");
		linkPay.href = "payment.html";
		linkPay.click();
	});
});