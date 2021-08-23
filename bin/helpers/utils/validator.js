const Joi = require('joi'); 
const validator = (schema, property) => { 
  return (req, res, next) => { 
  const { error } = Joi.validate(req.body, schema); 
  const valid = error == null; 

  if (valid) { 
    next(); 
  } else { 
    const { details } = error; 
    const message = details.map(i => i.message).join(',');
    console.log("error", message); 
    res.send({
      'code': 422,
      'status': 'ERROR',
      'data': null,
      'message': message
    })
  } }
} 
module.exports = validator;