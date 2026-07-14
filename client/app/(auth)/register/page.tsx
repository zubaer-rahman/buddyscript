"use client";

import Link from "next/link";
import { LoginShapes } from "@features/auth/components/LoginShapes";
import { SocialLoginButton } from "@features/auth/components/SocialLoginButton";
import { RegisterForm } from "@features/auth/components/RegisterForm";

export default function Register() {
  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <LoginShapes />
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img
                    src="/assets/images/logo.svg"
                    alt="Image"
                    className="_right_logo"
                  />
                </div>
                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>

                <SocialLoginButton provider="google" />
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                <RegisterForm />

                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
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
