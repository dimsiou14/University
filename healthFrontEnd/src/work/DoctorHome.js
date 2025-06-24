import { useEffect, useLayoutEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Navbar, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap"
import toast from 'react-hot-toast'
import { Plus, User, Power } from "react-feather"
import "./DoctorHome.css"
import NewHistoryModal from "./NewHistoryModal"
import { optionActions } from "./redux/options"
import { userActions } from "./redux/user"
import HistoryModal from "./HistoryModal"
import { useLocation, useNavigate } from "react-router"

const TableDoctorStyles = {

    headRow: {
        style: {
            background: 'purple',
            borderRadius: 5,
            color: 'white'
        }
    }
}

const DoctorHome = () => {

    const UserInfo = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [hover, setHover] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isPrifileCardOpen, setIsProfileCardOpen] = useState()
    const [selectedUser, setSelectedUser] = useState()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [errorPage, setErrorPage] = useState(false)
    const Token = useSelector(auth => auth.auth.token)
    const location = useLocation()
    let currentToken = location.state.token


    const toggle = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const FetchData = () => {

        const isUserLoggedIn = localStorage.getItem('user')

        if (isUserLoggedIn === null || isUserLoggedIn === undefined) {
            setErrorPage(true)
        }
        else {
            const userData = JSON.parse(isUserLoggedIn)
            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${currentToken}`, 'Content-Type': 'application/json' }

            }
            Promise.all([fetch(`/user/doctorusers?DoctorID=${userData.id}`, requestOptions)]).then((res => {
                if (res[0].ok) {
                    return Promise.all([res[0].json()])
                }
                return Promise.reject(res)
            })).then((res) => {
                const success = res[0].success
                const message = res[0].message
                const items = res[0].items

                if (!success) {
                    toast.error(message)
                }
                else {
                    setData(items)
                    Promise.all([fetch(`/user/all`), requestOptions]).then((res => {
                        if (res[0].ok) {
                            return Promise.all([res[0].json()])
                        }
                        return Promise.reject(res)
                    })).then((res) => {
                        const success = res[0].success
                        const message = res[0].message
                        const items = res[0].items

                        if (!success) {
                            toast.error(message)
                        }
                        else {
                            const response = items
                            const patientList = []
                            response.map((p) => {
                                if (p.type === 0) {
                                    patientList.push({
                                        label: p.name,
                                        value: p.id.toString()
                                    })
                                }
                            })
                            dispatch(optionActions.setPatientOptions(patientList))
                        }
                    }).catch((e) => {

                        toast.error('Failed to load doctor users..!')
                    })
                }
            }).catch((e) => {

                toast.error('Failed to load doctor users..!')
            })
        }
    }

    const AddHistoryHandler = () => {
        setIsOpen(true)
    }

    const TableColumns = [
        {
            name: "Patient",
            cell: (row) => {
                return (`${row.lastName + " " + row.firstName}`)
            }
        },
        {
            name: "AFM",
            cell: (row) => {
                return (row.afm)
            }
        },
        {
            name: 'Phone',
            cell: (row) => {
                return (row.phoneNumber)
            }
        },
        {
            name: 'History',
            cell: (row) => {
                return (
                    <Button onClick={() => {
                        setSelectedUser(row.history)
                        setIsProfileCardOpen(true)
                    }}>
                        Show
                    </Button>
                )
            }
        }

    ]

    useLayoutEffect(() => {

        FetchData()
    }, [])

    useEffect(() => {
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
            {errorPage ? <div style={{
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '85vh',
                maxHeight: '86vh',
                overflow: 'auto',
                width: '98%',
                marginLeft: '1%',
                marginRight: '1%',
                marginTop: '20px'
            }}> <h2>Error Page</h2>
                Could not find user ! </div> : <div style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '85vh',
                    maxHeight: '86vh',
                    overflow: 'auto',
                    width: '98%',
                    marginLeft: '1%',
                    marginRight: '1%',
                    marginTop: '20px'
                }}>
                <DataTable
                    columns={TableColumns}
                    data={data}
                    highlightOnHover
                    customStyles={TableDoctorStyles}
                    fixedHeader
                    fixedHeaderScrollHeight="550px"
                />
                <div style={{ width: '98%', marginLeft: '1%', marginRight: '1%', marginTop: '20px', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <Button
                        color={hover ? "warning" : "secondary"}
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                        onMouseOver={() => {
                            setHover(true)
                        }}
                        onMouseLeave={() => {
                            setHover(false)
                        }}
                        onClick={AddHistoryHandler}
                    >
                        <Plus size='1.2rem' />
                    </Button>
                </div>
                {isOpen ? <NewHistoryModal isOpen={isOpen} setIsOpen={setIsOpen} FetchData={FetchData} /> : null}
                <HistoryModal isOpenHistory={isPrifileCardOpen} setIsOpenHistory={setIsProfileCardOpen} data={selectedUser} />
            </div>}
        </div>
    )
}

export default DoctorHome