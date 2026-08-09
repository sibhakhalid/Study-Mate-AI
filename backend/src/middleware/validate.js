import { ApiError } from "../utils/ApiError.js";

/**
 * Wraps a Zod schema into request-validating middleware. Pass the parts
 * of the request you want validated: validate({ body, params, query }).
 * Parsed (and type-coerced) values are written back onto req, so
 * downstream handlers get clean, trusted data.
 */
export function validate(schemas) {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      next();
    } catch (err) {
      const details = err.errors?.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      next(ApiError.badRequest("Invalid request data", details));
    }
  };
}
