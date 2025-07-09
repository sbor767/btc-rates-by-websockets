# BTC Rates via WebSocket (NestJS)

![Node.js](https://img.shields.io/badge/node.js-18.x-green)
![NestJS](https://img.shields.io/badge/nestjs-%F0%9F%90%BC-red)
![WebSocket](https://img.shields.io/badge/websocket-socket.io-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

Modular WebSocket + REST backend built with NestJS for streaming Bitcoin price updates and handling client sessions by ID.

> ⚠️ **Disclaimer:** This project was developed in 2022. Dependencies may be outdated and could contain known security vulnerabilities. Use for educational purposes or refactor dependencies before using in production.

---

## 📋 Overview

This project demonstrates a clean and scalable backend architecture using NestJS for real-time crypto data delivery. It includes:

* Periodic BTC/USDT price fetch from [CryptoCompare API](https://min-api.cryptocompare.com/)
* WebSocket server to accept client connections and store sessions by `id`
* In-memory session cache
* REST API to notify specific clients by ID
* WebSocket session cleanup on disconnect

Designed with modularity, extensibility, and maintainability in mind.

---

## 🚀 Features

* NestJS framework
* WebSocket Gateway (`@WebSocketGateway`) for bi-directional communication
* Periodic price fetch from CryptoCompare every 60 seconds
* In-memory session tracking per connected client
* REST endpoint to trigger message to a specific client
* No external DB — lightweight and fast

---

## 🛠️ Tech Stack

* [NestJS](https://nestjs.com/)
* WebSocket (native via `socket.io`)
* REST via Nest HTTP controllers
* dotenv for config

---

## 📦 Installation

```bash
git clone https://github.com/sbor767/btc-rates-by-websockets.git
cd btc-rates-by-websockets
npm install
```

Create a `.env` file:

```env
PORT=3000
```

---

## 🏃 Usage

```bash
npm run start:dev
```

### 1. Connect via WebSocket

Client sends:

```ts
socket.emit('identify', 'user-id-123');
```

### 2. REST call triggers price push

```bash
curl -X POST http://localhost:3000/api/session -H 'Content-Type: application/json' -d '{"id": "user-id-123"}'
```

— If session exists, BTC price is sent to this user's socket.

---

## 🔧 Structure

```
src/
├── main.ts
├── app.module.ts
└── modules/
    ├── cryptocurrency-rate/       # BTC rate fetcher service
    └── client-session/            # WebSocket + REST session handling
```

---

## 🔒 Notes & Limitations

* Price is cached in memory and refreshed every 60 seconds
* WebSocket reconnect handling not implemented (can be added)
* No database is used to keep it lightweight and fast

---

## 🙋 Author

**Aleksandr Borkov**
[GitHub](https://github.com/sbor767) • [LinkedIn](https://www.linkedin.com/in/aleksandr-n-borkov/)

---

## 📄 License

MIT License — feel free to fork, adapt, or build upon.
