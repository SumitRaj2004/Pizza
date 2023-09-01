const disableExpressJsonMiddleware = (req, res, next) => {
    // Disable express.json() for this route
    req.app.disable('express.json');
    next();
};

export default disableExpressJsonMiddleware;