import { useState, useEffect, useRef } from "react";
import { Tabs, Input, Tag } from "antd";
import { useChat } from "./hooks/useChat";
import styled from "styled-components";
import Title from "../components/Title";
import Message from "../components/Message";
import ChatModal from "../components/ChatModal";

const ChatBoxesWrapper = styled(Tabs)`
  width: 100%;
  height: 300px;
  background: #eeeeee52;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
`;

const ChatBoxWrapper = styled.div`
  height: 204px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const FootRef = styled.div`
  height: 20px;
`;

const ChatRoom = () => {
  const { me, messages, msgSent, setMsgSent, sendMessage, displayStatus } = useChat();
  const [chatBoxes, setChatBoxes] = useState([]);
  const [activeKey, setActiveKey] = useState("");
  const [msg, setMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const msgFooter = useRef(null);

  const displayChat = (chat) => (
    chat.length === 0 ? (
      <p style={{ color: "#ccc" }}> No message... </p>
    ) : (
      <ChatBoxWrapper>
        {chat.map(({send, body}, i) => (
          <Message isMe={send === me} message={body} key={i} />
        ))}
        <FootRef ref={msgFooter} />
      </ChatBoxWrapper>
    )
  );

  const extractChat = (friend) => {
    return displayChat(
      messages.filter(({ send, to }) => (to === friend && send === me) || (to === me && send === friend))
    );
  };

  useEffect(() => {
    setChatBoxes(chatBoxes.map(box => ({
      ...box,
      children: extractChat(box.key)
    })));
  }, [messages]);

  const createChatBox = (friend) => {
    if (chatBoxes.some(({ key }) => key === friend)) {
      throw new Error(`${friend}'s chat box has already opened.`);
    }
    const chat = extractChat(friend);
    setChatBoxes([...chatBoxes, { label: friend, children: chat, key: friend }]);
    setActiveKey(friend);
    return friend;
  };

  const removeChatBox = (targetKey, activeKey) => {
    let newActiveKey = activeKey;
    const index = chatBoxes.findIndex(({ key }) => key === targetKey);
    const newChatBoxes = chatBoxes.filter(({ key }) => key !== targetKey);

    if (newActiveKey === targetKey) {
      if (newChatBoxes.length) {
        newActiveKey = index === 0 ? newChatBoxes[0].key : newChatBoxes[index - 1].key;
      } else {
        newActiveKey = "";
      }
    }
    
    setChatBoxes(newChatBoxes);
    setActiveKey(newActiveKey);
  };

  const scrollToBottom = () => {
    msgFooter.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    scrollToBottom();
    setMsgSent(false);
  }, [msgSent]);

  return (
    <>
      <Title name={me} />
      <ChatBoxesWrapper
        tabBarStyle={{ height: '36pt' }}
        type="editable-card"
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={(targetKey, action) => {
          if (action === 'add') setModalOpen(true);
          else if (action === 'remove') removeChatBox(targetKey, activeKey);
        }}
        items={chatBoxes}
      />
      <ChatModal
        open={modalOpen}
        onCreate={({ name }) => {
          setActiveKey(createChatBox(name));
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
      <Input.Search
        value={msg}
        onChange={e => setMsg(e.target.value)}
        enterButton="Send"
        placeholder="Type a message here..."
        onSearch={msg => {
          if (!msg) {
            displayStatus({
              type: "error",
              msg: "Please enter a message body."
            });
            return;
          }
          sendMessage({ send: me, to: activeKey, body: msg });
          setMsg("");
        }}
      />
    </>
  );
};

export default ChatRoom;
