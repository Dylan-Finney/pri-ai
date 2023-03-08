import { Box, Text } from "@chakra-ui/react"
import { MdOutlineVerifiedUser,MdCheck,MdSearch } from 'react-icons/md';
export default function OnboardingSidebar(props) {
    return (
        <Box display={{base: "none", sm: "block"}} style={{backgroundColor:"#F9FAFB", flex: 2, "max-height": "100%", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: "10px solid transparent"}}>
                  <div style={{display: "flex", flexDirection: "row",  justifyContent: "center", "alignItems": "center", marginTop: "auto", height: "100%"}}> 
                  
                  
                  <div style={{display: "flex", flexDirection: "column"}}>
                 
                  {
                    props.onboardingStep === 0 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Your personal AI</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>Give your AI a name and face</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Your personal AI</Text>
                      <Text marginBottom={"2vh"}>Give your AI a name and face.</Text>
                      </div>
                      </div>
                      </>
                    )
                  }
                  {
                    props.onboardingStep === 1 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Personalize your experience</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                        props.onboardingStep === 0? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Personalize your experience</Text>
                      <Text marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Personalize your experience</Text>
                      <Text marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  {
                    props.onboardingStep === 2 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Train your AI</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                        props.onboardingStep < 2? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Train your AI</Text>
                      <Text marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Train your AI</Text>
                      <Text marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  {
                    props.onboardingStep ===  3 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>


                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Privacy disclaimer</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                        props.onboardingStep < 3? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>


                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Privacy disclaimer</Text>
                      <Text marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>

                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Privacy disclaimer</Text>
                      <Text marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  
                  
                  </div>
                  </div>
                </Box>
    )
}