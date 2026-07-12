interface AxiosLikeError {
  friendlyMessage?: string;
  response?: { data?: { message?: string } };
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const axiosErr = err as AxiosLikeError;
  return (
    axiosErr.friendlyMessage || axiosErr.response?.data?.message || fallback
  );
}
