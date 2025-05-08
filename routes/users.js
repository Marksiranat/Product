var express = require('express');
var router = express.Router();
var userSchma = require('../models/user.model')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES=process.env.JWT_EXPIRES || '1h';

//เข้าสู่ระบบ 
router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  // ค้นหา user ในฐานข้อมูล
  const user = await userSchma.findOne({ username });

  if (!user) {
    return res.status(400).send({ status: 400, message: "กรุณาสมัครสมาชิก", data: null });
  }
 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send({ status: 400, message: "รหัสผ่านไม่ถูกต้อง", data: null });
  }

    if (user.status === 'NoApprove') {
      return res.status(401).send({ status: 401, message: "รอApprove", data: null});
    }

const token = jwt.sign({
  id:user._id,
  username:user.username,

},
JWT_SECRET,{expiresIn:JWT_EXPIRES}
)


  res.send({ status: 200, message: "success" ,access_token: token, data: [{username: user.username}] });
});


//สมัครสมาชิก
router.post("/register", async function (req, res) {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email ) {
    return res.status(400).send({ status:400,message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",data:null});

  }

  try {
    const existingUser = await userSchma.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(401).send({status:401, message: "ชื่อผู้ใช้หรืออีเมลมีอยู่แล้ว" ,data:null});
    }

    // สร้าง user ใหม่
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userSchma({
      name :name,
      username:username,
      email:email,
      password: hashedPassword,
    });

    await user.save(); // บันทึกลงฐานข้อมูล

    return res.status(201).send({status:201, message: "success",data:user });
  } catch (err) {
    console.error(err);
    return res.status(500).send({status:500, message: "เกิดข้อผิดพลาดในระบบ",data:null });
  }
});

//อัพ approve
router.put("/users/:id/approve", async function (req, res, next) {
  try {
    let { status } = req.body;
    let { id } = req.params;

    let user = await userSchma.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      return res.status(400).send({ status:400, message: "User not found", data:null });
    }

    res.status(200).send({status:200, message: "success", data:user});
  } catch (error) {
    console.error(error);
    res.status(500).send({status:500, message: "error", data:null});
  }
});






module.exports = router;
