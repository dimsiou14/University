
import { useState, useRef } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import SignaturePad from "./SignaturePad"
import Select from "react-select"
import PdfDoc from "./PdfDoc"
import { jsPDF } from "jspdf";

const NewHistoryModal = (props) => {

    const User = useSelector(state => state.user.user)
    const PatientOptions = useSelector(state => state.options.options.patients)
    const [isCanvasOpen, setIsCanvasOpen] = useState(false)
    const [text, setText] = useState("")
    const [patient, setPatient] = useState({})
    const [url, setUrl] = useState()
    const [isPdfOpen, setIsPdfOpen] = useState(false)
    const refD = useRef(null)
    const token = useSelector(auth => auth.auth.token)

    const SaveHandler = (props) => {
        if (User === undefined || User === null || !User.name.length) {
            toast.error("You have to fill Doctor field")
        } else if (Object.keys(patient).length === 0) {
            toast.error("You have to fill Patient field")
        } else if (!text.length) {
            toast.error("You have to fill the text of the perscription")
        } else if (url === undefined) {
            toast.error("You have to sign the perscription")
        } else {
            let id = 0
            // html2canvas(refD.current, {letterRendering: 1, allowTaint: true, useCORS: true}).then((canvas) => {
            // const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const img = url
            pdf.text(`Doctor`, 0, 10)
            pdf.text(`${User.name}`, 0, 20)

            pdf.text(`Patient`, 0, 40)
            pdf.text(`${patient.label}`, 0, 50)

            pdf.text(`Perscription`, 0, 70)
            pdf.text(`${text}`, 0, 80)

            //pdf.addImage(imgData, "JPEG", 0, 0)
            pdf.text("Signature", 180, 150)

            pdf.addImage(img, "JPEG", 150, 151, 50, 40)
            id = pdf.getFileId()
            pdf.save(`perscription${id}`)

            // })


            const newHistory = {
                HisotryId: 0,
                UserId: parseInt(patient.value),
                DoctorId: User.id,
                DoctorName: User.name,
                Recorded: new Date(),
                ImageSrc: `C:/Users/Dimitris/Downloads/perscription${id}.pdf`
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(newHistory)
            }

            Promise.all([fetch(`/history/add`, requestOptions)]).then((res) => {
                if (res[0].ok) {
                    return Promise.all([res[0].json()])
                }
                return Promise.reject(res)

            }).then((res) => {
                const success = res[0].success
                const message = res[0].message
                const items = res[0].items

                if (!success) {
                    toast.error(message)
                }
                else {
                    const response = items
                    toast.success("Saved successfully !")
                    props.FetchData()
                    props.setIsOpen(false)
                }
            }).catch((e) => {
                toast.error("Error at saving new history...")
                props.setIsOpen(false)
            })

        }
    }

    return (
        <div>
            <Modal isOpen={props.isOpen}>
                <ModalHeader>
                    New Perscription
                </ModalHeader>
                <ModalBody>
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                        <Label style={{ width: '100px' }}>
                            Doctor
                        </Label>
                        <Input type="text"
                            defaultValue={User.name}
                            disabled={true}
                            style={{ width: '200px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '10px' }}>
                        <Label style={{ width: '100px' }}>
                            Patient
                        </Label>
                        <div style={{ width: '200px' }}>
                            <Select
                                options={PatientOptions}
                                value={patient}
                                onChange={(option) => {
                                    setPatient(option)
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '10px' }}>
                        <Label style={{ width: '100px' }}>
                            Document
                        </Label>
                        <Input type="textarea" onChange={(e) => {
                            setText(e.target.value)
                        }}
                            style={{ width: '200px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '10px' }}>
                        <Label style={{ width: '100px' }}>
                            Signature
                        </Label>
                        <Button color="warning"
                            style={{ width: '200px' }}

                            onClick={() => {
                                setIsCanvasOpen(true)
                            }}>
                            Sign
                        </Button>
                    </div>

                    <br />

                    {url !== undefined ? <Button onClick={() => {
                        setIsPdfOpen(true)
                    }}>
                        Preview
                    </Button> : null}



                </ModalBody>
                <ModalFooter>
                    <Button color="danger"
                        onClick={() => {
                            props.setIsOpen(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <Button color="success"
                        onClick={() => {
                            SaveHandler(props)
                        }}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
            {isPdfOpen ? <PdfDoc
                isPdfOpen={isPdfOpen}
                setIsPdfOpen={setIsPdfOpen}
                url={url}
                text={text}
                doctor={User.name}
                patient={patient.label}
                refD={refD}
            /> : null}
            {isCanvasOpen ? <SignaturePad
                isCanvasOpen={isCanvasOpen}
                setIsCanvasOpen={setIsCanvasOpen}
                url={url}
                setUrl={setUrl}
            /> : null}
        </div>
    )
}

export default NewHistoryModal