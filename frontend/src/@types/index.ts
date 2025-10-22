export enum ApiExceptions {
  EmailAlreadyTakenException = "EmailAlreadyTakenException",
  EmailFailedToSendException = "EmailFailedToSendException",
  IncorrectVerificationCodeException = "IncorrectVerificationCodeException",
  UserAlreadyVerifiedException = "UserAlreadyVerifiedException",
  UserDoesNotExistException = "UserDoesNotExistException",
  VerificationCodeExpiredException = "VerificationCodeExpiredException",
}

export enum StatusCodes {
  OK = 200, // Success
  CREATED = 201, // Resource successfully created
  NO_CONTENT = 204, // Request successful but no content returned
  BAD_REQUEST = 400, // Client sent invalid request
  UNAUTHORIZED = 401, // Authentication required or failed
  FORBIDDEN = 403, // Authenticated but not allowed
  NOT_FOUND = 404, // Resource not found
  METHOD_NOT_ALLOWED = 405, // HTTP method not allowed
  CONFLICT = 409, // Conflict, e.g., duplicate resource
  INTERNAL_SERVER_ERROR = 500, // Generic server error
  NOT_IMPLEMENTED = 501, // Server does not support functionality
  SERVICE_UNAVAILABLE = 503, // Server temporarily unavailable
}

export interface ApiErrorData {
  exception: ApiExceptions;
  error: string;
  path: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  data: ApiErrorData;
  status: StatusCodes;
}
