import { PDFViewer } from "@react-pdf/renderer"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { Viewer , Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useLayoutEffect } from "react";

const FileViewer = (props) => {

    return (
        <Modal isOpen={props.isFileOpen} centered size="lg">
            <ModalHeader>
                
            </ModalHeader>
            <ModalBody>
                
            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl="file:///C:/University/University/healthFrontEnd/src/work/ena.pdf" />
            </Worker> */}
            </ModalBody>
            <ModalFooter>
                <Button color="danger"
                onClick={() => {
                    props.setIsFileOpen(false)
                }}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default FileViewer