const {Sequelize}= require('sequelize');
const DB = require('./data');
 
// sutctar 
const User = DB.define('user',{
    name:{ 
        type:Sequelize.DataTypes.STRING,
    },
    email:{
        type:Sequelize.DataTypes.STRING,
        unique:true
    },
    password:{
        type:Sequelize.DataTypes.STRING,
    },
    userType:{
        type:Sequelize.DataTypes.ENUM('doctor','normal')
    }, 
    latitude:{
        type:Sequelize.DataTypes.FLOAT
    },
    longitude:{
        type:Sequelize.DataTypes.FLOAT
    },
}
)

User.associate = Relations =>{
    User.hasOne(Relations.profile)

     // علاقة المستخدم العادي مع الأطباء المحفوظين
    User.hasMany(Relations.savedDoctor, {
        foreignKey: 'userId',
        as: 'user'
    });
    
    // علاقة الطبيب مع المستخدمين الذين قاموا بحفظه
    User.hasMany(Relations.savedDoctor, {
        foreignKey: 'doctorId',
        as: 'doctor'
    });
}
          
/* 
const mongoose= require('mongoose')
const { ENUM, FLOAT } = require('sequelize')

const ModelSchema= new mongoose.Schema({
    name:{ 
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    userType:{
        type:ENUM('doctor','normal')
    },
    latiude:{
        type:Number 
    },
    userType:{
        type:String
    },} )

 ModelSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:(doc,ret)=>{
        delete ret._id
    }
 })

const User = mongoose.model( 'user', ModelSchema)
 
 */
module.exports= User