var express = require("express");
var router = express.Router();
var productSchma = require("../models/product.model");
var orderSchma = require("../models/order.model");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenMiddleware =require("../middleware/token.middleware")
const approveMiddleware =require("../middleware/approve.middleware")

// *******************************************

//get products
router.get("/",tokenMiddleware,approveMiddleware,async function (req, res, next) {
    try{
        let products = await productSchma.find({});
        res.status(200).send({ status: 200, message: "success", data: products });
    }catch (error) {
        res.status(500).send({ status: 500, message: "error", data: [] });
      }
 
});

//add products
router.post("/",tokenMiddleware,approveMiddleware, async (req, res) => {
  try {
    const { nameproduct, unit, price} = req.body;

   
    if (!nameproduct || !unit) {
      return res
        .status(400)
        .send({ status: 400, message: "error", data: null});
    }

    const newProduct = new productSchma({
      nameproduct,
      unit,
      price,
      userId : req.user.id
    });

    const savedProduct = await newProduct.save();

    res.status(200).send({
      status: 200,
      message: "success",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).send({ status: 500, message: "error", data: null});
  }
});

//edit products
router.put("/:id",tokenMiddleware,approveMiddleware, async function (req, res, next) {
  try {
    let { nameproduct, unit } = req.body;
    let { id } = req.params;

    let user = await productSchma.findByIdAndUpdate(
      id,
      { nameproduct, unit },
      { new: true }
    );

    res.status(200).send({ status: 200, message: "success", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "error", data: null });
  }
});

//del products
router.delete("/:id",tokenMiddleware,approveMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;

    let user = await productSchma.findByIdAndDelete(id);

    res.status(200).send({ status: 200, message: "success", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "error", data: null });
  }
});

//get Productตามid
router.get("/:id",tokenMiddleware,approveMiddleware,async function (req, res, next) {
    try{
        const {id} = req.params;
        let products = await productSchma.findById(id);
        res.status(200).send({ status: 200, message: "success", data: products });
    }catch (error) {
        res.status(500).send({ status: 500, message: "error", data: null });
      }
   
});

//แสดงordersทั้งหมดใน pro
router.get("/:id/orders",tokenMiddleware,approveMiddleware,async  (req, res) => {
  try {
    const {id} = req.params;

  
    let order = await orderSchma.findById(id);

    res.status(200).send({ status: 200, message: "success", data:order });
  } catch (error) {
    res.status(500).send({ status: 500, message: "error", data: [] });
  }
});

//เพิ่ม orders ใน pro
router.post("/:id/orders",tokenMiddleware,approveMiddleware,async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.user._id; 
      const { quantity } = req.body;
  
      // ดึงข้อมูลสินค้า
      const product = await productSchma.findById(productId);
  
      if (!product) {
        return res.status(400).send({status: 400, message: `ไม่พบสินค้า ID: ${productId}`, data: null });
      }
  
      if (quantity > product.unit) {
        return res.status(400).send({
          status: 400,
          message: `สินค้าชื่อ "${product.nameproduct}" มีสต็อกไม่พอ (เหลือ ${product.unit} ชิ้น)`,
          data: null
        });
      }
  
      // สร้าง order โดยใช้ productId จาก params
      const newOrder = await orderSchma.create({
        userId:req.user._id,
        products: [
          {
            productId,
            quantity,
          
          }
        ]
      });
  
      // ลด stock
      await productSchma.findByIdAndUpdate(productId, {
        $inc: { unit: -quantity },
        $addToSet: { orderIds: newOrder._id }  
      });
  
      res.status(200).send({
        status: 200,
        message: "success",
        data: {
          nameproduct: product.nameproduct,
          quantity:quantity
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: 500, message: "error", data: [] });
    }
  });

module.exports = router;
