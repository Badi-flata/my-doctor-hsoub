const jsonwebtoken = require('jsonwebtoken');
const models = require('../models/relations');

const isLoggedIn = async (req, res, next) => {
    try {
    if(!req.headers.authorization) {
        return res.status(402).json({
            message:"لم يتم توفير رمز التحقق" 
            })
        }
 
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    req.currentUser = decoded;
    next();
    } catch(e) { 
        res.status(502).json(e.message)
}}

module.exports = isLoggedIn