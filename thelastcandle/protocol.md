# WebSocket Communication Protocol

This guide explains the WebSocket communication protocol used in the example multiplayer-game.

---

## Message Types

The protocol uses specific message types to communicate between the client and server. Each message consists of a single character indicating the type, followed by optional JSON-encoded data.

### 1. **Initialization (`i`):**

- **Type:** `i`
- **Description:** Sent by the server to initialize the game state for a player.
- **Data Format:**

### 2. **Position Update (`p`):**

- **Type:** `p`
- **Description:** Sent by a client to update their position, or by the server to update another player’s position.
- **Data Format (Client to Server):**
  ```json
  [x, y]
  ```
  - `x`, `y`: The new coordinates of the player.
- **Data Format (Server to Clients):**
  ```json
  [playerId, x, y]
  ```
  - `playerId`: The ID of the player whose position is updated.
  - `x`, `y`: The new coordinates of the player.

### 3. **Candle Collection (`v`):**

- **Type:** `v`
- **Description:** Sent by a client to indicate a candle collection, or by the server to update scores and candles after a collection.
- **Data Format (Client to Server):**
  ```json
  <candleId>
  ```
  - `candleId`: ID of the candle obtained.
- **Data Format (Server to Clients):**
  ```json
  <candleId>
  ```
  - `candleId`: Identifier for the collected candle.

### 3. **Place Candle on Ritual (`l`):**

- **Type:** `l`
- **Description:** Sent by a client to indicate a ritual has been used, or by the server to remove the ritual and update the scores.
- **Data Format (Client to Server):**
  ```json
  <ritualId>
  ```
  - `ritualId`: ID of the ritual that's being used.
- **Data Format (Server to Clients):**
  ```json
  <ritualId>
  ```
  - `ritualId`: Identifier for the used ritual.



## Example Communication

### Server Initialization

1. **Server to Client:**
    ```text
    i{"id":1,"p":[[100,100,1,"0xff0000"],[300,300,2,"0x0000ff"]]}
    ```
    - Initializes the player (ID: 1) and provides initial positions and colors of both players.

### Player Position Update

2. **Client to Server:**
    ```text
    p[1,150,150]
    ```
    - Player (ID: 1) updates their position to (150, 150).

3. **Server to Client:**
    ```text
    p[2,320,320]
    ```
    - Server updates the position of player (ID: 2) to (320, 320).

### Square Spawn

4. **Server to Client:**
    ```text
    s[400,400]
    ```
    - A new square is spawned at (400, 400).

### Square Collection

5. **Client to Server:**
    ```text
    c
    ```
    - Player collects the square.

6. **Server to Clients:**
    ```text
    c[1,5,3]
    ```
    - Square (ID: 1) was collected. Player scores are updated: 5 for the collecting player, 3 for the other player.

### Time Update

7. **Server to Client:**
    ```text
    t45
    ```
    - Updates the remaining time to 45 seconds.

### Game Over

8. **Server to Client:**
    ```text
    o[7,5]
    ```
    - The game ends with a score of 7 for the player and 5 for the opponent.

---

## Notes

- All messages start with a single character representing the message type.
- Clients must handle messages asynchronously as they are received from the server.
- The server is responsible for synchronizing game state and broadcasting updates to all clients.