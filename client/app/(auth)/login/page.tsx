"use client";

import Link from "next/link";
import { LoginShapes } from "../../../features/auth/api/components/LoginShapes";
import { useLogin } from "../../../features/auth/api/hooks/useLogin";
import { SocialLoginButton } from "../../../features/auth/api/components/SocialLoginButton";
import { LoginForm } from "../../../features/auth/api/components/LoginForm";

export default function Login() {
  const { submit, error, loading } = useLogin();

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <LoginShapes />
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img
                    src="/assets/images/login.png"
                    alt="Image"
                    className="_left_img"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b28">
                  <img
                    src="/assets/images/logo.svg"
                    alt="Image"
                    className="_left_logo"
                  />
                </div>
                <p className="_social_login_content_para _mar_b8">
                  Welcome back
                </p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">
                  Login to your account
                </h4>

                <SocialLoginButton provider="google" />
                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                <LoginForm onSubmit={submit} loading={loading} error={error} />

                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">
                        Dont have an account?{" "}
                        <Link href="/register">Create New Account</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
