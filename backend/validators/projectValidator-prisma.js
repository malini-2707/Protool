import { body } from 'express-validator';

/**
 * Validation rules for Prisma Project operations
 */

// Validate project creation
export const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Project name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Project name can only contain letters, numbers, spaces, hyphens, and underscores'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .custom((features) => {
      const validFeatures = [
        'BACKLOG',
        'SPRINT_MANAGEMENT',
        'ISSUE_TRACKING',
        'KANBAN_BOARD',
        'REPORTS',
        'TIME_TRACKING',
        'TEAM_MANAGEMENT',
        'TEAM_COLLABORATION',
        'NOTIFICATIONS'
      ];
      
      for (const feature of features) {
        if (!validFeatures.includes(feature)) {
          throw new Error(`Invalid feature: ${feature}. Valid features are: ${validFeatures.join(', ')}`);
        }
      }
      return true;
    }),
    
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => {
      if (value && new Date(value) > new Date()) {
        throw new Error('Start date cannot be in the future');
      }
      return true;
    }),
    
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    })
];

// Validate project update
export const validateUpdateProject = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Project name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Project name can only contain letters, numbers, spaces, hyphens, and underscores'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .custom((features) => {
      const validFeatures = [
        'BACKLOG',
        'SPRINT_MANAGEMENT',
        'ISSUE_TRACKING',
        'KANBAN_BOARD',
        'REPORTS',
        'TIME_TRACKING',
        'TEAM_MANAGEMENT',
        'TEAM_COLLABORATION',
        'NOTIFICATIONS'
      ];
      
      for (const feature of features) {
        if (!validFeatures.includes(feature)) {
          throw new Error(`Invalid feature: ${feature}. Valid features are: ${validFeatures.join(', ')}`);
        }
      }
      return true;
    }),
    
  body('status')
    .optional()
    .isIn(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'])
    .withMessage('Invalid project status'),
    
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
    
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    })
];
