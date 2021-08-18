const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { async } = require('validate.js');
const validate = require('validate.js');
const model = require('../helpers/databases/sequelize/models/index');
const wrapper = require('../helpers/utils/wrapper');
const connection = require('./../helpers/databases/mysql/connection');

/*
* Migrate photos from https://jsonplaceholder.typicode.com/photos to databases
*/
router.get('/photos', (req, res) => {
  fetch('https://jsonplaceholder.typicode.com/photos')
    .then(res => res.json())
    .then(data => {
      const result = [];
      data.map(a => {
        result.push([
          a.id,
          a.albumId,
          a.title,
          a.url,
          a.thumbnailUrl,
        ])  
      });
      
      let sql = `INSERT INTO photos(id, albumId, title, url, thumbnailUrl) VALUES (?)`;
      for (let i = 0; i <= result.length - 1; i++){
        connection.query(sql, [result[i]], function(err, data, fields) {
          if (err) throw err;
          console.log('masuk');
        })
      }
      console.log('done');
    });
});

router.get('/albums', async (req, res, next) => {
  fetch('https://jsonplaceholder.typicode.com/photos')
    .then(resp => resp.json())
    .then(data => {
      const result = data.map(a => a.albumId);
      const album = [...new Set(result)];
      for (let i = 0; i <= album.length - 1; i++){
        model.albums.create({ albumId: album[i], title: `album_${album[i]}`});
      }
    });
});


module.exports = router;