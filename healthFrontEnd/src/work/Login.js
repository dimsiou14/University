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
} from "reactstrap"
import "./Login.css"
import imgBack from "./b.jpg"
import CardProfile from "./CardProfile"
import { useLayoutEffect } from "react"
import { userActions } from "./redux/user"
import { useDispatch } from "react-redux"
import toast from 'react-hot-toast'
import { Navigate } from "react-router"



const LogoSiou = () => {
  return <span className="textLogo">e-Health</span>
}

const BackImage = () => {
  return <img src={imgBack} alt="bimage" />
}

const Login = () => {
  
  const [activeTab, setActiveTab] = useState(1)
  const [isOpenCardProfile, setIsOpenCardProfile] = useState(false)
  const [hasLogedIn, setHasLogedIn] = useState(false)
  const [isDoctor, setIsDoctor] = useState(false)
  const dispatch = useDispatch()


  const onSubmitHandler = (e) => {
    e.preventDefault()

    const userData = {
      Name:e.target[0].value,
      Password:e.target[1].value
    }
   
    const requestOptions  = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }

    Promise.all([fetch('/myApi/auth', requestOptions)])
    .then((res) => {
      if (res[0].ok) {
        return Promise.all([res[0].json()])
      }
      return Promise.reject(res)
    }).then((res) => {
      const responseUser = res[0]
      dispatch(userActions.SetUser(responseUser))
      toast.success('Login successfully')
      setIsOpenCardProfile(true)
      setHasLogedIn(true)
      if (responseUser.type === 1) {
        setIsDoctor(true)
      }
     
    }).catch((e) => {
     
      setIsOpenCardProfile(false)
      toast.error('Failed to sign up user..!')
    })

    
  }

  const SignUpHandler = (e) => {
    e.preventDefault()
    const postVariables = []
    for (let i = 0; i < e.target.length - 1; i++) {

      console.log(e.target[i].value)
      postVariables.push(e.target[i].value)
    }

    const requestOptions  = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postVariables)
    }

    Promise.all([fetch('/myApi/newUser', requestOptions)])
    .then((res) => {
      if (res[0].ok) {
        return Promise.all([res[0]])
      }
      return Promise.reject(res)
    }).then((res) => {
      console.log(res)
    }).catch((e) => {
      console.log("Failed to sign up user..!")
    })
    
  }

  useLayoutEffect(() => {
    Promise.all([fetch('/myApi/users')])
    .then((res) => {
      if (res[0].ok) {
        return Promise.all([res[0].json()])
      }
      return Promise.reject(res)
    }).then((res) => {
      console.log(res[0])
    }).catch((e) => {
      console.log("Failed to sign up user..!")
    })
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh", background: "whitesmoke" }}>
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
          <Nav tabs fill>
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
                        borderColor: "#7270EA",
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
            <TabPane tabId={2}>
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
                    <Form style={{ width: "70%" }} onSubmit={SignUpHandler}>
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
          </TabContent>
        </Card>
        <CardProfile 
        isOpen={isOpenCardProfile}
        setIsOpen={setIsOpenCardProfile}
        />
        {hasLogedIn && isDoctor? <Navigate to="doctorhome" replace={true} /> : hasLogedIn ? <Navigate to="doctorhome" replace={true} /> : <></>}
      </div>
    </div>
  )
}

export default Login
