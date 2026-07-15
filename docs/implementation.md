# Implementation Sequence

> ERD → Requirements → Auth(server) → Auth(ui) → Feed(server) → Feed(ui) → Hooks → Postman

---

## 1. ERD

ERD: https://drive.google.com/file/d/1n9It55GX3rZfxEXrGUFsF44aD9sumFTl/view

Denormalized `likeCount`/`commentCount` avoids COUNT scans — updated atomically via `$transaction`. Composite PKs on join tables enforce one-like-per-user without extra indices. Separate like tables per entity keeps FK constraints (no polymorphic anti-pattern). `tokenVersion` on User enables instant JWT revocation — middleware compares claim vs DB row.

---

## 2. Requirements

**P0:** register, login, logout, session revocation, JWT refresh via httpOnly cookies, create post (text+image), cursor-paginated feed, edit/delete own posts, comment on posts, reply on comments.

**P1:** like/unlike toggle (posts/comments/replies), infinite scroll.

**P2:** Redis feed cache (30s TTL, graceful fallback).

**Constraints:** Zod validation middleware, rate limit 100/min global / 20/15min auth, Helmet CSP (Cloudinary + Google Fonts + ui-avatars.com), 10KB body limit, 5MB image upload (images only), ESM with `.js` extensions, graceful shutdown (SIGTERM → Prisma + Redis disconnect).

---

## 3. Auth (Server)

```
server/src/modules/auth/
├── auth.controller.ts   # register / login / refresh / logout
├── auth.interface.ts    # IUserRegisterPayload, IUserLoginPayload
├── auth.route.ts        # POST routes + validateRequest middleware
├── auth.service.ts      # business logic
└── auth.validation.ts   # Zod: register(firstName, lastName, email, password min8+upper+lower+digit), login(email, password)
```

**register:** check email uniqueness (`toLowerCase()`) → `bcrypt.hash(password, 12)` → `prisma.user.create` → re-fetch with `omit: { password }` → sign `{ id, tokenVersion }` to accessToken (15m) + refreshToken (7d) → set httpOnly cookies → respond 201 `{ user }`.

**login:** `prisma.user.findUnique(email)` → `bcrypt.compare` → sign tokens → cookies → respond 200.

**refresh:** verify refreshToken → `prisma.user.findUnique(id)` → validate `tokenVersion` match → increment `tokenVersion` (rotation invalidates old tokens) → sign new pair → set cookies.

**logout:** decode accessToken (best-effort) → `tokenVersion += 1` → clear cookies.

**Auth middleware:** Token extraction: `cookies.accessToken` > `Authorization: Bearer` > raw header. `jwtUtils.verifyToken` (wraps `jwt.verify` in try/catch, returns `{ success, data }` tuple — never throws). `prisma.user.findUnique(id)` to confirm user exists. Compare `tokenVersion` claim vs DB. Attach to `req.user`. All failures → `AppError(401)`.

**Cookie config:** accessToken 15min, refreshToken 7d, httpOnly, secure+sameSite:none in prod, sameSite:strict in dev.

---

## 4. Auth (UI)

```
client/features/auth/
├── api/authApi.ts        # login() / register() / logout() → axios
├── components/           # LoginForm, RegisterForm, LoginShapes, SocialLoginButton
├── hooks/                # useLogin (useMutation → store → router.push), useRegister (manual fetch)
├── types.ts
└── utils/getErrorMessage.ts

client/store/auth/        # Zustand + persist
├── authStore.ts          # { user, isAuthenticated, hasHydrated, login, logout, setHasHydrated }
├── storage.ts
└── types.ts
```

**Flow:** Form submit → `loginMutation.mutate(payload)` → `axios.post("/auth/login")` with `withCredentials: true` → server validates, sets cookies, responds `{ user }` → `store.login(user)` (persists to localStorage, calls `queryClient.clear()`) → `router.push("/feed")`. On error → `toast.error(error.friendlyMessage)`.

**Route protection:** `(auth)/layout.tsx` redirects to `/feed` if authenticated + hydrated. `(protected)/layout.tsx` redirects to `/login` if `user === null` after hydration. `proxy.ts` provides edge-level protection for `/feed/*`.

