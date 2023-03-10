const { createStandaloneToast } = require("@chakra-ui/react");

const { ToastContainer, toast } = createStandaloneToast()
const id = 'toastError'
export function errorToasts(props) {
    if (!toast.isActive(id)) {
        if(props.error === "Rate Limit") {
            toast({
              title: 'Error',
              description: "You've sent too many questions. Please try again another time.",
              status: 'error',
              duration: 9000,
              id,
              position: "top-left",
              isClosable: true,
            })
        } else {
            toast({
                title: 'Error',
                description: "Unable to send question. Please try again.",
                status: 'error',
                duration: 9000,
                id,
                position: "top-left",
                isClosable: true,
            })
        }      
    }
    
}

export function Container(){
    return (
        <>
        <ToastContainer/>
        </>
    )
}