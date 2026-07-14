"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const { submit, error, loading } = useRegister();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit({ firstName, lastName, email, password, repeatPassword });
  };

  return (
    <>
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
          style={{ fontSize: "14px", padding: "10px" }}
        >
          {error}
        </div>
      )}

      <form className="_social_registration_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                First Name
              </label>
              <input
                type="text"
                className="form-control _social_registration_input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Last Name
              </label>
              <input
                type="text"
                className="form-control _social_registration_input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Email
              </label>
              <input
                type="email"
                className="form-control _social_registration_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Password
              </label>
              <input
                type="password"
                className="form-control _social_registration_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Repeat Password
              </label>
              <input
                type="password"
                className="form-control _social_registration_input"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <div className="form-check _social_registration_form_check">
              <input
                className="form-check-input _social_registration_form_check_input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked
              />
              <label
                className="form-check-label _social_registration_form_check_label"
                htmlFor="flexRadioDefault2"
              >
                I agree to terms &amp; conditions
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <div className="_social_registration_form_btn _mar_t40 _mar_b60">
              <button
                type="submit"
                className="_social_registration_form_btn_link _btn1"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register now"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
