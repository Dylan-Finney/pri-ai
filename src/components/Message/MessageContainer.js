const MessageContainer = ({
  children,
  prompt,
  bookmarked = false,
  asThread = true,
}) => {
  return (
    <div
      className="response"
      style={{
        backgroundColor: prompt === true ? "#f6fefc" : "#FFFFFF",
        paddingLeft: asThread ? "3vw" : "1vw",
        paddingRight: asThread ? "2vw" : "0vw",
        paddingBottom: "2vh",
        paddingTop: "1vh",
      }}
    >
      {children}
    </div>
  );
};

export default MessageContainer;