**401 interceptor:** On 401 (excluding login/register, excluding retried requests) → `POST /auth/refresh` via standalone axios (no interceptor loop) → retry original request. On refresh failure → "Your session has expired". Also maps status codes to friendly messages.

---

## 5. Feed (Server)

```
server/src/modules/post/
├── post.controller.ts   # createPost, getFeed, updatePost, deletePost
├── post.interface.ts    # ICreatePostPayload, IUpdatePostPayload
├── post.route.ts        # POST/GET/PATCH/DELETE + auth + upload(single image) + validate
├── post.service.ts      # CRUD, pagination, Redis cache
└── post.validation.ts   # createPostSchema(text required), updatePostSchema(all optional)
```

**Feed pagination (`GET /post?cursor=&limit=10`):**
```
cache key = "feed:{userId}:{cursor}:{limit}"
→ Redis GET → HIT? JSON.parse, respond
→ MISS? prisma.post.findMany({
    take: limit+1, cursor: { id }, skip: cursor?1:0,
    orderBy: { createdAt: desc },
    where: { OR: [{ isPrivate: false }, { authorId }] },
    include: { author(id,name,avatar), likes(5, desc), _count:{likes where userId},
              comments(3, asc){ author, likes(where userId),
                replies{ author, likes(where userId) } }}
  })
→ hasNextPage = posts.length > limit → slice → map isLikedByMe from _count
→ nextCursor = hasNextPage ? raw[-1].id : null
→ SETEX key 30 → respond { posts, nextCursor, hasNextPage }
```

One DB round-trip loads the complete feed with nested comments/replies/likes. No N+1.

**Post create:** `auth` → `multer memoryStorage.single("image")` (5MB, images only) → Zod validate → `uploadToCloudinary(req.file)` if present → `prisma.post.create({ include: { author } })` → `invalidateUserFeed(authorId)` → respond 201.

**Ownership** on update/delete: `prisma.post.findUnique` → 404 if missing → 403 if `post.authorId !== req.user.id`.

**Cache:** `feedKey(userId, cursor, limit)` = string interpolation. `getCache(key)` → JSON.parse or null. `setCache(key, data)` → SETEX 30. `invalidateUserFeed(userId)` → DEL `feed:{userId}:*`. `invalidateAllFeeds()` → DEL `feed:*`. Invalidated on post create/update/delete (user) and like/unlike (all feeds). Redis is optional — all reads fall back to Prisma on connection failure.

**Comment:** verify post exists → `$transaction([create comment, post.update(commentCount+1)])`. Same pattern for Reply (no counter).

**Like toggle:** `switch(entityType)` → check composite PK → `$transaction([delete/create like, parent.update(likeCount ±1)])` → `invalidateAllFeeds()`.

---

## 6. Feed (UI)

```
client/features/feed/
├── api/                  # postApi(fetchFeedPage), commentsApi(addComment/addReply), likesApi(toggleLike)
├── components/
│   ├── CreatePostBox.tsx       # avatar, textarea, photo/video/event/article buttons → open modal
│   ├── CreatePostModal.tsx     # modal: text, image preview, submit → useCreatePostForm
│   ├── PostList.tsx            # flatMap posts → FeedPostCard[], skeleton on loading, load-more button
│   ├── PostSkeleton.tsx        # 3x pulsing placeholder
│   └── PostCard/
│       ├── FeedPostCard.tsx    # header, text, image, reactions (like/comment/share), comments, dropdown
│       ├── CommentItem.tsx     # comment + reply toggle + input
│       ├── ReactionHeads.tsx   # avatar stack + like count
│       └── ReplyItem.tsx
├── hooks/
│   ├── usePosts.ts            # useInfiniteQuery: queryKey["posts"], getNextPageParam: lastPage.nextCursor
│   ├── useComments.ts         # useMutation for addComment / addReply
│   ├── useLikeMutation.ts     # useMutation for toggleLike
│   ├── useCreatePostBox.ts    # modalOpen, fileInputRef, handlePhotoClick, handleFileChange
│   ├── useCreatePostForm.ts   # FormData → POST /post → invalidateQueries(["posts"]) → toast → close
│   └── usePostCard.ts         # liked, likesCount, commentText — optimistic like toggle + rollback
├── types.ts
└── utils/timeAgo.ts
```

