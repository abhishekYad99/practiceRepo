/**
 * Shared constants used across the app.
 * Add/adjust as you build out the features.
 */

export const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// Handy arrays for building <Select> options.
export const TASK_STATUS_OPTIONS = Object.values(TASK_STATUS);
export const TASK_PRIORITY_OPTIONS = Object.values(TASK_PRIORITY);
