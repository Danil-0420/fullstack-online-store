const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send("Unauthorized")
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        req.user = jwt.verify(token, process.env.SECRET_KEY);

        next();
    } catch (e) {

        return res.status(401).send("Unauthorized");
    }
};