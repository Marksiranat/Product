const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(404).json({ status: 404, message: 'Token has expired',data: null  });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(404).json({ status: 404, message: 'Invalid token' ,data: null });
    }

    res.status(500).json({ status: 500, message: 'Internal server error',data: null  });
  }
};
