import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ 
      error: true, 
      message: 'Unauthorized: No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userRef = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      error: true, 
      message: 'Forbidden: Invalid or expired token', 
      details: err.message 
    });
  }
};
