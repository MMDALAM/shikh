const Joi = require('joi');
const { httpResponseError } = require('../utils/httpResponse');

const loginSchema = Joi.object({
  mobile: Joi.string().min(1).max(20).required().messages({
    'string.min': 'نام کاربری نمیتواند کمتر از 1 کاراکتر باشد',
    'string.max': 'نام کاربری نمیتواند بیشتر از 20 کاراکتر باشد',
    'string.empty': 'نام کاربری نمیتواند خالی باشد ',
  }),
  password: Joi.string().min(7).max(20).required().messages({
    'string.min': 'رمز عبور نمیتواند کمتر از 8 کاراکتر باشد',
    'string.max': 'رمز عبور نمیتواند بیشتر از 20 کاراکتر باشد',
    'string.empty': 'رمزعبور نمیتواند خالی باشد ',
  }),
});

const registerSchema = Joi.object({
  firstName: Joi.string().required().max(35).messages({
    'string.empty': ' نام شما نمیتواند خالی بماند ',
    'string.max': ' نام شما نمیتواند بیشتر از 35 کاکتر باشد  ',
  }),
  lastName: Joi.string().required().max(35).messages({
    'string.empty': ' نام خانوادگی شما نمیتواند خالی بماند ',
    'string.max': ' نام خانوادگی شما نمیتواند بیشتر از 35 کاکتر باشد  ',
  }),
  mobile: Joi.string()
    .lowercase()
    .pattern(/^09[0-9]{9}$/)
    .message(' شماره موبایل را با 0 و صحیح وارد کنید ')
    .required()
    .messages({
      'string.pattern': ' شماره موبایل را با 0 و صحیح وارد کنید ',
      'string.empty': ' شماره موبایل را با 0 و صحیح وارد کنید ',
    }),
  email: Joi.string().email().message('ایمیل را صحیح وارد کنید'),
  password: Joi.string().min(7).max(20).required().messages({
    'string.min': 'رمز عبور نمیتواند کمتر از 8 کاراکتر باشد',
    'string.max': 'رمز عبور نمیتواند بیشتر از 20 کاراکتر باشد',
    'string.empty': 'رمزعبور نمیتواند خالی باشد ',
  }),
  passwordCheck: Joi.string().min(7).max(20).required().valid(Joi.ref('password')).messages({
    'string.min': 'رمز عبور نمیتواند کمتر از 8 کاراکتر باشد',
    'string.max': 'رمز عبور نمیتواند بیشتر از 20 کاراکتر باشد',
    'string.empty': 'رمزعبور نمیتواند خالی باشد',
    'any.only': 'رمز عبور با تکرار آن باید یکسان باشند',
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
};
