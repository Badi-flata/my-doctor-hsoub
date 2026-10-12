const express = require( 'express' );
const router = express.Router();
const userControl= require( '../Controller/control' )
const {userValidatorRules,validate} = require( '../middlewares/validator' ) ;
const inLoggedIn = require( '../middlewares/auth' )
const doctor = require( '../Controller/doctorControl' )


/* GET home page. */

router.post('/account/signup', userValidatorRules() , validate , userControl.register )
router.post('/account/login', userControl.login)
router.post('/account/SavedMeDoctor',inLoggedIn, userControl.SavedMeDoctor)

router.put('/account/update', inLoggedIn , userControl.update )

router.get('/account/getProfile', inLoggedIn , userControl.getProfile )
router.get('/Doctor', inLoggedIn , doctor.index )
router.get('/account/me', inLoggedIn , userControl.me )
router.get('/account/listMeDoctors', inLoggedIn , userControl.listMeDoctors )

router.delete('/account/deleteProfile', inLoggedIn , userControl.deleteProfile)
router.delete('/account/savedDoctors/:doctorId', inLoggedIn , userControl.deleteMeDoctor)

module.exports = router;