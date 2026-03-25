// Simple validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }
    
    next();
  };
};

// Validation schemas
export const schemas = {
  register: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    role: {
      type: 'string',
      enum: ['ADMIN', 'PROJECT_MANAGER', 'MEMBER'],
      default: 'MEMBER'
    }
  },
  
  login: {
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true
    }
  },

  createProject: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },
    description: {
      type: 'string',
      maxLength: 500
    },
    deadline: {
      type: 'string',
      pattern: /^\d{4}-\d{2}-\d{2}$/
    }
  },

  createTask: {
    title: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 200
    },
    description: {
      type: 'string',
      maxLength: 1000
    },
    priority: {
      type: 'string',
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    assignedTo: {
      type: 'number'
    },
    sprintId: {
      type: 'number'
    }
  },

  createSprint: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },
    description: {
      type: 'string',
      maxLength: 500
    },
    startDate: {
      type: 'string',
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/
    },
    endDate: {
      type: 'string',
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/
    }
  },

  updateProfile: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: 'string',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },

  changePassword: {
    currentPassword: {
      type: 'string',
      required: true
    },
    newPassword: {
      type: 'string',
      required: true,
      minLength: 6
    }
  }
};

// Simple validation function
export const validateRequest = (schema, data) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation if field is not provided and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Type validation
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
    }
    
    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }
    
    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }
  }
  
  return errors;
};
