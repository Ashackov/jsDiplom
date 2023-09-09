function request(data, callback) {
	const method = "POST";
	const url = "https://jscp-diplom.netoserver.ru/";
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
	xhr.onload = () => {
		const object = JSON.parse(xhr.responseText);
		callback(object);
	};
}
