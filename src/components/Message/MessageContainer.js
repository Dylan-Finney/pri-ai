const MessageContainer = ({ children, prompt, bookmarked = false }) => {
  return (
    <div
      className="response"
      style={{
        backgroundColor: prompt === true ? "#f6fefc" : "#FFFFFF",
        paddingLeft: !bookmarked ? "3vw" : "1vw",
        paddingRight: "2vw",
        paddingBottom: "2vh",
        paddingTop: "1vh",
      }}
    >
      {children}
    </div>
  );
};

export default MessageContainer;
