import { check } from 'express-validator'

const createValidator = () => {
    return [
      check('name').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
      check('surname').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
      check('email').exists({ checkNull: true, checkFalsy: true }).isString().isEmail().trim().escape(),
      check('password').exists({ checkNull: true, checkFalsy: true }).isString().isStrongPassword({ minLength: 5 }),
      check('preferredLanguage').optional().isLocale().trim().escape(),
      check('phone').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
      check('address').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
      check('photo').optional().isBase64(),
      check('role').exists({ checkNull: true, checkFalsy: true }).isString().isIn(['CUSTOMER', 'CLERK', 'ADMINISTRATOR'])
    ]
}

export { createValidator }
