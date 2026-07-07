const { ZodError } = require("zod");

// Validates req.body against a zod schema. On success replaces req.body with the
// parsed (typed/cleaned) value. On failure returns 400 with field errors.
module.exports = function validate(schema) {
  return function (req, res, next) {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
};
