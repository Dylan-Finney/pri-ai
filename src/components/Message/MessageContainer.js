const MessageContainer = ({ children, prompt }) => {
  return (
    <div
      className="response"
      style={{
        backgroundColor: prompt === true ? "#f6fefc" : "#FFFFFF",
        paddingLeft: "3vw",
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
