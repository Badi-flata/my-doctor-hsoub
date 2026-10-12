const Sequelize = require('sequelize')
const Relations = require('../models/relations');

const Op = Sequelize.Op;

exports.index = async (req, res) => {
    let {q} = req.query;
    const searchQuery = q ? {name: {[Op.like]: `%${q.replace(' ', '')}%`}}:{}; 
    try {
        const doctors = await Relations.user.findAll({
        where: {userType: 'doctor', ...searchQuery},
        include: [{model: Relations.profile, as: "profile"}],
        attributes: {exclude: ['password']} 
    })
        res.status(200).json(doctors)
    } catch (e) {
        res.status(500).json(e)}
}