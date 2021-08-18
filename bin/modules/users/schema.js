const joi = require('joi') 

const users = joi.object().keys({ 
  name: joi.string().required(), 
  email: joi.string().trim().email({ minDomainAtoms: 2 }).required(),
  password: joi.string().required(),
  gender: joi.boolean().default(true).required(), 
  role: joi.number().required()  
});

const usersUpdate = joi.object().keys({ 
  name: joi.string().required(), 
  email: joi.string().trim().email({ minDomainAtoms: 2 }).required(),
  gender: joi.boolean().default(true).required(), 
  role: joi.number().required()  
});

const changePassword = joi.object().keys({ 
  oldPassword: joi.string().required(),
  newPassword: joi.string().required(),
  retypePassword: joi.ref('newPassword'),
});

module.exports = {
  users,
  usersUpdate,
  changePassword
};