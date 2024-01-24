import { Button, Input, Label, Row, UncontrolledTooltip, Form } from 'reactstrap'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import HistoryModal from './HistoryModal'
import { Save, Settings } from 'react-feather'
import toast from 'react-hot-toast'
import { userActions } from './redux/user'

const Profile = () => {
    const User = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false)
    const [isOpenModalHistory, setIsOpenModalHistory] = useState(false)

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
 
        const final = []
        if (postVariables.length >= 9) {

            final.push(postVariables[0])
            final.push(postVariables[1])
            final.push(postVariables[3])
            final.push(postVariables[4])
            final.push(postVariables[5])
            final.push(postVariables[6])
            final.push(postVariables[7])
            final.push(postVariables[8])
            final.push(postVariables[2])
            final.push(User.id.toString())

            const requestOptions  = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(final)
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

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem('user')
        if (isUserLoggedIn) {
            const userData = JSON.parse(isUserLoggedIn)
            dispatch(userActions.SetUser(userData))
        }
    }, [])
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <div className="card">
            <div className="display-picture">
                <img src='https://png.pngtree.com/png-vector/20190629/ourlarge/pngtree-business-people-avatar-icon-user-profile-free-vector-png-image_1527664.jpg' alt='display'></img>
                <><Settings 
                id='ed'
                style={{marginLeft:'300px', marginTop:'30px'}}
                onClick={() => {
                    setIsEdit(true)
                }}
                />
                <UncontrolledTooltip 
                target={"ed"}>
                    Edit
                </UncontrolledTooltip>
                </>
                 <Button type='submit' form='sb' style={{marginTop:'30px', padding:0}}>
                    <Save 
                id='sav'
   
                style={{marginLeft:'0px', marginTop:'0px'}}
                
                />
                <UncontrolledTooltip 
                target={"sav"}>
                    Save
                </UncontrolledTooltip>
               </Button>
            </div>
         
            <div className="banner">
                <img src='http://www.pixelstalk.net/wp-content/uploads/2016/06/Light-Blue-HD-Backgrounds-Free-Download.jpg' alt='banner'></img>
            </div>

            <div className="content">
            <Form  onSubmit={onSubmitHandler} id='sb'>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
               
                <Label  style={{width:'100px', marginLeft:'50px'}}>Username </Label>
                <Input 
                type='text' 
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.name}
                disabled={!isEdit}
                />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>Password </Label>
                <Input 
                type='text' 
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.password}
                disabled={!isEdit} 
                />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>UserType </Label>
                <Input 
                type='text' 
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.type === 0 ? "Patient" : "Doctor"}
                disabled={true}/>
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>FirstName </Label>
                <Input
                 type='text' 
                 style={{width:'200px', marginLeft:'50px'}}
                 defaultValue={User.firstname}
                disabled={!isEdit}
                 />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>LastName </Label>
                <Input 
                type='text' 
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.lastname}
                disabled={!isEdit}/>
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>Email </Label>
                <Input 
                type='text'
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.email}
                disabled={!isEdit}/>
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>Phone </Label>
                <Input 
                type='text'
                 style={{width:'200px', marginLeft:'50px'}}
                 defaultValue={User.phoneNumber}
                disabled={!isEdit}
                 />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>AFM </Label>
                <Input 
                type='text' 
                style={{width:'200px', marginLeft:'50px'}}
                defaultValue={User.afm}
                disabled={!isEdit}
                />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>HasOTP </Label>
                <Input 
                type='checkbox' 
                style={{ marginLeft:'50px'}}
                defaultChecked={User.hasOTP}
                disabled={!isEdit}
                />
                </div>
                <div style={{display:'flex', justifyContent:'start', justifyItems:'start', flexDirection:'row', marginTop:'10px '}}>
                <Label  style={{width:'100px', marginLeft:'50px'}}>History </Label>
   
                <Button style={{width:'200px', marginLeft:'50px'}} onClick={HistoryHandler}>
                    Show
                </Button>
                </div>
          
                </Form>
            </div>
            
            <HistoryModal isOpenHistory={isOpenModalHistory} setIsOpenHistory={setIsOpenModalHistory}/>
        </div>
        
        </div>
    )
}

export default Profile