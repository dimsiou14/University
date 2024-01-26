import { useLayoutEffect, useState } from "react"
import ReactSignatureCanvas from "react-signature-canvas"
import { Button, Modal, ModalBody } from "reactstrap"

const SignaturePad = (props) => {

    const [signData, setSignData] = useState()

    const clearHandler = () => {
        signData.clear()
        props.setUrl('')
    }

    const SaveHandler = () => {
        props.setUrl(signData.getTrimmedCanvas().toDataURL(`sign${new Date()}`))
        props.setIsCanvasOpen(false)
    }

    useLayoutEffect(() => {
        if (signData !== undefined) {
            signData.clear()
            props.setUrl('')
        }
      
    }, [])
  

    return(
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', borderWidth:'1px', borderColor:'black'}}>
            <Modal isOpen={props.isCanvasOpen}>
                <ModalBody>

         
            <ReactSignatureCanvas
            id="can"
            canvasProps={{width:'500px', height:'200px', className:'signcanvas', style:{cursor:'crosshair'}}}
            ref={(data) => {
                setSignData(data)
            }}
            penColor="darkblue"
            
            clearOnResize={false}>

            </ReactSignatureCanvas>
            <Button
            color="danger"
            onClick={clearHandler}
            >
                Clear
            </Button>
            <Button
            color="success"
            onClick={SaveHandler}
            >
                Save
            </Button>
      
            </ModalBody>
            </Modal>
        </div>
    )
}

export default SignaturePad