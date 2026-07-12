import type { AxiosError } from "axios";

export function getFriendlyMessage(error: AxiosError): string {
  const status = error.response?.status;
  const data = error.response?.data as { message?: string } | undefined;
  const rawMessage = data?.message ?? "";

  if (!error.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  switch (status) {
    case 400:
      return "The request was invalid. Please check your input and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return (
        rawMessage || "A conflict occurred. The resource may already exist."
      );
    case 422:
      return (
        rawMessage || "The provided data is invalid. Please review your input."
      );
    case 429:
      return "Too many requests. Please slow down and try again in a moment.";
    case 500:
    case 502:
    case 503:
      return "A server error occurred. Please try again later.";
    default:
      return rawMessage || "Something went wrong. Please try again.";
  }
}
