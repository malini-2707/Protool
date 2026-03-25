// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Authentication required" 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Insufficient permissions" 
      });
    }

    next();
  };
};

// Check if user is admin or project manager
export const authorizeAdminOrPM = authorize('ADMIN', 'PROJECT_MANAGER');

// Check if user is admin
export const authorizeAdmin = authorize('ADMIN');
