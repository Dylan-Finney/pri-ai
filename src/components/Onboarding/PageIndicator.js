export default function PageIndicator(props) {
    return (
        <div style={{display: "flex", flexDirection: "row", marginBottom: "3vh", marginLeft: "auto", marginRight: "auto"}}>
                    {props.step === 0 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
                    {props.step === 1 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
        </div>
    )
}