**Infinite scroll:** `usePosts()` → `posts = pages.flatMap(p => p.posts)`. Loading → 3× skeleton. `hasNextPage && !isFetchingNextPage` → "Load more" button. `fetchNextPage` on click.

**Create flow:** Textarea focus / photo button → `openModal()` → `CreatePostModal` → `useCreatePostForm` builds FormData (`text`, `image`, `isPrivate`) → `POST /post` → on success: `invalidateQueries(["posts"])` + toast + close.

**PostCard states:** Liked/not (optimistic toggle ±1, rollback on error). Owner dropdown (edit+delete) vs non-owner (save+notif+hide). Comments: first 3 inline, "View all" expands. Delete: confirm → `DELETE` → invalidate. Edit: opens modal pre-filled.

---

## 7. Hooks & Services

**Dependency chain:**
```
lib/axios.ts (withCredentials:true)
  → lib/api/authInterceptor.ts (401→refresh, friendly errors)
    → features/*/api/*.ts
      → features/*/hooks/*.ts
        → components
            ↑
store/auth/authStore.ts ──┘
lib/queryClient.ts ────────┘
```

**Cache invalidation (client):** Post create/edit/delete → `invalidateQueries(["posts"])`. Like/unlike → `invalidateQueries(["posts"])`. Comment/reply → `invalidateQueries(["posts"])`. Login/logout → `queryClient.clear()`. No granular key strategy — cursor + limit encoded in query key, `invalidateQueries(["posts"])` busts all pages.

**Error path:** `axios 4xx/5xx` → `authInterceptor` maps status → `friendlyMessage` → `toast.error()`.

---

## 8. Postman

All endpoints under `http://localhost:5000/api/v1`. httpOnly cookies handled automatically — no manual token management.

### Auth

```
POST /auth/register  { "firstName":"John","lastName":"Doe","email":"john@example.com","password":"Test1234" }
  → 201 { user } + httpOnly cookies

POST /auth/login     { "email":"john@example.com","password":"Test1234" }
  → 200 { user }

POST /auth/refresh   → 200 (rotates token pair)

POST /auth/logout    → 200 (tokenVersion++, clears cookies)
```

### Post

```
POST   /post               multipart: text+image  → 201 { post }
GET    /post?cursor=&limit=10                     → 200 { posts, nextCursor, hasNextPage }
PATCH  /post/<id>          { "text":"..." }       → 200 (own post only)
DELETE /post/<id>                                  → 200 (own post only)
```

### Comment / Reply

```
POST /comment  { "text":"...", "postId":"<id>" }   → 201 { comment } (increments commentCount)
POST /reply    { "text":"...", "commentId":"<id>" } → 201 { reply }
```

### Like

```
POST /like/toggle  { "entityType":"post"|"comment"|"reply", "entityId":"<id>" }
  → 200 { liked: true/false, message: "Post liked"/"Post unliked" }
```

### Testing sequence

```
1. Register A (email A)   6. Login as B             11. Get feed → verify counts
2. Register B (email B)   7. Like A's post          12. Login as A
3. Login as A             8. Comment on post         13. Edit post
4. Create post            9. Reply to comment        14. Delete post
5. Get feed              10. Like comment
```

### Edge cases

| Scenario | Expected |
|---|---|
| Register existing email | `409` — "already exists" |
| Wrong password | `401` — "Invalid email or password" |
| Feed without auth | `401` — "not logged in" |
| Edit/delete others' post | `403` — "only edit your own" |
| Comment on missing post | `404` — "not found" |
| Refresh after logout | `401` — "Session revoked" |
| Auth rate limit | `429` after 20/15min |
| Non-image upload | `400` — Multer filter |

---

## Route Map

```
SERVER                    CLIENT
POST /auth/register      /login
POST /auth/login         /register
POST /auth/refresh       /feed
POST /auth/logout        / → redirect /login
POST /post
GET  /post?cursor=&limit=
PATCH /post/:id
DELETE /post/:id
POST /comment
POST /reply
POST /like/toggle
```
