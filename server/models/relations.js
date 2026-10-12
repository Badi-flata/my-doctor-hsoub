const {Sequelize}= require('sequelize')
   const DB= require('./DataBase/data')
const mongoose = require('mongoose')
const user= require('./DataBase/user')
const profile= require('./DataBase/profile')
const savedDoctor = require('./DataBase/SavedDoctor')


const Relations ={
    user:user,
    profile:profile,
    savedDoctor:savedDoctor
}

Object.keys(Relations).forEach(key=>{
    if('associate' in Relations[key] ){
        Relations[key].associate(Relations)
    }
})

module.exports= Relations