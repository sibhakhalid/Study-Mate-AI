/**
 * Wraps an async Express handler so a rejected promise is forwarded to
 * next(err) automatically — without this, an unhandled rejection inside
 * a route just hangs the request instead of hitting the error middleware.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
