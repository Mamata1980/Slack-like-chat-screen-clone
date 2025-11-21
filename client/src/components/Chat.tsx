import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { fetchMessages } from '../api';
import MessageBubble from './MessageBubble';

type Message = {
  _id?: string;
  username: string;
  text: string;
  createdAt?: string;
};

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState(() => `User${Math.floor(Math.random()*900+100)}`);
  const socketRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages().then((msgs: Message[]) => {
      setMessages(msgs);
      scrollToBottom();
    });

    socketRef.current = io(SOCKET_URL);
    const s = socketRef.current;

    s.on('connect', () => {
      s.emit('join', username);
    });

    s.on('receive_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      s.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const send = () => {
    if (!text.trim()) return;
    const payload = { username, text };
    socketRef.current.emit('send_message', payload);
    setText('');
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Channels</h3>
        <div className="channel"># general</div>
        <div className="channel"># random</div>
        <hr />
        <h4>Your name</h4>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="chat-main">
        <div className="chat-header">General — Slack-like Chat</div>

        <div className="messages">
          {messages.map((m) => (
            <MessageBubble
              key={(m as any)._id || Math.random()}
              username={m.username}
              text={m.text}
              createdAt={m.createdAt}
              mine={m.username === username}
            />
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="composer">
          <input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
