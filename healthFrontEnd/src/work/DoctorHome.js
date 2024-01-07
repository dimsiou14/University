import { useLayoutEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { useSelector } from "react-redux"
import { Button, Col, Navbar } from "reactstrap"
import toast from 'react-hot-toast'
import { Plus } from "react-feather"
import "./DoctorHome.css"
import NewHistoryModal from "./NewHistoryModal"


const DoctorHome = () => {

    const User = useSelector(state => state.user.user)
    const [data, setData] = useState([])
    const [hover, setHover] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const FetchData = () => {

        Promise.all([fetch(`/myApi/doctorusers`)]).then((res => {
            if (res[0].ok) {
                return Promise.all([res[0].json()])
              }
              return Promise.reject(res)
        })).then((res) => {
            const response = res[0]
            setData(response)
        }).catch((e) => {

            toast.error('Failed to load doctor users..!')
        })
    }

    const AddHistoryHandler = () => {
        setIsOpen(true)
    }

    const TableColumns = [
        {
            name:"UserId",
            cell:(row) => {
                return (row.Id) 
            }
        },
        {
            name:"Name",
            cell:(row) => {
                return (row.Name) 
            }
        }

    ]

    useLayoutEffect(() => {
        FetchData()
    }, [])

return (
    <div style={{width:'100vw', height:'100vh'}}>
        <Navbar style={{width:'98vw', marginLeft:'1vw', background:'blue', borderRadius:10, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Col sm={11} md={11} lg={11} style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
        <span style={{color:'white'}}>
            e-Health
        </span>
        </Col>
     
        <Col sm={1} md={1} lg={1} style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
        <span style={{color:'white'}}>
            {User.name}
        </span>
        </Col>
        </Navbar>
        <div style={{
            justifyContent:'center',
            alignItems:'center',
            minHeight:'85vh',
            maxHeight:'86vh',
            overflow:'auto'
        }}>
        <DataTable
        columns={TableColumns}
        data={data}
        />
        <div style={{width:'98vw', marginLeft:'1vw', display:'flex', justifyContent:'end', alignItems:'center'}}>       
       <Button 
       color={hover ? "warning" : "secondary"} 
       style={{width:50, height:50, borderRadius:50}}
       onMouseOver={() => {
        setHover(true)
       }}
       onMouseLeave={() =>{
        setHover(false)
       }}
       onClick={AddHistoryHandler}
       >
        <Plus size='1.2rem' />
       </Button>
       </div>
       {isOpen ? <NewHistoryModal isOpen={isOpen} setIsOpen={setIsOpen}/> : null}
        </div>
    </div>
)
}

export default DoctorHome