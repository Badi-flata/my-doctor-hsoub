
const { body, validationResult } = require('express-validator');

const userValidatorRules = () => {
return [
    body('name').notEmpty().withMessage('اسم المستخدم مطلوب'),
    body('email').notEmpty().withMessage('البريد الإلكتروني مطلوب'),
    body('email').isEmail().withMessage('يجب عليك إدخال صيغة بريد إلكتروني صحيح'),
    body('password' ).notEmpty().withMessage('كلمة المرور مطلوبة'),
    body('password' ).isLength({min:5}).withMessage('كلمة المرور يجب أن تكون أكثر من خمسة محارف'),
]
}


const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty() ) { 
        return next()
    }

    const extacteadErrors = []

        errors.array().map(err => extacteadErrors.push({
        [err.path]:err.msg
    }))


    return res.status(400).json({errors: extacteadErrors})

}

module.exports = {
    userValidatorRules, 
    validate
}
