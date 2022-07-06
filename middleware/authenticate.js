const jwt = require('jsonwebtoken');


//authenticates the user and passes it on to the route
const authenticate = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).send("Please login");
    }

    const authToken = req.headers.authorization.split(" ")[1];

    jwt.verify(authToken, process.env.JWT_KEY, (err, decoded) => {
        if(err) {
            res.status(403).json({
                success: false,
                message: 'No Token.'
            });
        }
        
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;