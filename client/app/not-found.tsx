"use client";

import Link from "next/link";
 
export default function NotFound() {
  return (
    <section
      className="_social_login_wrapper _layout_main_wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape.svg"
          alt=""
          className="_dark_shape"
        />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img
          src="/assets/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>

      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          position: "relative",
          padding: "0 24px",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <img
            src="/assets/images/logo.svg"
            alt="Buddy Logo"
            style={{ height: 48 }}
          />
        </div>

        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            color: "#1890FF",
            letterSpacing: -4,
            marginBottom: 8,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#112032",
            marginBottom: 12,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#666",
            marginBottom: 40,
            maxWidth: 400,
            margin: "0 auto 40px",
            lineHeight: 1.6,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <Link
          href="/"
          className="_btn1"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: 8,
            background: "#1890FF",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
            fontFamily: "Poppins, sans-serif",
            transition: "background 0.2s ease",
          }}
        >
          ← Go Back to Home
        </Link>
      </div>
    </section>
  );
}
