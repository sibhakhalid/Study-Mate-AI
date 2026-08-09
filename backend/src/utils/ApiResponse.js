/**
 * Every successful response — across every route — shares this shape:
 * { success: true, data, message }, with an optional `pagination` block
 * for list endpoints. Keeping one envelope means the frontend's
 * httpClient can unwrap responses generically instead of each feature
 * service parsing a bespoke shape.
 */
export class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  send(res, pagination = null) {
    const { statusCode, ...body } = this;
    if (pagination) body.pagination = pagination;
    return res.status(statusCode).json(body);
  }
}
