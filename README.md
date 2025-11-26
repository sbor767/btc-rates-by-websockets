# BTC rates by WebSockets (NestJS demo)

Demo NestJS application that pushes current BTC/USD rate to connected users via WebSocket (Socket.IO).

- A scheduled job periodically fetches the BTC/USD rate and stores it in cache.
- Users connect via WebSocket (Socket.IO `namespace: 'user'`) with a numeric `id`.
- HTTP endpoint `POST /user/notify` sends the cached rate to the corresponding WebSocket client.

---

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

---

## Manual testing

### 1. Run the application

```bash
npm install
npm run start:dev
```

By default the app listens on port `3000` (or `APP_PORT` from environment).

### 2. Testing HTTP API with Insomnia (or Postman)

Notify a user about current BTC/USD rate via WebSocket:

- **Method:** `POST`
- **URL:** `http://localhost:3000/user/notify`
- **Body (JSON):**

  ```json
  {
    "userId": 1
  }
  ```

Notes:

- `userId` must be a number.
- If validation fails or there is no active WebSocket session for this user, the API returns `400 Bad Request`.
- On success the API returns `200 OK` and sends the current rate to the user via WebSocket (the HTTP response body is empty).

### 3. Testing WebSocket notifications with Socket.IO Test Client

This project exposes a Socket.IO gateway under the `user` namespace.

You can test it using the Chrome extension **Socket.IO Test Client** (id `ophmdkgfcjapomjdpfobjfbihojchbko`).

1. Open the extension (for example by navigating to):

   ```text
   chrome-extension://ophmdkgfcjapomjdpfobjfbihojchbko/index.html
   ```

2. Open **Settings** and use:

    - **Socket.IO Server Address:**

      ```text
      http://127.0.0.1:3000/user
      ```

    - **Custom Headers Object (JSON):**

      ```json
      {
        "transports": ["websocket"],
        "query": {
          "id": "1"
        }
      }
      ```

3. Click **Set**, then **Connect**.

   In the NestJS logs you should see something like:

   ```text
   [UserGateway] User with id=1 connected with session: <sessionId>
   ```

4. Add a listener for the `rate` event in the extension UI.
5. From Insomnia call:

   ```http
   POST http://localhost:3000/user/notify
   Content-Type: application/json

   {
     "userId": 1
   }
   ```

6. You should see an incoming `rate` event in the Socket.IO Test Client similar to:

   ```json
   {
     "currencyBase": "BTC",
     "currencyQuote": "USD",
     "rate": 87604.56
   }
   ```

---

## CORS configuration (development only)

For easier local testing, CORS is enabled both in the HTTP app and in the WebSocket gateway:

```ts
// main.ts
app.enableCors({
  origin: '*',
});

// user.gateway.ts
@WebSocketGateway({
  namespace: 'user',
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  // ...
}
```

> **Important: this configuration is intended only for development.**
>
> `origin: '*'` allows requests from any domain, which is convenient for local testing but is a security risk in production.
> In a real deployment you should:
>
> - restrict `origin` to specific trusted domains (for example, your frontend URLs); or
> - configure CORS via environment-specific configuration so that `'*'` is never used in production.

---

## License

Nest is MIT licensed.