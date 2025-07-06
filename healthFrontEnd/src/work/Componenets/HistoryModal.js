import {
  Button,
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
import { SortFunctionDateTime, SortFunctionDoctorName, SortFunctionID, SortFunctionUserName } from "../Functions/SortFunctions"
import { useAsyncError } from "react-router"
import FileViewer from "./FileViewer"



const historyTableStyles = {
  headRow: {
    style: {
      background: 'purple',
      borderRadius: 5,
      color: 'white'
    }
  }

}

const HistoryModal = (props) => {

  const isOpenCardHistory = props.isOpenHistory
  const setIsOpenCardHistory = props.setIsOpenHistory
  const [searchbar, setSearchbar] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [isFileOpen, setIsFileOpen] = useState(false)

  const dColumns = [
    {
      name: "Id",
      cell: (data) => data.historyId,
      sortable: true,
      sortFunction: SortFunctionID
    },
    {
      name: "Patient",
      cell: (data) => data.userName,
      sortable: true,
      sortFunction: SortFunctionUserName
    },
    {
      name: "Doctor",
      cell: (data) => data.doctorName,
      sortable: true,
      sortFunction: SortFunctionDoctorName
    },
    {
      name: "Recorded",
      cell: (data) => data.recorded,
      sortable: true,
      sortFunction: SortFunctionDateTime
    },
    {
      name: "Perscription",
      cell: (data) => {
        return (
          <a href={`https://localhost:8081/file/view?imageSrc=${data.imageSrc}`} target="_blank">View</a>
        )
      }
    },
  ]

  const dataToRender = () => {
    if (searchbar.length) {
      return filteredData
    } else {
      return props.data
    }
  }

  const searchbarHandler = (e) => {

    const searchText = e.target.value
    setSearchbar(searchText)

    const updatedData = props.data.filter((item) => {

      const startsWith = (
        item.historyId.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
        item.userName.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
        item.doctorName.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
        item.recorded.toString().toLowerCase().startsWith(searchText.toString().toLowerCase()) ||
        item.imageSrc.toString().toLowerCase().startsWith(searchText.toString().toLowerCase())
      )
      const includes = (
        item.historyId.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
        item.userName.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
        item.doctorName.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
        item.recorded.toString().toLowerCase().includes(searchText.toString().toLowerCase()) ||
        item.imageSrc.toString().toLowerCase().includes(searchText.toString().toLowerCase())
      )

      if (startsWith) {
        return startsWith
      } else if (!startsWith && includes) {
        return includes
      } else return null
    })
    setFilteredData(updatedData)
  }

  return (
    <>
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
          <Card style={{ width: "100%", height: '400px' }}>
            <CardBody>
              <div className="d-flex justify-content-center align-items-center">
                <Col>
                  <Col style={{ width: 200, display: "flex", justifyContent: "end" }}>
                    <InputGroup>
                      <InputGroupText>
                        <Search size="1rem" />
                      </InputGroupText>
                      <Input type="text" placeholder="" value={searchbar} onChange={searchbarHandler} />
                    </InputGroup>
                  </Col>
                  <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '20px' }}>
                    <DataTable
                      columns={dColumns}
                      data={dataToRender()}
                      customStyles={historyTableStyles}
                      highlightOnHover
                      fixedHeader
                      fixedHeaderScrollHeight="300px"
                    />
                  </div>
                </Col>
              </div>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
      <FileViewer isFileOpen={isFileOpen} setIsFileOpen={setIsFileOpen} />
    </>
  )
}

export default HistoryModal
