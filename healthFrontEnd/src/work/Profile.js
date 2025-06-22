import { Button, Input, Label, UncontrolledTooltip, Form, Navbar, DropdownItem, Dropdown, DropdownToggle, DropdownMenu, Col } from 'reactstrap'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useLayoutEffect } from 'react'
import HistoryModal from './HistoryModal'
import { Power, Save, Settings, User } from 'react-feather'
import toast from 'react-hot-toast'
import { userActions } from './redux/user'
import { useNavigate } from 'react-router'

const Profile = () => {
    const UserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState(false)
    const [isOpenModalHistory, setIsOpenModalHistory] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const toggle = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const HistoryHandler = () => {
        setIsOpenModalHistory(true)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault()
        const postVariables = []
        for (let i = 1; i < e.target.length - 1; i++) {
            if (i === 3) {
                postVariables.push(e.target[i].value === 'Doctor' ? "1" : "0")
                continue
            }
            postVariables.push(e.target[i].type === 'checkbox' ? e.target[i].checked.toString() : e.target[i].value)
        }

        const objToSave = []
        if (postVariables.length >= 9) {

            objToSave.push(postVariables[0])
            objToSave.push(postVariables[1])
            objToSave.push(postVariables[3])
            objToSave.push(postVariables[4])
            objToSave.push(postVariables[5])
            objToSave.push(postVariables[6])
            objToSave.push(postVariables[7])
            objToSave.push(postVariables[8])
            objToSave.push(postVariables[2])
            objToSave.push(UserInfo.id.toString())

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objToSave)
            }

            Promise.all([fetch('/myApi/newUser', requestOptions)])
                .then((res) => {
                    if (res[0].ok) {
                        return Promise.all([res[0].json()])
                    }
                    return Promise.reject(res)
                }).then((res) => {
                    const response = res[0]
                    dispatch(userActions.SetUser(response))
                    setIsEdit(false)
                    toast.success("User info updated successfully !")

                }).catch((e) => {
                    console.log("Failed to sign up user..!")
                })
        }
    }

    useLayoutEffect(() => {
        const isUserLoggedIn = localStorage.getItem('user')
        if (isUserLoggedIn) {
            const userData = JSON.parse(isUserLoggedIn)
            dispatch(userActions.SetUser(userData))

        }
    }, [])
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Navbar style={{ width: '98%', marginLeft: '1%', background: 'purple', borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Col sm={11} md={11} lg={11} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <span style={{ color: 'white' }}>
                        e-Health
                    </span>
                </Col>

                <Col sm={1} md={1} lg={1} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>

                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle style={{ background: 'purple', color: 'white', borderColor: 'purple' }}>{UserInfo.name}  &nbsp; <User /></DropdownToggle>
                        <DropdownMenu >
                            <DropdownItem onClick={() => {
                                localStorage.clear()
                                navigate(`/`)
                            }}><span> Logout  <Power size={16} /></span></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Navbar>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div className="card">
                    <div className="display-picture">
                        <img src='https://png.pngtree.com/png-vector/20190629/ourlarge/pngtree-business-people-avatar-icon-user-profile-free-vector-png-image_1527664.jpg' alt='display'></img>
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                            <Button style={{ marginLeft: '0px', marginTop: '0px', padding: 0, background: 'transparent', borderColor: 'transparent', color: 'black' }}>
                                <Settings
                                    id='ed'

                                    onClick={() => {
                                        setIsEdit(true)
                                    }}
                                />
                                <UncontrolledTooltip
                                    target={"ed"}>
                                    Edit
                                </UncontrolledTooltip>
                            </Button>
                            <Button type='submit' form='sb' style={{ marginTop: '0px', padding: 0, background: 'transparent', borderColor: 'transparent', color: 'black' }}>
                                <Save
                                    id='sav'

                                    style={{ marginLeft: '0px', marginTop: '0px' }}

                                />
                                <UncontrolledTooltip
                                    target={"sav"}>
                                    Save
                                </UncontrolledTooltip>
                            </Button>
                        </div>
                    </div>

                    <div className="banner">
                        <img src='https://png.pngtree.com/back_origin_pic/04/10/06/9fe7faf4c574e8a762130d49df15b300.jpg' alt='banner'></img>
                    </div>

                    <div className="content">
                        <Form onSubmit={onSubmitHandler} id='sb'>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>

                                <Label style={{ width: '100px', marginLeft: '50px' }}>Username </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.name}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>Password </Label>
                                <Input
                                    type='password'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.password}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>UserType </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.type === 0 ? "Patient" : "Doctor"}
                                    disabled={true} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>FirstName </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.firstname}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>LastName </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.lastname}
                                    disabled={!isEdit} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>Email </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.email}
                                    disabled={!isEdit} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>Phone </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.phoneNumber}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>AFM </Label>
                                <Input
                                    type='text'
                                    style={{ width: '200px', marginLeft: '50px' }}
                                    defaultValue={UserInfo.afm}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>HasOTP </Label>
                                <Input
                                    type='checkbox'
                                    style={{ marginLeft: '50px' }}
                                    defaultChecked={UserInfo.hasOTP}
                                    disabled={!isEdit}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', justifyItems: 'start', flexDirection: 'row', marginTop: '10px ' }}>
                                <Label style={{ width: '100px', marginLeft: '50px' }}>History </Label>

                                <Button style={{ width: '200px', marginLeft: '50px' }} onClick={HistoryHandler}>
                                    Show
                                </Button>
                            </div>

                        </Form>
                    </div>
                </div>

                <HistoryModal isOpenHistory={isOpenModalHistory} setIsOpenHistory={setIsOpenModalHistory} data={UserInfo.history} />
            </div>

        </div>
    )
}

export default Profile