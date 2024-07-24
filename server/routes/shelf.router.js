const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * Get all of the items on the shelf
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  let queryText = `SELECT * FROM "item"`;
  pool.query(queryText).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', (req, res) => {
  // endpoint functionality
  console.log('/shelf POST route');
  console.log(req.body);
  console.log('is authenticated?', req.isAuthenticated());
  console.log('user', req.user);
  // res.sendStatus(200);

  let shelfItem = req.body.item
  let shelfUrl = req.body.url
  let user = req.user.id

  let queryText = 'INSERT INTO "item" ("description", "image_url", "user_id") VALUES ($1, $2, $3);'

  pool.query(queryText, [shelfItem, shelfUrl, user])
    .then(dbResult => {
      console.log('dbResult.rows', dbResult.rows);
      res.sendStatus(201);
    })
    .catch(dbError => {
      console.log('dberror', dbError);
      res.sendStatus(500);
    })
});

/**
 * Delete an item
 */
router.delete('/:id', (req, res) => {
  // endpoint functionality
  console.log('req.params', req.params)
  let idToDelete = req.params.id;

  let queryText = `DELETE FROM item WHERE id = $1;`;

  pool.query(queryText, [idToDelete])
  .then (dbResult => {
    console.log(dbResult);
    res.sendStatus(200);
  })
  .catch (dbError =>{
    console.log(dbError);
    res.sendStatus(500);
  })
});

module.exports = router;
