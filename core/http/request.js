const parse = (req) => {
	const headers = {};
	for (const [key, value] of Object.entries(req.headers)) {
		headers[key.toLowerCase()] = value;
	}
	const query = {};
	const url = new URL(req.url, `http://${req.headers.host}`);
	for (const [key, value] of url.searchParams) {
		query[key] = value;
	}
	(req.path = url.pathname), (req.headers = headers), (req.query = query);
};

module.exports = {
	parse,
};
