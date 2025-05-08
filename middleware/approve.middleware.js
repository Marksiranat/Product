const jwt = require('jsonwebtoken')
var userModel = require('../models/user.model')


module.exports = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id || req.user.id);
  
      if (!user) {
        return res.status(404).send({ status: 404, message: 'ไม่พบ username ในระบบ',data: null });
      }
  
      if (user.status === 'NoApprove') {
        return res.status(404).send({ status: 404, message: 'User NoApprove',data: null  });
      }
  
      // แนบ user เข้า req เพื่อใช้ใน route ถัดไป
      req.user = user;
      next();
  
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 500, message: 'Authentication Error',data: null });
    }
  };
  