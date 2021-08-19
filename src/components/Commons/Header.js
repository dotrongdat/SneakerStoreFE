import React,{useEffect, useState} from 'react';
import './Header.css';
import {Link,useHistory} from 'react-router-dom';
import {Toolbar} from 'primereact/toolbar';
import {Button} from 'primereact/button';
import {SplitButton} from 'primereact/splitbutton';
import {useSelector} from 'react-redux';
import credentialService from '../../service/credential.service';
import {roles} from '../Constant/CredentialConstant';
import Notification from '../Utils/Views/Notification';
import MessageNotification from '../Utils/Views/MessageNotification';

const Header=()=>{
    const _useHistory = useHistory();
    const {isSignIn,user} = useSelector(state=>state);
    const [items,setItems] = useState();

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
    
    useEffect(()=>setItems((user.role === roles.CUSTOMER) ? [orderHistoryButton,signOutButton] : [signOutButton]),[user.role])
    const content =(
        <React.Fragment>
            {isSignIn && <MessageNotification ref={ref => global.message = ref}/>}
            {isSignIn && <Notification/>}
            {isSignIn &&  <SplitButton className="p-button-success p-mr-2" label={user.name} icon='pi pi-user' model={items}/>}
            {!isSignIn && <Link to='/signin'><Button>Sign In</Button></Link> }
            {!isSignIn && <Link to='/signup'><Button>Sign Up</Button></Link>}
        </React.Fragment>
    )
    return (
            <Toolbar className="header" right={content} style={{position:'relative',zIndex:'1'}}/>
    );
}
export default Header;