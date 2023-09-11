document.addEventListener("DOMContentLoaded", () => {
	const ticketInfo = JSON.parse(localStorage.getItem("ticketInfo"));
	renderTicket(ticketInfo);
});

function renderTicket(ticketInfo) {
	const places = ticketInfo.salesPlaces.map((elem) => ` ${elem.row}/${elem.place}`);

	document.querySelector(".ticket__title").innerHTML = ticketInfo.filmName;
	document.querySelector(".ticket__hall").innerHTML = ticketInfo.hallName;
	document.querySelector(".ticket__start").innerHTML = ticketInfo.seanceTime;
	document.querySelector(".ticket__chairs").innerHTML = places.join(", ");

	const strDate = formatDate(ticketInfo.seancetimestamp);
	const textQR = generateQRText(ticketInfo, places, strDate);

	const qr = QRCreator(textQR, {
		image: "SVG"
	});
	document.querySelector(".ticket__info-qr").append(qr.result);
}

function formatDate(timestamp) {
	const date = new Date(Number(timestamp * 1000));
	return date.toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function generateQRText(ticketInfo, places, strDate) {
	return `    
  Фильм: ${ticketInfo.filmName}
  Зал: ${ticketInfo.hallName}
  Ряд/Место${places}
  Дата: ${strDate}
  Начало сеанса: ${ticketInfo.seanceTime}
  Билет действителен строго на свой сеанс`;
}