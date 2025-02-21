require('dotenv').config();

const axios = require('axios');

const smsOtpSend = async (receptor, code) => {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${receptor}&token=${code}&template=psiketCode`;
  try {
    const axiosResponse = await axios.get(url);
    const serverResponse = axiosResponse.data;
    return true;
  } catch (e) {
    return false;
  }
};

const smsPasswdSend = async (receptor, code) => {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${receptor}&token=${code}&template=psiketPassword`;
  try {
    const axiosResponse = await axios.get(url);
    const serverResponse = axiosResponse.data;
    return true;
  } catch (e) {
    return false;
  }
};
module.exports = {
  smsOtpSend,
  smsPasswdSend,
};
