'use strict';

const express = require('express');
const dataModules = require('../models');
const acl = require('../middleware/acl');
const bearerAuth = require('../middleware/bearer');
const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', bearerAuth, acl('read'), handleGetAll);
router.get('/:model/:id', bearerAuth, acl('read'), handleGetOne);
router.post('/:model', bearerAuth, acl('create'), handleCreate);
router.put('/:model/:id', bearerAuth, acl('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);

  } catch (error) {
    console.log(error);
  }
}

async function handleGetOne(req, res) {
  try {
    const id = req.params.id;
    let record = await req.model.get(id);
    res.status(200).json(record);
  } catch (error) {
    console.log(error);
  }
}

async function handleCreate(req, res) {
  try {
    let obj = req.body;
    let newModel = await req.model.create(obj);
    res.status(201).json(newModel);
  } catch (error) {
    console.log(error);
  }
}

async function handleUpdate(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let update = await req.model.update(id, obj);
    res.status(200).json(update);
  } catch (error) {
    console.log(error);
  }
}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deleteModel = await req.model.delete(id);
    res.status(200).json(deleteModel);
  } catch (error) {
    console.log(error);
  }
}


module.exports = router;
