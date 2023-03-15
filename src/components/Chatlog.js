import { Box} from "@chakra-ui/react"

export function Chatlog(props) {
    const { onboarding, children } = props;
    
    return (
        <Box id="chatlog" flexGrow={1} justifyContent={onboarding ? "center" : null} alignItems={onboarding ? "center" : null} textAlign={onboarding ? "center" : null} style={{backgroundColor: onboarding ? "#F6FEFC" : "#fcfcfd",whiteSpace: "pre-wrap","overflow-y": "scroll", "scroll-behavior": "smooth", "border-left": "1px solid #eaecf0", "border-top": "1px solid #eaecf0", "display": "flex", "flexDirection": "column"}}>
            {children}
        </Box>
    )
}