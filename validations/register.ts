import validator = require('express-validator')

export const registerValidations = [
  validator
    .body('email', 'enter e-mail')
    .isEmail()
    .withMessage('Wrong E-mail')
    .isLength({
      min: 10,
      max: 40,
    })
    .withMessage('Wrong Email size, size should be between 10 and 40 characters'),
  validator
    .body('fullname', 'enter name')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Wrong size, size should be between 2 and 40 characters'),
  validator
    .body('username', 'enter login')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Wrong size, size should be between 2 and 40 characters'),
  validator
    .body('password', 'enter password')
    .isString()
    .isLength({
      min: 8,
    })
    .withMessage('Wrong size, size should be min 8 characters')
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error('Passwords do not match')
      } else {
        return value
      }
    }),
]
