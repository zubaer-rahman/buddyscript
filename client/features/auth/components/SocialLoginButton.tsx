interface SocialLoginButtonProps {
  provider: "google";
  onClick?: () => void;
}

export function SocialLoginButton({ onClick }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      className="_social_login_content_btn _mar_b40"
      onClick={onClick}
    >
      <img
        src="/assets/images/google.svg"
        alt="Image"
        className="_google_img"
      />
      <span>Or sign-in with google</span>
    </button>
  );
}
