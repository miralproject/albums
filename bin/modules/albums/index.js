const express = require('express');
const router = express.Router();
const validate = require('validate.js');
const jwt = require('../../helpers/auth/jwt');
const model = require('../../helpers/databases/sequelize/models/index');
const wrapper = require('../../helpers/utils/wrapper');
const { getPagination, getPagingData } =require('../../helpers/utils/pagination');
const validator = require('../../helpers/utils/validator');
const { album } = require('./schema');
const Op = model.Sequelize.Op;

router.get('/', async(req, res, next) => { 
  const { page, size, title } = req.query;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = getPagination(page, size);
  
  model.albums.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return wrapper.response(res, 200, 'SUCCESS', response, 'Get all data album successfully')
    }).catch(err => {
      const erroMessage = err.message || 'Data album not found';
      return wrapper.response(res, 404, 'ERROR', {}, erroMessage)
    })
});

router.get('/:id', async(req, res, next) => { 
  const id = req.params.id;
  const album = await model.albums.findOne({ where: { id: id } });
  if(validate.isEmpty(album)){
    return wrapper.response(res, 404, 'ERROR', album, 'Not result')
  }
  return wrapper.response(res, 200, 'SUCCESS', album, 'Get data album by id successfully')
});

router.post('/', jwt, validator(album), async(req, res, next) =>{
  const { title } = req.body;
  let albumId = 0;
  const totalAlbum = await model.albums.max('albumId');
  if(!validate.isEmpty(totalAlbum)){
    albumId = totalAlbum + 1;
  }
 
  const album = await model.albums.create({albumId, title});
  if(album){
    return wrapper.response(res, 201, 'SUCCESS', album, 'Created album successfully')
  }
})

router.put('/:id', jwt, validator(album), async(req, res, next) => {
  const id = req.params.id;
  const { title } = req.body;
  const albums = await model.albums.findOne({ where: { id: id } });
  if(validate.isEmpty(albums)){
    return wrapper.response(res, 404, 'ERROR', albums, 'Albums not found')
  }

  const result = await model.albums.update({title: title}, { where: { id: id } });
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', {}, 'Updated data album successfully')
  }
})

router.delete('/:id', jwt, async(req, res, next) => {
  const id = req.params.id;
  const albums = await model.albums.findOne({ where: { id: id } });
  if(validate.isEmpty(albums)){
    return wrapper.response(res, 404, 'ERROR', albums, 'Albums not found!!')
  }

  const result = await model.albums.destroy({ where: { id }})
  if(validate.isEmpty(result)){
    return wrapper.response(res, 404, 'ERROR', result, 'Deleted data albums fail, data album not found')
  }
  return wrapper.response(res, 200, 'SUCCESS', {}, 'Deleted albums successfully')
});

module.exports = router;