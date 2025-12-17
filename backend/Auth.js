// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("header",req.headers)
    // console.log("hello",token);
    if (!token) return res.status(401).json({ message: "Login first!" });

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;   // IMPORTANT: req.user yahi se aata hai
        console.log("decoded",decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

 