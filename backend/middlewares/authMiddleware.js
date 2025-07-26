const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT access tokens
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Validate Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('🔒 Authorization header missing or improperly formatted');
    return res.status(401).json({ message: 'Access token missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify token using secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ✅ Attach decoded user info to request
    req.user = {
      id: decoded.userId || decoded.id, // Handle both id or userId based on your token structure
      email: decoded.email || undefined,
      role: decoded.role || 'user', // Extend this if you add roles
    };

    next(); // ✅ Pass to next middleware
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message || 'Unknown error');
    return res.status(403).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = authMiddleware;
