/**
 * Order Status Lifecycle Validator
 * Enforces a strict state machine for order status transitions.
 *
 * Allowed states (in sequence):
 *   1. Placed       — Initial state when order is confirmed
 *   2. Processing   — Order is being prepared
 *   3. Delivered    — Order has been delivered
 *
 * Transitions must follow this sequence; skipping is not allowed.
 * E.g., cannot go from Placed → Delivered directly.
 */

// Define the allowed status sequence
const STATUS_SEQUENCE = ['Placed', 'Processing', 'Delivered'];

/**
 * Check if a status transition is valid.
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus    - Desired new status
 * @returns {object}            - { valid: boolean, message: string }
 */
function isValidTransition(currentStatus, newStatus) {
  // Current index in the sequence
  const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus);
  // Desired next status index
  const newIndex = STATUS_SEQUENCE.indexOf(newStatus);

  // If either status is invalid (not in the sequence)
  if (currentIndex === -1) {
    return {
      valid: false,
      message: `Current status "${currentStatus}" is not valid.`
    };
  }
  if (newIndex === -1) {
    return {
      valid: false,
      message: `New status "${newStatus}" is not valid.`
    };
  }

  // Allow staying in same status (idempotent)
  if (newIndex === currentIndex) {
    return {
      valid: true,
      message: `Order is already in "${newStatus}" status.`
    };
  }

  // Only allow moving to the next status (no skipping)
  if (newIndex === currentIndex + 1) {
    return {
      valid: true,
      message: `Valid transition from "${currentStatus}" to "${newStatus}".`
    };
  }

  // Reject moving backward or skipping steps
  return {
    valid: false,
    message: `Cannot transition from "${currentStatus}" to "${newStatus}". Must follow sequence: ${STATUS_SEQUENCE.join(' → ')}.`
  };
}

/**
 * Get the next valid status for an order
 * @param {string} currentStatus - Current order status
 * @returns {string|null}       - Next status in sequence, or null if at end
 */
function getNextStatus(currentStatus) {
  const index = STATUS_SEQUENCE.indexOf(currentStatus);
  if (index === -1 || index === STATUS_SEQUENCE.length - 1) {
    return null;
  }
  return STATUS_SEQUENCE[index + 1];
}

/**
 * Get all valid statuses
 * @returns {array} - Array of allowed statuses
 */
function getAllStatuses() {
  return [...STATUS_SEQUENCE];
}

module.exports = {
  STATUS_SEQUENCE,
  isValidTransition,
  getNextStatus,
  getAllStatuses
};
