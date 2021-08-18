const express = require('express');
const router = express.Router();
const validate = require('validate.js');
const jwt = require('../../helpers/auth/jwt');
const model = require('../../helpers/databases/sequelize/models/index');
const { getPagination, getPagingData } =require('../../helpers/utils/pagination');
const validator = require('../../helpers/utils/validator');
const { photo, move } = require('./schema');
const wrapper = require('../../helpers/utils/wrapper');
const Op = model.Sequelize.Op;

router.get('/', async (req, res, next) => { 
  const { page, size, title } = req.query;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = getPagination(page, size);

  model.photos.findAndCountAll({ where: condition, limit, offset })
  .then(data => {
    const response = getPagingData(data, page, limit);
    return wrapper.response(res, 200, 'SUCCESS', response, 'Get all data photos successfully')
  }).catch(err => {
    const erroMessage = err.message || 'Data photos not found';
    return wrapper.response(res, 404, 'ERROR', {}, erroMessage)
  })
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const photos = await model.photos.findOne({ where: { id: id } });
  if(validate.isEmpty(photos)){
    return wrapper.response(res, 404, 'ERROR', photos, 'Data photos not found')
  }
  return wrapper.response(res, 200, 'SUCCESS', photos, 'Get data photos successfully')
});

router.get('/album/:id', async (req, res, next) => {
  const albumId = req.params.id;
  const photos = await model.photos.findAll({albumId: albumId});
  if(validate.isEmpty(photos)){
    return wrapper.response(res, 404, 'ERROR', photos, 'Data photos by albumId not found')
  }
  return wrapper.response(res, 200, 'SUCCESS', photos, 'Get data photos by albumId successfully')
});

router.post('/', jwt, validator(photo), async(req, res, next) => {
  const {albumId, title, url, thumbnailUrl} = req.body;
  const photo = await model.photos.create({albumId, title, url, thumbnailUrl});
  if(photo){
    return wrapper.response(res, 201, 'SUCCESS', photo, 'Created photo successfully')
  }
});

router.put('/:id', jwt, validator(photo), async(req, res, next) => {
  const id = req.params.id;
  const {albumId, title, url, thumbnailUrl} = req.body;
  const album = await model.albums.findOne({ where: { albumId: albumId } });
  if(validate.isEmpty(album)){
    return wrapper.response(res, 404, 'ERROR', album, 'Albums not found')
  }

  const result = await model.photos.update({albumId, title, url, thumbnailUrl}, { where: { id: id } });
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', {}, 'Updated data photo successfully')
  }
});

router.delete('/:id', jwt, async(req, res, next) => {
  const id = req.params.id;
  const photo = await model.photos.findOne({ where: { id: id } });
  if(validate.isEmpty(photo)){
    return wrapper.response(res, 404, 'ERROR', photo, 'Photo not found!!')
  }

  const result = await model.photos.destroy({ where: { id }})
  if(validate.isEmpty(result)){
    return wrapper.response(res, 404, 'ERROR', result, 'Deleted data photo fail, data photo not found')
  }
  return wrapper.response(res, 200, 'SUCCESS', {}, 'Deleted photo successfully');
});

router.put('/move/:albumId', jwt, validator(move), async(req, res, next) => {
  const albumId = req.params.albumId;
  const { toAlbum, photos } = req.body;
  const album = await model.albums.findOne({ where: { albumId: albumId } });
  if(validate.isEmpty(album)){
    return wrapper.response(res, 404, 'ERROR', album, 'Albums not found')
  }

  const targetAlbum = await model.albums.findOne({ where: { albumId: toAlbum } });
  if(validate.isEmpty(targetAlbum)){
    return wrapper.response(res, 404, 'ERROR', targetAlbum, 'Target album doesn\'t exist')
  }

  const result = await model.photos.update({albumId: toAlbum}, { where: { id: photos } });
  if(result){
    return wrapper.response(res, 201, 'SUCCESS', {}, 'Updated data photo successfully')
  }
});

module.exports = router;