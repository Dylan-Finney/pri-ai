import {Tooltip, Box} from "@chakra-ui/react"

export default function AppButton(props) {
    return (
        <Tooltip label={`${props.name}`}>
            <Box style={{"box-sizing": "border-box",
                /* Auto layout */
                "display": "flex",
                "flex-direction": "row",
                "align-items": "flex-start",
                "padding": "16px",
                "gap": "4px",

                "width": "84px",
                "height": "64px",

                /* Teal / 50 */
                "background": props.checked ? "#F0FDF9" : "#FFFFFF",

                /* Teal / 600 */
                "border": props.checked ? "2px solid #0E9384" : "1px solid #EAECF0",
                "border-radius": "12px",

                /* Inside auto layout */
                "flex": "none",
                "order": 0,
                "flex-grow": 0}} onClick={()=>{props.click()}}>
                <img src={`/assets/apps/${props.source}`} alt={`${props.name} Logo`}/>
                <div style={{"box-sizing": "border-box",

                    "width": "16px",
                    "height": "16px",

                    /* Teal / 600 */
                    "background": props.checked ? "#0E9384" : "#FFFFFF",
                    /* Teal / 600 */
                    "border": props.checked ? "1px solid #0E9384" : "1px solid #D0D5DD",
                    "border-radius": "8px",

                    /* Inside auto layout */
                    "flex": "none",
                    "order": 1,
                    "flex-grow": 0}}>{
                        props.checked ? (
                        <img src={"/assets/check.svg"} style={{"position": "relative",
                        "left": "16.67%",
                        "right": "16.67%",
                        "top": "25%",
                        "bottom": "29.17%",                              
                        }} alt={"Check"}/>
                        ) : (
                            <>
                            </>
                        )
                    }
                        </div>
            </Box>
        </Tooltip>
    )
}