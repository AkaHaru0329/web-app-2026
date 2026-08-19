import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  // 初回表示時にDBからメッセージ一覧を取得
  useEffect(() => {
    fetch("api/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("取得エラー:", error);
      });
  }, []);

  // メッセージ送信
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          text: text,
        }),
      });

      const newMessage = await response.json();

      setMessages((prev) => [...prev, newMessage]);

      // 名前は残して、メッセージだけ空にする
      setText("");
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  return (
    <>
      <h1>チャット</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="メッセージ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <button type="submit">
          送信
        </button>
      </form>

      <ul className="messages">
        {messages.map((m) => (
          <li key={m.id}>
            {m.username}: {m.text}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;