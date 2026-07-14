export const getUserAvatar = (
  user:
    | { avatar?: string | null; firstName?: string; lastName?: string }
    | null
    | undefined,
): string => {
  if (!user) return "/images/txt_img.png";
  if (user.avatar) return user.avatar;

  const name = encodeURIComponent(
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
  );
  return `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true`;
};
