var express = require('express');
var router = express.Router();
var orderSchma = require('../models/order.model')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tokenMiddleware =require("../middleware/token.middleware")
const approveMiddleware =require("../middleware/approve.middleware")

/* GET users listing. */
router.get('/', tokenMiddleware,approveMiddleware,async function(req, res, next) {
  try{
    let products = await orderSchma.find({})
  res.status(200).send({status:200, message: "success", data:products})
  }catch (error) {
    res.status(400).send({ status: 400, message: "error", data: null });
  }

  });
  

module.exports = router;