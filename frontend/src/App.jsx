import { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { marked } from 'marked';


const YOU = "you";
const AI = "ai";

function App() {
  const inputRef = useRef();
  const chatContainerRef = useRef();
  const [qna, setQna] = useState([]); // [{from: 'YOU', value: ""}, {from: 'AI', value: ""}]
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false); // State for scroll button visibility

  const updateQNA = (From, Value) => {
    setQna((qna) => [...qna, { from: From, value: Value, timestamp: Date.now() }]);
    console.log(qna);
  };

  const handleSend = () => {
    const question = inputRef.current.value;
    updateQNA(YOU, question);
    //setQna([...qna, {from: YOU, value: question}]) //og qna array with question added
   
    setLoading(true);

    inputRef.current.value = ''; // To empty the input box after searching
    
    // Create the messages array for the API request
    // const messages = qna.map(item => ({
    //   role: item.from === YOU ? 'user' : 'assistant',
    //   content: item.value
    // }));
    // messages.push({ role: 'user', content: question });

    // Sending request to backend
    axios.post('http://localhost:3000/chat', { question })
      .then(response => {
        updateQNA(AI, response.data.answer);
      })
      .finally(() => {
        setLoading(false);
        
      });
  };


  // To render the qna values
  const renderContent = (qna) => {
    const value = qna.value;
    // For array elements to appear separately
    if (Array.isArray(value)) {
      return value.map((v, index) => <p key={index} className="message-text">{v}</p>);
    }
    //return <p className="message-text">{value}</p>;

    // Convert Markdown to HTML using marked
    const htmlContent = marked(value);
    return <div className="message-text" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };


  // Scroll to the bottom whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [qna, loading]);

 
  // Function to format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    // Customize the format here (e.g., 12-hour format, minutes, seconds)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Example format
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  
  return (
    <main className="container" ref={chatContainerRef}>
     
      <div className="chats">
        {
          qna.map((qna) => 
          {
            if (qna.from === YOU) {
              return (
                <div className="send chat">
                  <div className="avt-tsp">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                    alt=""
                    className="avtar"
                  />
                  <p className="timestamp">{formatTimestamp(qna.timestamp)}</p>
                  </div>
                  <p className="">{renderContent(qna)}</p>
                </div>
              );
            } else {
              return (
                <div className="recieve chat">
                  <div className="avt-tsp">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt=""
                    className="avtar"
                  />
                  <p className="timestamp">{formatTimestamp(qna.timestamp)}</p>
                  </div>
                  <p className="">{renderContent(qna)}</p>
                </div>
              );
            }
          })
        }
        {loading && (
          <div className="recieve chat">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
              alt=""
              className="avtar"
            />
            <p className="">Typing...</p>
          </div>
        )}
      </div>

      <button className="scroll-button" onClick={scrollToBottom}>⬇️</button>
    
      <div className="chat-input">
        <input
          type="text"
          ref={inputRef}
          className="form-control col"
          placeholder="Type Something"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button disabled={loading} className="btn btn-success" onClick={handleSend}>Send</button>
      </div>
      
    </main>
  );
}

export default App;
