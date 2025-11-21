import React from 'react';

type Props = {
  username: string;
  text: string;
  mine?: boolean;
  createdAt?: string;
};

export default function MessageBubble({ username, text, mine, createdAt }: Props) {
  return (
    <div className={`message-row ${mine ? 'mine' : ''}`}>
      <div className="message-meta">
        <strong>{username}</strong>
        <span className="time">{createdAt ? new Date(createdAt).toLocaleTimeString() : ''}</span>
      </div>
      <div className="message-bubble">{text}</div>
    </div>
  );
}
