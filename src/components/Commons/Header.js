import React,{Fragment, useEffect, useState} from 'react';
import './Header.css';
import {Link,useHistory} from 'react-router-dom';
import {Toolbar} from 'primereact/toolbar';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import {SplitButton} from 'primereact/splitbutton';
import {useSelector} from 'react-redux';
import credentialService from '../../service/credential.service';
import {roles} from '../Constant/CredentialConstant';
import Notification from '../Utils/Views/Notification';
import MessageNotification from '../Utils/Views/MessageNotification';
import { PRIMARY_COLOR } from '../Constant';
import {Chip} from 'primereact/chip';
import {Image} from 'primereact/image';
import { logoURL } from '../Constant/ResourceConstant';

const Header=()=>{
    const _useHistory = useHistory();
    const {isSignIn,user} = useSelector(state=>state);
    const [items,setItems] = useState([]);

    const onClickSignOutHandler = ()=>{
        global.loading.show();    
        setTimeout(()=>{
            credentialService.signout();
            const _socketID = JSON.parse(localStorage.getItem('socketID')).filter(sk=>sk!==global.socket.id);
            global.socket.emit('syncSignOut',_socketID);
            _useHistory.replace('/');
            global.loading.hide();
        },500);
    }
    const signOutButton = {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: onClickSignOutHandler
    }
    const orderHistoryButton = {
        label: 'Order History',
        icon: 'pi pi-book',
        command: ()=>_useHistory.replace('/order')
    }
    
    useEffect(()=>{setItems((prevData)=>{
        switch (user.role){
            case roles.ADMIN: return adminItems;
            case roles.CUSTOMER: return customerItems;
            default: return noAuthItems;
        }
    })},[user.role]);
    // const content =(
    //     <React.Fragment>
    //         {isSignIn && <MessageNotification ref={ref => global.message = ref}/>}
    //         {isSignIn && <Notification/>}
    //         {isSignIn &&  <SplitButton className="p-button-success p-mr-2" label={user.name} icon='pi pi-user' model={items}/>}
    //         {!isSignIn && <Link to='/signin'><Button>Sign In</Button></Link> }
    //         {!isSignIn && <Link to='/signup'><Button>Sign Up</Button></Link>}
    //     </React.Fragment>
    // )\
    
    const customerItems = [
        {
            label: "Help",
            icon: "pi pi-pw pi-question-circle",
            command: ()=>{}
        },
        {
            label: "Language",
            icon: "pi pi-pw pi-globe",
            items: [
                {
                    label: "English",
                    command: ()=>{}
                },
                {
                    label: "Vietnamese",
                    command: ()=>{}
                }
            ]
        },
        {
            label: user.name,
            icon: "pi pi-pw pi-user",
            items: [
                {
                    label: "Manage Information",
                    command: ()=>{}
                },
                {
                    label: "Manage Order",
                    command: ()=>{}
                },
                {
                    label: "Sign Out",
                    command: ()=>{credentialService.signout()}
                }
            ],           
        }        
    ]
    const adminItems = [
        {
            label: "Help",
            icon: "pi pi-pw pi-question-circle",
            command: ()=>{}
        },
        {
            label: "Language",
            icon: "pi pi-pw pi-globe",
            items: [
                {
                    label: "English",
                    command: ()=>{}
                },
                {
                    label: "Vietnamese",
                    command: ()=>{}
                }
            ]
        },
        {
            label: user.name,
            icon: "pi pi-pw pi-user",
            items: [
                {
                    label: "Sign Out",
                    command: ()=>{credentialService.signout()}
                }
            ],           
        }  
    ]
    const noAuthItems = [
        {
            label: "Help",
            icon: "pi pi-pw pi-question-circle",
            command: ()=>{console.log("help")}
        },
        {
            label: "Language",
            icon: "pi pi-pw pi-globe",
            items: [
                {
                    label: "English",
                    command: ()=>{console.log("English")}
                },
                {
                    label: "Vietnamese",
                    command: ()=>{console.log("Vietnamese")}
                }
            ]
        },
        {
            label: "Sign Up",
            command: ()=>{_useHistory.push("/signup")}
        },
        {
            label: "Sign In",
            command: ()=>{_useHistory.push("/signin")}
        }
    ]
    return (
            //<Toolbar className="header" right={content} style={{position:'relative',zIndex:'1'}}/>
            <div className='p-grid p-justify-center' style={{backgroundColor: PRIMARY_COLOR, marginRight: '0.5px'}}> 
                <div className='p-col-8 p-grid p-justify-center'>
                    <div className='p-col-4 p-grid p-mt-4'>
                        <p style={{color: "white"}}>Order hotline <Chip label='0939240054' style={{backgroundColor: 'green', color:'white'}} icon="pi pi-phone"/></p>
                    </div>
                    <div className='p-col-4'>
                        <div className='p-grid p-justify-center p-ai-center vertical-container'>
                            <div className='p-col-12 p-mt-3 p-mb-1' style={{textAlign:'center'}}>
                                <h1 style={{color: "white", cursor: 'pointer'}} onClick={()=>_useHistory.push('/')}>MASK STORE</h1>
                            </div>
                            {/* <div className='p-col-8 p-grid p-jc-between'>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Home</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Service</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Shop</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Blog</h6>
                            </div> */}
                        </div>
                    </div>
                    <div className='p-col-4 p-grid p-jc-end p-mt-3'>
                        <div>
                        <Menubar style={{backgroundColor: 'white', borderRadius: '20px', fontSize: '0.8rem'}} model={items} end={()=>{
                            return isSignIn ? 
                            <div className='p-grid'>
                                <div className='p-col-6'>
                                    <MessageNotification ref={ref => global.message = ref}/>
                                </div>
                                <div className='p-col-6'>
                                    <Notification/>
                                </div>
                               
                                
                            </div>
                            :
                            <Fragment></Fragment>
                        }}
                        />
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Header;