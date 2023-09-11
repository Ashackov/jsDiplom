document.addEventListener("DOMContentLoaded", () => {
	const ticketInfo = JSON.parse(localStorage.getItem("ticketInfo"));

	function updateticketInfo() {
		document.querySelector(".ticket__title").innerHTML = ticketInfo.filmName;
		document.querySelector(".ticket__hall").innerHTML = ticketInfo.hallName;
		document.querySelector(".ticket__start").innerHTML = ticketInfo.seanceTime;

		const places = ticketInfo.salesPlaces.map((elem) => {
			return " " + elem.row + "/" + elem.place;
		});

		document.querySelector(".ticket__chairs").innerHTML = places.join(", ");

		const sumCost = ticketInfo.salesPlaces.map((elem) => {
			const price = elem.type === "vip" ? ticketInfo.priceVip : ticketInfo.priceStandart;
			return Number(price);
		});

		const cost = sumCost.reduce((sum, item) => sum + item, 0);

		document.querySelector(".ticket__cost").innerHTML = cost.toFixed(2);
	}

	function updateHallConfig() {
		const updatedHallConfigig = ticketInfo.hallConfig.replace(/selected/g, "taken");

		request(
			`event=sale_add&timestamp=${ticketInfo.seancetimestamp}&hallId=${ticketInfo.hallId}&seanceId=${ticketInfo.seanceId}&hallConfiguration=${updatedHallConfigig}`,
			() => {}
		);
	}
	updateticketInfo();
	updateHallConfig();
});