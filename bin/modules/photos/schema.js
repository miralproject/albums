const joi = require('joi') 

const photo = joi.object().keys({ 
  albumId: joi.number().required(), 
  title: joi.string().required(),
  url: joi.string().required(),
  thumbnailUrl: joi.string().required(),
});

const move = joi.object().keys({ 
  toAlbum: joi.number().required(), 
  photos: joi.array().items(joi.number().required())
});

module.exports = {
  photo,
  move
};