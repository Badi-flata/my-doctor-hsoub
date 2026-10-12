const bcryptjs =require('bcryptjs');
const Relations =require('../models/relations');
const JWT = require('jsonwebtoken');
const { where } = require('sequelize');

exports.register= async(req,res)=>{
    const {name,email,password,userType,specialization,
    location,address,wrkingHours,phone} = req.body;

    const hashPassword = await bcryptjs.hash(password,10)
    try{

    const User = await Relations.user.create({
        name,
        email,
        password:hashPassword, 
        userType,
        latitude:location.latitude,
        longitude:location.longitude 
    })      

    if(userType == 'doctor') {
        const Profile = await Relations.profile.create({
            userId: User.id,
            location,
            address,
            specialization,
            wrkingHours, 
            phone
        })
    }
    res.status(200).json({
        message:true
    })
    
}catch(e){
        res.status(500).send( 'This is CORS-enabled for all origins!' );
    }
} 




exports.login = async (req,res)=>{
    const {email,password} = req.body;
    
    try{
        const User = await Relations.user.findOne({where:{email}});

        if(!User){
            return res.status(401).json({
                message:'البريدالاكتروني او كلمة المرور غير صحيحة'
            })
        }

        const Sussecc = await bcryptjs.compare(password,User.password)
        if(!Sussecc){
            return res.status(402).json({
                message:'البريدالاكتروني او كلمة المرور غير صحيحة'
            })
        }

        const token = JWT.sign({id:User.id, name:User.name, email:User.email},process.env.JWT_SECRET )

        res.status(201).json({accessToken:token})
    }catch(e){
        res.status(501).send( 'This is CORS-enabled for all origins!');
    }
}

exports.update = async(req,res)=>{
    const {name,email,password,userType,specialization,
    location,address,wrkingHours,phone} = req.body;

    const hashPassword = await bcryptjs.hash(password,10)
    try{
    
        const User = await Relations.user.update({
            name,
            email,
            password:hashPassword, 
            userType,
            latitude:location.latitude,
            location:location.longitude 
            
        },{where:{id:req.currentUser.id}})      
    if(userType == 'doctor') {
        const Profile = await Relations.profile.update({
            address,
            specialization,
            wrkingHours, 
            phone
        },{where:{userId:req.currentUser.id}})
    }
    res.status(202).json({
        message:'تم تحديث البيانات بنجاح'
    })
    
}catch(e){
        res.status(502).send( 'This is CORS-enabled for all origins!' );
    }
}

exports.getProfile = async (req, res) => {
    try {
        const result = await Relations.user.findOne({
        where: {id: req.currentUser.id},
        include: [{model: Relations.profile, as: "profile"}],
        attributes: {exclude: ["password"]}
})
 
        res.status(203).json(result)
    }catch(e) {
        res.status(503).json(e)
}
}

exports.deleteProfile = async(req,res) =>{
    try {
        await Relations.user.destroy({
            where: {id: req.currentUser.id},
    })

        res.status(204).json({message:'تم حذف الحساب بنجاح'})
    }catch(e) {
        res.status(504).json(e)
}}


exports.me= async (req,res) => {
    try {
        const result = await Relations.user.findOne({
            where: {id: req.currentUser.id},
            include: [{model: Relations.profile, as: "profile"}],
            attributes: {exclude: ["password"]}
        })
 
        res.status(203).json(result)
    }catch(e) {
        res.status(503).json(e)
    }
}

exports.SavedMeDoctor = async (req,res) => {
    try {
        const { doctorId } = req.body;
        const userId = req.currentUser.id; // الحصول على معرف المستخدم من middleware التحقق
        
        // التحقق من عدم وجود الطبيب بالفعل في المفضلة
        const existingSaved = await Relations.savedDoctor.findOne({
          where: { userId, doctorId }
        });
        
        if (existingSaved) {
          return res.status(400).json({ message: 'الطبيب موجود بالفعل في المفضلة' });
        }
        
        // إنشاء سجل جديد
        const savedMeDoctor = await Relations.savedDoctor.create({
          userId,
          doctorId
        });
        
        res.status(201).json({ 
            message: 'تم حفظ الطبيب بنجاح',
            dataSaved:savedMeDoctor 
            });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ أثناء حفظ الطبيب' });
      }
}


exports.listMeDoctors = async (req,res) => {
    try {
        const Id = req.currentUser.id; 
        
        const whatIsKind = await Relations.user.findOne({
          where: {id: Id},
          attributes: ['userType']
        });
         // جلب المرجعين
        if (whatIsKind.userType == 'doctor') {
            const doctorId = Id
       
        // الحصول على جميع الأطباء المحفوظين مع بياناتهم
        const listMeDoctors = await Relations.savedDoctor.findAll({
          where: { doctorId:doctorId },
          include: [{
            model: Relations.user,
            as: 'user',
            attributes: { exclude: ['password'] }
          }]
        });
        
        const formattedDoctors = listMeDoctors.map(saved => saved.user);
              
        res.status(206).json(formattedDoctors);

         } else {
            const userId = Id

            const listMeDoctors = await Relations.savedDoctor.findAll({
                where: { userId:userId },
                include: [{
                  model: Relations.user,
                  as: 'doctor',
                  attributes: { exclude: ['password'] },
                  include: [{
                    model:Relations.profile,
                    as:'profile'}] // افتراض أن هناك علاقة مع جدول الملف الشخصي
                }]
              });

              const formattedDoctors = listMeDoctors.map(saved => saved.doctor);
              
              res.status(206).json(formattedDoctors);
         }
        // تنسيق البيانات للعرض
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الأطباء المفضلين' });
      }
}


exports.deleteMeDoctor = async (req,res) => {
    try {
        const { doctorId } = req.params;
        const userId = req.currentUser.id;
        
        const deleted = await Relations.savedDoctor.destroy({
          where: { userId, doctorId }
        });
        
        if (deleted) {
          res.status(206).json({ message: 'تم حذف الطبيب من المفضلة بنجاح' });
        } else {
          res.status(404).json({ message: 'الطبيب غير موجود في المفضلة' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف الطبيب من المفضلة' });
      }
}
