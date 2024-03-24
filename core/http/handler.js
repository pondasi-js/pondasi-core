const handlers = [];
const registerHandler = (method, path, handler) => {
	handlers.push({ method, path, handler });
};

module.exports = {
	registerHandler,
	handlers,
};
