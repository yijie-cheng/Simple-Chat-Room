import { createContext, useContext, useState, useEffect, useRef } from "react";
import { message as antMessage } from "antd";

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
  status: {},
  me: "",
  signedIn: false,
  messages: [],
  msgSent: false,
  sendMessage: () => {},
  clearMessages: () => {},
});

const ChatProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({});
  const [me, setMe] = useState(savedMe || '');
  const [signedIn, setSignedIn] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:4000');

    ws.current.onmessage = (byteString) => {
      const { data } = byteString;
      const [task, payload] = JSON.parse(data);
      switch (task) {
        case "output": {
          console.log("output");
          setMessages(prevMessages => [...prevMessages, ...payload]);
          setMsgSent(true);
          break;
        }
        case "status": {
          setStatus(payload);
          break;
        }
        case "init": {
          setMessages(payload);
          break;
        }
        case "cleared": {
          setMessages([]);
          break;
        }
        default: break;
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendData = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  const sendMessage = (payload) => {
    console.log(payload);
    sendData(["input", payload]);
  };

  const clearMessages = () => {
    sendData(["clear"]);
  };

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s;
      const content = {
        content: msg,
        duration: 0.5,
      };
      switch (type) {
        case "success":
          antMessage.success(content);
          break;
        case "error":
        default:
          antMessage.error(content);
          break;
      }
    }
  };

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn, me]);

  return (
    <ChatContext.Provider
      value={{
        status,
        me,
        signedIn,
        messages,
        msgSent,
        setMe,
        setSignedIn,
        setMessages,
        setMsgSent,
        sendMessage,
        clearMessages,
        displayStatus,
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
