let { updateFoodQuantity, updateReservationApproval } = require("./database");
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080, noDelay: true, perMessageDeflate: false });

wss.on("connection", (ws) => {
  // ws.send("connection established");
  // ws.on("close", () => console.log("Client has disconnected!"));
  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);
      switch (parsedData.type) {
        case "food-quantity-change":
          updateFoodQuantity(parsedData.id, parsedData.quantity, (err) => {
            if (!err) {
              wss.clients.forEach((client) => {
                client.send(JSON.stringify(parsedData));
              });
            }
          });
          break;
        case "reservation-state-change":
          updateReservationApproval(parsedData.id, parsedData.approved, (err) => {
            if (!err) {
              wss.clients.forEach((client) => {
                client.send(JSON.stringify(parsedData));
              });
            }
          });
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});

module.exports = wss;
