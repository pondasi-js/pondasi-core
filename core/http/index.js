const http = require("http");
const { parse } = require("./request");
const { build } = require("./response");
const { handlers, registerHandler } = require("./handler");

const use = (path, handler) => registerHandler("USE", path, handler);
const get = (path, handler) => registerHandler("GET", path, handler);
const post = (path, handler) => registerHandler("POST", path, handler);
const put = (path, handler) => registerHandler("PUT", path, handler);
const del = (path, handler) => registerHandler("DELETE", path, handler);
const patch = (path, handler) => registerHandler("PATCH", path, handler);

const dispatch = async (handlerList, req, res) => {
	const handler = handlerList.shift();
	if (handler) {
		if (
			handler.handler.length === 3 ||
			(handler.handler.length === 2 && handler.path === req.path)
		) {
			await handler.handler(req, build(res), () =>
				dispatch(handlerList, req, res)
			);
			res.end();
		} else {
			await dispatch(handlerList, req, res);
		}
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not Found");
	}
};

const serve = ({ port }) => {
	const server = http.createServer(async (req, res) => {
		parse(req);
		const handlerList = handlers.filter((handler) => {
			if (handler.method === "USE" || handler.method === req.method) {
				return req.path.startsWith(handler.path);
			}
		});
		await dispatch(handlerList, req, res);
	});

	return new Promise((resolve) => {
		server.listen(port || 3000, resolve);
	});
};

module.exports = {
	use,
	get,
	post,
	put,
	del,
	patch,
	serve,
};
