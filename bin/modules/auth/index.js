const express = require('express');
const router = express.Router();
const validate = require('validate.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const model = require('../../helpers/databases/sequelize/models/index');
const wrapper = require('../../helpers/utils/wrapper');
const configs = require('../../infra/configs/global_config')
const salt = bcrypt.genSaltSync(10);

router.post('/signin', async (req, res, next) => {
  if(validate.isEmpty(req.body.email)){
    return wrapper.response(res, 404, 'ERROR', {}, 'Email cannot be empty!!')
  }

  if(validate.isEmpty(req.body.password)){
    return wrapper.response(res, 404, 'ERROR', {}, 'Password cannot be empty!!')
  }

  const dataUser = await model.users.findOne({ where: { email: req.body.email } });
  if(validate.isEmpty(dataUser)){
    return wrapper.response(res, 404, 'ERROR', {}, '<strong>Login failed</strong>, please check your email and password again!!')
  }

  const comparison = await bcrypt.compare(req.body.password, dataUser.dataValues.password)
  if(!comparison){
    return wrapper.response(res, 404, 'ERROR', {}, '<strong>Login failed</strong>, please check your email and password again!!')
  }

  const token = generateToken({username: 'miral'})
  const {name, email, role} = dataUser.dataValues;
  console.log(name);
  return wrapper.responseSignin(res, 200, 'SUCCESS', {name, email, role}, token, `Login successfully. Welcome : <strong>${name}</strong>`)
});

const generateToken = (params) => {
  return jwt.sign(params, configs.get('/token'), { expiresIn: 24 * 60 * 60 });
}

module.exports = router;