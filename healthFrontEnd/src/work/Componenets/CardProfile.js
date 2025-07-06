import {
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Col,
  Row,
  Input,
  Form,
  Button,
} from "reactstrap"
import { User } from "react-feather"
import { Fragment, useState } from "react"
import HistoryModal from "./HistoryModal"

const CardProfile = (props) => {

  const isOpenCardProfile = props.isOpen
  const setIsOpenCardProfile = props.setIsOpen
  const [isOpenModalHistory, setIsOpenModalHistory] = useState(false)

  const HistoryHandler = () => {
    setIsOpenModalHistory(true)
  }

  return (
    <Fragment>
      <Modal isOpen={isOpenCardProfile} centered size="lg">
        <ModalHeader toggle={() => {
          setIsOpenCardProfile(!isOpenCardProfile)
        }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "grey",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <User size="1.5rem" color="white" />
            </div>
            <div style={{ marginLeft: "10px" }}>{`FirstName LastName`}</div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center align-items-center">
            <Form style={{ width: "70%" }}>
              <Row style={{ width: "100%", marginTop: "40px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    Username:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="Username" type="text" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    Password:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="Password" type="password" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    FirstName:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="FirstName" type="text" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    LastName:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="LastName" type="text" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    Email:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="Email" type="email" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "120px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    PhoneNumber:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="PhoneNumber" type="tel" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    AFM:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Input id="AFM" type="text" disabled />
                </Col>
              </Row>
              <Row style={{ width: "100%", marginTop: "20px" }}>
                <Col md={2}>
                  <Label
                    style={{
                      width: "100px",
                      fontFamily: "Montserrat,Helvetica,Arial,serif",
                    }}
                  >
                    History:
                  </Label>
                </Col>
                <Col md={3} style={{ width: "200px", marginLeft: "100px" }}>
                  <Button color="secondary" onClick={HistoryHandler}>History</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <HistoryModal isOpenHistory={isOpenModalHistory} setIsOpenHistory={setIsOpenModalHistory} />
        </ModalBody>
      </Modal>

    </Fragment>
  )
}

export default CardProfile
