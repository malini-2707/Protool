import jwt from 'jsonwebtoken';

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

/**
 * JWT Authentication Middleware
 * Fixed version with proper error handling and user attachment
 */
export const authenticateToken = (req, res, next) => {
  try {
    console.log('🔐 Auth middleware: Checking token...');
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('❌ No Authorization header found');
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token found in Authorization header');
      return res.status(401).json({ 
        success: false,
        error: 'Token format is invalid' 
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.status(401).json({ 
          success: false,
          error: 'Invalid or expired token' 
        });
      }

      console.log('✅ Token verified successfully');
      console.log('👤 User ID from token:', decoded.userId);
      
      // Attach decoded user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email || null
      };
      
      next();
    });
  } catch (error) {
    console.error('🔐 Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Authentication error' 
    });
  }
};

/**
 * Optional: Middleware to check if user exists in database
 */
export const validateUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    const User = mongoose.model('User');
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Attach full user object to request
    req.user.fullUser = user;
    next();
  } catch (error) {
    console.error('🔐 User validation error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'User validation error' 
    });
  }
};
