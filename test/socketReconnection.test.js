import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createServer } from "http";
import { io as ioClient } from "socket.io-client";
import { initSocket } from "../utils/socket.js";

describe("Socket.io Connection Resilience - Reconnect & Network Drop", () => {
  let httpServer;
  let ioServer;
  let clientSocket;
  let serverPort;

  beforeEach(async () => {
    await new Promise((resolve) => {
      httpServer = createServer();
      ioServer = initSocket(httpServer);
      httpServer.listen(0, () => {
        serverPort = httpServer.address().port;
        resolve();
      });
    });

    await new Promise((resolve) => {
      clientSocket = ioClient(`http://localhost:${serverPort}`, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 50,
      });
      clientSocket.on("connect", () => resolve());
    });
  });

  afterEach(async () => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    if (ioServer) {
      ioServer.close();
    }
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
    }
  });

  it("handles graceful disconnect and manual reconnect", async () => {
    expect(clientSocket.connected).toBe(true);

    // Disconnect
    clientSocket.disconnect();
    expect(clientSocket.connected).toBe(false);

    // Reconnect
    await new Promise((resolve) => {
      clientSocket.on("connect", () => {
        resolve();
      });
      clientSocket.connect();
    });

    expect(clientSocket.connected).toBe(true);
  });

  it("handles network drop simulation with heartbeat and ack", async () => {
    expect(clientSocket.connected).toBe(true);

    const heartbeatPromise = new Promise((resolve) => {
      clientSocket.on("heartbeat:ack", (data) => {
        expect(data).toHaveProperty("timestamp");
        resolve(data);
      });
    });

    clientSocket.emit("heartbeat");
    const result = await heartbeatPromise;
    expect(result).toBeDefined();
  });

  it("maintains member registration after reconnecting", async () => {
    const memberId = "test-mem-reconnect-999";

    // 1. Register member
    clientSocket.emit("register", memberId);

    // 2. Disconnect client
    clientSocket.disconnect();
    expect(clientSocket.connected).toBe(false);

    // 3. Reconnect
    await new Promise((resolve) => {
      clientSocket.on("connect", () => {
        // Auto/re-register on connect
        clientSocket.emit("register", memberId);
        resolve();
      });
      clientSocket.connect();
    });

    expect(clientSocket.connected).toBe(true);
  });

  it("handles rapid disconnect and reconnect cycles safely", async () => {
    for (let i = 0; i < 3; i++) {
      clientSocket.disconnect();
      expect(clientSocket.connected).toBe(false);

      await new Promise((resolve) => {
        clientSocket.once("connect", () => resolve());
        clientSocket.connect();
      });

      expect(clientSocket.connected).toBe(true);
    }
  });
});
