import { Fragment } from "react"
import { User } from "react-feather"
import { Card, Col, Input, Row, InputGroup, InputGroupText, Label } from "reactstrap"

const UserCard = (props) => {

return (
    <div style={{width:"100vw", height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>

        <Card style={{width:'80%', height:'70%', marginLeft:'1%', marginRight:'1%'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'80%',  height:'100%', marginLeft:'1%', marginRight:'1%'}}>
            

                <div style={{background:'purple', width:'30%', justifyContent:'start', alignItems:'center', display:'flex', height:'100%', flexDirection:'column'}}>
                    <User size="16"/>
                    <Label tag={'h4'} style={{fontSize:'16px'}}> Username </Label>
                </div>

                <div style={{justifyContent:'center', alignItems:'center', display:'flex', height:'100%', flexDirection:'column'}}>
                
                <Input id="Username" type="text" disabled />
                <Input id="Password" type="password" disabled />
                <Input id="FirstName" type="text" disabled />
                <Input id="LastName" type="text" disabled />
                <Input id="Email" type="email" disabled />
                <Input id="PhoneNumber" type="tel" disabled />
                <Input id="AFM" type="text" disabled />
                {/* <Button color="secondary" onClick={HistoryHandler}>History</Button> */}
                    
                </div>
            
        </div>
        </Card>
    </div>
)
}

export default UserCard