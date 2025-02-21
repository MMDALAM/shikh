const Joi = require('joi');

const cooperationSchema = Joi.object({
  firstName: Joi.string().lowercase().required().messages({
    'string.empty': ' نام نمیتواند خالی بماند ',
  }),
  lastName: Joi.string().lowercase().required().messages({
    'string.empty': ' نام خانوادگی نمیتواند خالی بماند ',
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
  email: Joi.string().email().required().messages({
    'string.empty': 'ایمیل نمی‌تواند خالی باشد',
    'string.email': 'ایمیل به درستی وارد نشده است',
  }),
  birthDate: Joi.string().lowercase().required().messages({
    'string.empty': ' تاریخ تولد نمیتواند خالی بماند ',
  }),
  gender: Joi.string().lowercase().required().messages({
    'string.empty': ' جنسیت نمیتواند خالی بماند ',
  }),
  province: Joi.string().lowercase().required().messages({
    'string.empty': ' استان نمیتواند خالی بماند ',
  }),
  city: Joi.string().lowercase().required().messages({
    'string.empty': ' شهر نمیتواند خالی بماند ',
  }),
  typeWork: Joi.allow(),
  major: Joi.string().lowercase().required().messages({
    'string.empty': ' رشته تحصیلی نمیتواند خالی بماند ',
  }),
  uniRecords: Joi.allow(),
  workRecords: Joi.allow(),
  langLevel: Joi.allow(),
  softLevel: Joi.allow(),
  moreWork: Joi.allow(),
});

module.exports = {
  cooperationSchema,
};
