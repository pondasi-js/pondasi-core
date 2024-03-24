const Json = async (req, res, next) => {
	if (req.headers["content-type"] === "application/json" && !req.body) {
		try {
			await new Promise((resolve, reject) => {
				let data = "";
				req.on("data", (chunk) => {
					data += chunk;
				});
				req.on("end", () => {
					try {
						req.body = JSON.parse(data);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
			});
		} catch (_) {
			res.setStatus(400);
			res.setContentType("application/json");
			res.send({ message: "Invalid JSON" });
			return;
		}
	}
	next();
};

const PlainText = async (req, res, next) => {
	if (req.headers["content-type"] === "text/plain" && !req.body) {
		try {
			await new Promise((resolve) => {
				let data = "";
				req.on("data", (chunk) => {
					data += chunk;
				});
				req.on("end", () => {
					req.body = data;
					resolve();
				});
			});
		} catch (_) {
			res.setStatus(400);
			res.setContentType("application/json");
			res.send({ message: "Invalid Plain Text" });
			return;
		}
	}
	next();
};

const UrlEncoded = async (req, res, next) => {
	if (
		req.headers["content-type"] === "application/x-www-form-urlencoded" &&
		!req.body
	) {
		try {
			await new Promise((resolve) => {
				let data = "";
				req.on("data", (chunk) => {
					data += chunk;
				});
				req.on("end", () => {
					const buffer = {};
					for (const [key, value] of new URLSearchParams(data).entries()) {
						if (!buffer[key]) {
							buffer[key] = value;
						} else {
							if (!Array.isArray(buffer[key])) {
								buffer[key] = [buffer[key]];
							}
							buffer[key].push(value);
						}
					}
					req.body = buffer;
					resolve();
				});
			});
		} catch (_) {
			res.setStatus(400);
			res.setContentType("application/json");
			res.send({ message: "Invalid URL Encoded" });
			return;
		}
	}
	next();
};

module.exports = {
	Json,
	PlainText,
	UrlEncoded,
};
