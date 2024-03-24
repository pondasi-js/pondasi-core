const setStatus = (res) => (status) => {
	res.status = status;
};

const setContentType = (res) => (type) => {
	res.headers = {
		...res.headers,
		"Content-Type": type,
	};
};

const send = (res) => (response) => {
	if (response instanceof Object) {
		response = JSON.stringify(response);
		res.writeHead(res.status || 200, {
			"Content-Type": "application/json",
			...res.headers,
		});
	} else {
		res.writeHead(res.status || 200, {
			"Content-Type": "text/plain",
			...res.headers,
		});
	}
	res.end(response);
};

const build = (res) => ({
	...res,
	send: send(res),
	setStatus: setStatus(res),
	setContentType: setContentType(res),
});

module.exports = {
	build,
};
