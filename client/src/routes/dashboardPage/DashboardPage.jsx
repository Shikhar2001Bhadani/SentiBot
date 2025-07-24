import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  const handleCreateNewChat = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>SentiBot</h1>
        </div>
        <div className="options">
          <div
            className="option"
            onClick={handleCreateNewChat}
            style={{ cursor: "pointer" }}
          >
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div
            className="option"
            onClick={() => mutation.mutate("Please analyze this image")}
            style={{ cursor: "pointer" }}
          >
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div
            className="option"
            onClick={() => mutation.mutate("Please help me with this code")}
            style={{ cursor: "pointer" }}
          >
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            style={{
              backgroundColor: inputValue.trim() ? "white" : "#605e68",
              color: inputValue.trim() ? "#217bfe" : "#ececec",
              cursor: inputValue.trim() ? "pointer" : "not-allowed"
            }}
            disabled={!inputValue.trim()}
          >
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
