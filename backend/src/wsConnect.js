import WebSocket from 'ws';
import Message from "./models/mess.js";

const sendData = (data, ws) => {
  ws.send(JSON.stringify(data));
};

const broadcastMessage = (wss, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendData(data, client);
    }
  });
};

export default {
  initData: (ws) => {
    Message.find({}).sort({ createdAt: -1 }).limit(100).exec((err, res) => {
      if (err) throw err;
      sendData(["init", res], ws);
    });
  },
  onMessage: (wss, ws) => (
    async (byteString) => {
      const { data } = byteString;
      const [task, payload] = JSON.parse(data);
      
      switch (task) {
        case "input": {
          const { send, to, body } = payload;
          const message = new Message({ send, to, body });
          try {
            await message.save();
            broadcastMessage(wss, ['output', [payload]]);
          } catch (e) {
            console.error("Message DB save error: " + e);
          }
          break;
        }
        case 'clear': {
          Message.deleteMany({}, () => {
            broadcastMessage(wss, ['cleared'], { type: "info", msg: "Message cache cleared." });
          });
          break;
        }
        default: break;
      }
    }
  )
};
