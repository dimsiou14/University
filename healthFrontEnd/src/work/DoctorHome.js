import DataTable from "react-data-table-component"
import { Col, Navbar } from "reactstrap"


const DoctorHome = () => {

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
    const TableData = []

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
            Username
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
        data={TableData}
        />
        </div>
    </div>
)
}

export default DoctorHome