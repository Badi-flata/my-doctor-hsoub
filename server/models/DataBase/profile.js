const {Sequelize}= require('sequelize');
const DB = require('./data');
 
// sutctar 
const Profile = DB.define('profile',{
    specialization:{
        type:Sequelize.DataTypes.STRING
    },
    address:{
        type:Sequelize.DataTypes.STRING,
    },
    wrkingHours:{
        type:Sequelize.DataTypes.STRING,
    },
    phone:{
        type:Sequelize.DataTypes.STRING,
    },

}
)

Profile.associate = Realions =>{
    Profile.belongsTo(Realions.user)
}

/* 
const mongoose= require('mongoose')

const ModelSchema= new mongoose.Schema({
    specialization:{
        type:String,
    },
    address:{
        type:String,
    },
    wrkingHours:{
        type:String,
    },
    phone:{
        type:String,
    },
},
{ timestamps:true} )

 ModelSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:(doc,ret)=>{
        delete ret._id
    }
 })

const Profile= mongoose.model( 'Profile', ModelSchema)
 */


module.exports= Profile
