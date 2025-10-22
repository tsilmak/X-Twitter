import { ApiErrorResponse } from "@/@types";

export function extractApiError(err: unknown): ApiErrorResponse | undefined {
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "data" in err
  ) {
    const maybeApiError = err as ApiErrorResponse;
    // make sure data has at least an error and exception
    if (
      maybeApiError.data &&
      "error" in maybeApiError.data &&
      "exception" in maybeApiError.data
    ) {
      return maybeApiError;
    }
  }
  return undefined;
}
