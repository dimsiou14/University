
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"

const NewHistoryModal = (props) => {

    const User = useSelector(state => state.user.user)

    const SaveHandler = (props) => {

        
        const newHistory = {
            UserId : 1,
            DoctorId : User.id,
            DoctorName : User.name,
            Recorded : new Date(),
            ImageSrc : `./ImageRepos/${new Date()}`
        }

        const requestOptions = {
            method:'POST',
            type:'application/json',
            body:JSON.parse(newHistory)
        }

        Promise.all([fetch(`/myApi/history/add`, requestOptions)]).then((res) => {
            if (res[0].ok) {
                return Promise.all([res[0].json()])
              }
              return Promise.reject(res)

        }).then((res) => {
            const response = res[0]
            toast.success("Saved successfully !")
        }).catch((e) => {
            toast.error("Error at saving new history...")
        })
      
        props.setIsOpen(false)
    }

    return (
        <div>
            <Modal isOpen={props.isOpen}>
                <ModalHeader>
                    New History
                </ModalHeader>
                <ModalBody>
                    <Input type='select'/>
                    <Input type="file" />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger"
                    onClick={() => {
                    props.setIsOpen(false)
                    }}
                    >
                        Cancel
                    </Button>
                    <Button color="warning"
                    onClick={() => {
                        props.setCanvasOpen(true)
                    }}>
                        Sign
                    </Button>
                    <Button color="success"
                    onClick={() => {
                        SaveHandler(props)
                    }}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default NewHistoryModal