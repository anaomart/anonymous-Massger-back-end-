const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization Token Required' })
    }

    let token = authorization.split(' ')[1];
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        req._id = decoded;
        console.log({ decoded });
        next()
    } catch (error) {
        res.status(401).json({ error: error.message })
    }

}
module.exports = auth;