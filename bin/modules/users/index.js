const express = require('express');
const router = express.Router();
const validate = require('validate.js');
const bcrypt = require('bcrypt');
const jwt = require('../../helpers/auth/jwt');
const model = require('../../helpers/databases/sequelize/models/index');
const wrapper = require('../../helpers/utils/wrapper');
const { getPagination, getPagingData } =require('../../helpers/utils/pagination');
const validator = require('../../helpers/utils/validator');
const { users, usersUpdate, changePassword } = require('./schema');
const salt = bcrypt.genSaltSync(10);
const Op = model.Sequelize.Op;

router.get('/', jwt, async (req, res, next) => {
  const { page, size, name } = req.query;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  const { limit, offset } = getPagination(page, size);

  model.users.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return wrapper.response(res, 200, 'SUCCESS', response, 'Get all data users successfully')
    }).catch(err => {
      const erroMessage = err.message || 'Data users not found';
      return wrapper.response(res, 404, 'ERROR', {}, erroMessage)
    })
});

router.post('/', jwt, validator(users), async(req, res, next) => {
  const {name, email, password, gender, role} = req.body;
  const hashPassword = bcrypt.hashSync(password, salt);

  const users = await model.users.findOne({ where: { email: email } });
  if(!validate.isEmpty(users)){
    return wrapper.response(res, 404, 'ERROR', {}, 'Users already exist!!')
  }

  const result = await model.users.create({
    name,
    email,
    password: hashPassword,
    gender,
    role
  });
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', result, 'Created users successfully')
  }
});

router.put('/:id', jwt, validator(usersUpdate), async(req, res, next) => {
  const id = req.params.id;
  const { name, email, gender, role } = req.body;
  const users = await model.users.findOne({ where: { id: id } });
  if(validate.isEmpty(users)){
    return wrapper.response(res, 404, 'ERROR', users, 'Users not found!!')
  }

  const result = await model.users.update({name, email, gender, role}, { where: { id: id }});
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', {}, 'Updated data user successfully')
  }
})

router.put('/password/:id', jwt, validator(changePassword), async(req, res, next) => {
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  const users = await model.users.findOne({ where: { id: id } });
  if(validate.isEmpty(users)){
    return wrapper.response(res, 404, 'ERROR', users, 'Users not found!!')
  }

  const comparison = await bcrypt.compare(oldPassword, users.dataValues.password)
  if(!comparison){
    return wrapper.response(res, 404, 'ERROR', {}, 'Old password not match!!')
  }

  const hashPassword = bcrypt.hashSync(newPassword, salt);
  const result = await model.users.update({password: hashPassword}, { where: { id: id }});
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', {}, 'Updated password successfully')
  }
})

router.delete('/:id', jwt, async(req, res, next) => {
  const id = req.params.id;
  const users = await model.users.findOne({ where: { id: id } });
  if(validate.isEmpty(users)){
    return wrapper.response(res, 404, 'ERROR', {}, 'Users not found!!')
  }

  const result = await model.users.destroy({ where: { id }})
  if(validate.isEmpty(result)){
    return wrapper.response(res, 404, 'ERROR', result, 'Deleted data users fail, data users not found')
  }
  return wrapper.response(res, 200, 'SUCCESS', {}, 'Deleted users successfully')
});

module.exports = router;