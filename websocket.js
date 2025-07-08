let { updateFoodQuantity } = require("./database");
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080, noDelay: true, perMessageDeflate: false });

wss.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send("connection established");
  ws.on("close", () => console.log("Client has disconnected!"));
  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);
      console.log(`distributing message: ${data}`);
      console.log(`distributing message: ${parsedData}`);

      console.log(parsedData);

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
