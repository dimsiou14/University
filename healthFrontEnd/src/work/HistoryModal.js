import {
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap"
import { Book, Search } from "react-feather"
import DataTable from "react-data-table-component"
import { useState } from "react"
import { SortFunctionDateTime, SortFunctionDoctorName, SortFunctionID, SortFunctionUserName } from "./Functions/SortFunctions"

const dColumns = [
  {
    name: "Id",
    cell: (data) => data.Id,
    sortable: true,
    sortFunction:SortFunctionID
  },
  {
    name: "UserName",
    cell: (data) => data.Username,
    sortable: true,
    sortFunction: SortFunctionUserName
  },
  {
    name: "DoctorName",
    cell: (data) => data.DoctorName,
    sortable: true,
    sortFunction:SortFunctionDoctorName
  },
  {
    name: "DateTime",
    cell: (data) => data.DateTime,
    sortable: true,
    sortFunction:SortFunctionDateTime
  },
  {
    name: "Image",
    cell: (data) => data.Image
  },
]

const HistoryModal = (props) => {

  const isOpenCardHistory = props.isOpenHistory
  const setIsOpenCardHistory = props.setIsOpenHistory
  const [searchbar, setSearchbar] = useState("")
  const [filteredData, setFilteredData] = useState([])

  const dataToRender = () => {
    if (searchbar.length) {
        return filteredData
    } else {
        return dData
    }
  }

  const searchbarHandler = (e) => {

    const searchText = e.target.value
    setSearchbar(searchText)

    const updatedData = dData.filter((item) => {

        const startsWith = (
            item.Id.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
            item.Username.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
            item.DoctorName.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
            item.DateTime.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
            item.Image.toString().toLowerCase().startsWith(searchText.toString().toLowerCase())
        )
        const includes = (
            item.Id.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
            item.Username.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
            item.DoctorName.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
            item.DateTime.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
            item.Image.toString().toLowerCase().includes(searchText.toString().toLowerCase())
        )
      
        if (startsWith) {
            return startsWith
        } else if (!startsWith && includes) {
            return includes
        } else return null
    })
    setFilteredData(updatedData)
  }

  const dData = [
    {
      Id: 1,
      UserId: "1",
      Username: "Dimitris",
      DoctorId: "10",
      DoctorName: "Xaris",
      DateTime: "10/10/22",
      Image: "1.png",
    },
    {
      Id: 2,
      UserId: "1",
      Username: "Kostas",
      DoctorId: "11",
      DoctorName: "John",
      DateTime: "11/12/22",
      Image: "2.png",
    },
    {
      Id: 3,
      UserId: "2",
      Username: "Ele",
      DoctorId: "10",
      DoctorName: "Xaris",
      DateTime: "3/2/22",
      Image: "3.png",
    },
    {
      Id: 4,
      UserId: "2",
      Username: "Prokopis",
      DoctorId: "11",
      DoctorName: "Paris",
      DateTime: "10/7/22",
      Image: "4.png",
    },
  ]

  return (
    <Modal isOpen={isOpenCardHistory} centered size="lg">
      <ModalHeader
        toggle={() => {
          setIsOpenCardHistory(!isOpenCardHistory)
        }}
      >
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
            <Book size="1.5rem" color="white" />
          </div>
          <div style={{ marginLeft: "10px" }}>{`History`}</div>
        </div>
      </ModalHeader>
      <ModalBody>
        <Card style={{width:"100%"}}>
          <CardBody>
            <div className="d-flex justify-content-center align-items-center">
              <Col>
                <Col style={{ width: 200, display: "flex", justifyContent: "end" }}>
                  <InputGroup>
                    <InputGroupText>
                      <Search size="1rem" />
                    </InputGroupText>
                    <Input type="text" placeholder="" value={searchbar} onChange={searchbarHandler}/>
                  </InputGroup>
                </Col>
                <DataTable 
                columns={dColumns} 
                data={dataToRender()} 
                />
              </Col>
            </div>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}

export default HistoryModal
