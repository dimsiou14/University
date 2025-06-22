import { useState } from "react"
import {
  Card,
  Col,
  Row,
  TabContent,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  Form,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap"
import "./Login.css"
import CardProfile from "./CardProfile"
import { userActions } from "./redux/user"
import { useDispatch, useSelector } from "react-redux"
import toast from 'react-hot-toast'
import { Navigate } from "react-router"
import Select from "react-select"
import { authActions } from "./redux/auth"

const LogoSiou = () => {
  return <span className="textLogo">e-Health</span>
}

const Login = () => {

  const [activeTab, setActiveTab] = useState(1)
  const [isOpenCardProfile, setIsOpenCardProfile] = useState(false)
  const [hasLogedIn, setHasLogedIn] = useState(false)
  const [isDoctor, setIsDoctor] = useState(false)
  const [userType, setUserType] = useState({ label: 'Patient', value: '0' })
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const dispatch = useDispatch()
  const User = useSelector(state => state.user.user)
  const Token = useSelector(auth => auth.auth.token)
  const [currentToken, setCurrentToken] = useState("")

  const onSubmitHandler = (e) => {
    e.preventDefault()

    const userData = {
      Name: e.target[0].value,
      Password: e.target[1].value
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }

    let userLocal = 0

    let localToken = ""
    Promise.all([fetch('/myApi/auth', requestOptions)])
      .then((res) => {
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
          const responseToken = items.token
          dispatch(authActions.setToken(responseToken))
          localToken = responseToken
          setCurrentToken(responseToken)
          const responseUser = items.user
          userLocal = responseUser.id

          if (!responseUser.hasOTP) {

            dispatch(userActions.SetUser(responseUser))
            localStorage.setItem('user', JSON.stringify(responseUser))
            toast.success('Login successfully')
            setIsOpenCardProfile(true)
            setHasLogedIn(true)
            if (responseUser.type === 1) {
              setIsDoctor(true)
            }
          } else {

            dispatch(userActions.SetUser(responseUser))

            const createOtpItem = {
              Id: userLocal,
              Code: ''
            }
            const requestOptions1 = {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${localToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(createOtpItem)
            }

            Promise.all([fetch('/myApi/otp/create', requestOptions1)])
              .then((res) => {
                if (res[0].ok) {
                  return Promise.all([res[0].text()])
                }
                return Promise.reject(res)
              }).then((res) => {
                const responseCreate = res[0]
                setIsOtpModalOpen(true)

              }).catch((e) => {
                setIsOtpModalOpen(false)
                setIsOpenCardProfile(false)
                toast.error('Failed to create otp code..!')
              })
          }
        }

      }).catch((e) => {

        setIsOpenCardProfile(false)
        toast.error('Failed to auth user..!')
      })


  }

  const SignUpHandler = (e) => {

    e.preventDefault()
    const postVariables = []

    for (let i = 0; i < e.target.length - 1; i++) {
      console.log(e.target[i].type)
      if (i === 2) {
        continue
      }

      postVariables.push(e.target[i].type === 'checkbox' ? e.target[i].checked.toString() : e.target[i].value)
    }
    postVariables.push(userType.value)

    if (postVariables.length >= 9) {

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postVariables)
      }

      Promise.all([fetch('/myApi/newUser', requestOptions)])
        .then((res) => {
          if (res[0].ok) {
            return Promise.all([res[0].json()])
          }
          return Promise.reject(res)
        }).then((res) => {
          console.log(res[0])
          toast.success("New user saved successfully !")
          setActiveTab(1)
        }).catch((e) => {
          console.log("Failed to sign up user..!")
        })
    } else {
      toast.error("You have to fill all the fields...")
    }

  }

  const ValidateOTP = (e) => {
    e.preventDefault()
    const code = e.target[0].value
    if (!code.length) {
      toast.error("You have to fill the OTP input field")
    } else {

      const auth = {
        Id: User.id,
        Code: code
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(auth)
      }

      Promise.all([fetch('/myApi/authOTP', requestOptions)])
        .then((res) => {
          if (res[0].ok) {
            return Promise.all([res[0].json()])
          }
          return Promise.reject(res)
        }).then((res) => {
          const responseUser = res[0]
          dispatch(userActions.SetUser(responseUser))
          localStorage.setItem('user', JSON.stringify(responseUser))
          toast.success('Login successfully')
          setIsOpenCardProfile(true)
          setHasLogedIn(true)
          if (responseUser.type === 1) {
            setIsDoctor(true)
          }
          setIsOtpModalOpen(false)

        }).catch((e) => {
          toast.error("Failed to auth with otp code")
        })
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: 'whitesmoke' }}>
      <div className="d-flex justify-content-center align-items-center">
        <Card
          style={{
            borderRadius: 5,
            width: "70vw",
            height: "90vh",
            marginTop: "5vh",
            // backgroundImage:<img src={imgBack} />
          }}
        >

          <Nav tabs fill style={{ height: '45px' }}>
            <NavItem>
              <NavLink
                active={activeTab === 1}
                id="tabLink"
                onClick={() => {
                  setActiveTab(1)
                }}
                style={
                  activeTab === 1
                    ? {
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottom: "5px solid",
                      borderColor: "#7270EA"
                    }
                    : {}
                }
              >
                Sign In
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                active={activeTab === 2}
                id="tabLink"
                onClick={() => {
                  setActiveTab(2)
                }}
                style={
                  activeTab === 2
                    ? {
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottom: "5px solid",
                      borderColor: "#7270EA",
                    }
                    : {}
                }
              >
                Sign Up
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <Row md={2}>
                <Col md={5}>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ background: "#c4c4c4" }}
                  >
                    <LogoSiou />
                  </div>
                </Col>
                <Col md={7}>
                  <div className="d-flex justify-content-center align-items-center">
                    <Form style={{ width: "70%" }} onSubmit={onSubmitHandler}>
                      <Row style={{ width: "100%", marginTop: "50%" }}>
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="Username" type="text" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="Password" type="password" />
                        </Col>
                      </Row>
                      <Input
                        type="submit"
                        style={{
                          marginTop: "50px",
                          background: "pink",
                          color: "white",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                        }}
                      />
                    </Form>
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId={2} style={{ maxHeight: '500px' }}>
              <Row md={2} >
                <Col md={5}>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ background: "#c4c4c4" }}
                  >
                    <LogoSiou />
                  </div>
                </Col>
                <Col md={7} style={{ maxHeight: '500px' }}>
                  <div className="d-flex justify-content-center align-items-center" style={{ overflowY: 'auto', maxHeight: '650px' }}>
                    <Form style={{ width: "70%" }} onSubmit={SignUpHandler}>
                      <Row style={{ width: "100%", marginTop: "80px" }}>
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="Username" type="text" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="Password" type="password" />
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
                            UserType:
                          </Label>
                        </Col>
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Select
                            options={[{ label: 'Patient', value: '0' },
                            { label: 'Doctor', value: '1' }]}
                            defaultValue={{ label: 'Patient', value: '0' }}

                            onChange={(option) => {
                              setUserType(option)
                            }}
                          />

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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="FirstName" type="text" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="LastName" type="text" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="Email" type="email" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="PhoneNumber" type="tel" />
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
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="AFM" type="text" />
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
                            HasOTP:
                          </Label>
                        </Col>
                        <Col
                          md={3}
                          style={{ width: "200px", marginLeft: "100px" }}
                        >
                          <Input id="hasOTP" type="checkbox" />
                        </Col>
                      </Row>


                      <Input
                        type="submit"
                        style={{
                          marginTop: "10px",
                          background: "pink",
                          color: "white",
                          fontSize: "1.1rem",
                          fontWeight: "bold"
                        }}
                      />
                    </Form>
                  </div>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Card>
        <CardProfile
          isOpen={isOpenCardProfile}
          setIsOpen={setIsOpenCardProfile}
        />
        {hasLogedIn && isDoctor ? <Navigate to="doctorhome" replace={true} state={{ token: currentToken }} /> : hasLogedIn ? <Navigate to="home" replace={true} /> : <></>}
        <Modal isOpen={isOtpModalOpen}>
          <ModalHeader>
            OTP Authentication
          </ModalHeader>
          <ModalBody >

            <Form id="otpForm" onSubmit={ValidateOTP}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <p>
                  Please fill the following input with the OTP auth code that we sent you in your email.
                </p>
                <Input name="otp" type='text' style={{ width: '200px' }} placeholder="OTP Code" />
                <Input type="submit" form="otpForm" style={{ width: '200px', marginTop: '20px', background: 'blue', color: 'white' }} />
              </div>
            </Form>

          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}

export default Login
