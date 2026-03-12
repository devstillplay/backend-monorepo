# Chat & Push Notification – Environment Variables

This document lists all environment variables to update after implementing the chat service with Pusher and OneSignal browser notifications.

---

## Backend (Root `.env` or service env)

### Chat Service – Pusher (real-time messaging)

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `PUSHER_APP_ID` | Pusher app ID | [Pusher Dashboard](https://dashboard.pusher.com) → Your app → App Keys |
| `PUSHER_KEY` | Pusher key (public, used by clients too) | Same as above |
| `PUSHER_SECRET` | Pusher secret (server-only) | Same as above |
| `PUSHER_CLUSTER` | Pusher cluster (e.g. `ap1`, `us2`) | Same as above; default `ap1` |

### Chat Service – Microservice connection

| Variable | Description |
|----------|-------------|
| `CHAT_SERVICE_HOST` | Host where chat-service runs (e.g. `localhost` or service URL) |
| `CHAT_SERVICE_PORT` | Port (default `8885`) |

### Notification Service – OneSignal (push notifications for chat)

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `ONE_SIGNAL_APP_ID` | OneSignal app ID | [OneSignal Dashboard](https://documentation.onesignal.com/docs/keys-and-ids) |
| `ONE_SIGNAL_REST_API_KEY` | OneSignal REST API key (server-only) | Same as above |

**OneSignal setup for chat:**
- Create an **"Admin"** segment in OneSignal and add support staff subscribers so they receive push when customers send messages.
- Customers receive push via `external_id` (their user ID). The admin and mobile apps call `OneSignal.login(userId)` on login.

---

## Frontend (Admin & Mobile `.env.local`)

### Pusher (client-side, real-time chat)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PUSHER_KEY` | Same as `PUSHER_KEY` from backend |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Same as `PUSHER_CLUSTER` (e.g. `ap1`) |

### OneSignal (client-side, browser push)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ONE_SIGNAL_APP_ID` | Same as `ONE_SIGNAL_APP_ID` from backend |

---

## Summary – What to update

### Root `.env` (backend / services)

```
# Chat – Pusher
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=ap1

# Chat – service connection (if not already set)
CHAT_SERVICE_HOST=localhost
CHAT_SERVICE_PORT=8885

# Notifications – OneSignal
ONE_SIGNAL_APP_ID=your_onesignal_app_id
ONE_SIGNAL_REST_API_KEY=your_onesignal_rest_api_key
```

### Admin app (`.env.local` or deployment env)

```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
NEXT_PUBLIC_ONE_SIGNAL_APP_ID=your_onesignal_app_id
```

### Mobile app (`.env.local` or deployment env)

```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
NEXT_PUBLIC_ONE_SIGNAL_APP_ID=your_onesignal_app_id
```

---

## OneSignal Web Push – Additional Setup

1. **Service worker:** Add `OneSignalSDKWorker.js` to your app’s `public` folder. Download from [OneSignal docs](https://documentation.onesignal.com/docs/web-sdk-setup#step-2-add-the-onesignal-sdk-worker-file).
2. **Admin segment:** In OneSignal, create a segment named `Admin` and add support staff who should receive chat notifications.
3. **HTTPS:** Web push requires HTTPS in production (localhost is allowed with `allowLocalhostAsSecureOrigin`).
