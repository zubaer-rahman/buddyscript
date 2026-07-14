function PostSkeleton() {
  return (
    <div
      className="_feed_inner_timeline_post _b_radious6 _mar_b16"
      style={{ padding: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#e0e0e0",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 12,
              borderRadius: 6,
              background: "#e0e0e0",
              marginBottom: 8,
              width: "40%",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: 10,
              borderRadius: 6,
              background: "#e0e0e0",
              width: "25%",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: 14,
          borderRadius: 6,
          background: "#e0e0e0",
          marginBottom: 10,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 14,
          borderRadius: 6,
          background: "#e0e0e0",
          marginBottom: 16,
          width: "80%",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 220,
          borderRadius: 8,
          background: "#e0e0e0",
          marginBottom: 16,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            height: 36,
            borderRadius: 6,
            background: "#e0e0e0",
            flex: 1,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 36,
            borderRadius: 6,
            background: "#e0e0e0",
            flex: 1,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 36,
            borderRadius: 6,
            background: "#e0e0e0",
            flex: 1,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

export default PostSkeleton;
