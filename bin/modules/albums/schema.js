const joi = require('joi') 

const album = joi.object().keys({ 
  title: joi.string().required(), 
});

module.exports = {
  album
};