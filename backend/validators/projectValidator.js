import { body } from 'express-validator';

/**
 * Project Validation Rules
 * Ensures data integrity before processing
 */
export const validateCreateProject = [
  // Title validation
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Project title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Project title can only contain letters, numbers, spaces, hyphens, and underscores'),

  // Description validation (optional)
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  // Start date validation (optional)
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

  // End date validation (optional)
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),

  // Features validation (optional)
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .custom((features) => {
      const validFeatures = [
        'backlog',
        'sprint_management',
        'issue_tracking',
        'kanban_board',
        'reports',
        'time_tracking',
        'team_management',
        'team_collaboration',
        'notifications'
      ];
      
      for (const feature of features) {
        if (!validFeatures.includes(feature)) {
          throw new Error(`Invalid feature: ${feature}`);
        }
      }
      return true;
    })
];

/**
 * Project Update Validation Rules
 * Similar to create but all fields are optional
 */
export const validateUpdateProject = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Project title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Project title can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .custom((features) => {
      const validFeatures = [
        'backlog',
        'sprint_management',
        'issue_tracking',
        'kanban_board',
        'reports',
        'time_tracking',
        'team_management',
        'team_collaboration',
        'notifications'
      ];
      
      for (const feature of features) {
        if (!validFeatures.includes(feature)) {
          throw new Error(`Invalid feature: ${feature}`);
        }
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'archived'])
    .withMessage('Invalid project status')
];
