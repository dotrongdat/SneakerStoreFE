import React,{useRef,useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {Form} from 'react-bootstrap';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {Image} from 'primereact/image';
import credentialService from '../../service/credential.service';
import './Form.css';
import Validation from '../Utils/Validation.utils';
import CredentialValidation from '../Validations/CredentialRequest.validation';
import statusCode from 'http-status-codes';
import { logoURL } from '../Constant/ResourceConstant';
import { PRIMARY_COLOR } from '../Constant';

let DEFAULT_ERRORS_STATE = {
    phoneNumber:[],
    password:[]
}

const SignIn = (props)=>{
    const _useHistory=useHistory();
    const [errors,setErrors] = useState(DEFAULT_ERRORS_STATE);

    const phoneNumberRef=useRef();
    const passwordRef=useRef();

    const submitHandler = async (e)=>{
        global.loading.show();
        e.preventDefault();
        const submitData={
            phoneNumber: phoneNumberRef.current.value,
            password: passwordRef.current.inputRef.current.value,
        }
        const validateReq = Validation(CredentialValidation.signIn(submitData));
        if(validateReq.isValid){
            const res = await credentialService.signin(submitData);
            switch (res.status){
                case statusCode.OK:
                    const _socketID = JSON.parse(localStorage.getItem('socketID')).filter(sk=>sk!==global.socket.id);
                    global.socket.emit('syncSignIn',{user : res.data.payload.user,socketID :_socketID});
                    _useHistory.replace('/');
                    break;
                case statusCode.UNAUTHORIZED:
                    global.toast.show({severity:'error', summary: 'Sign In', detail: 'Wrong username or password. Try again !', life: 1500});
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Server Error', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        }else setErrors((prevData)=>{ 
            let updateDataState={...prevData};
            for(let property in validateReq.errors){
                updateDataState={...updateDataState,[property]:validateReq.errors[property]}
            }
            return updateDataState; 
        });
        global.loading.hide();
    }
    return (
        <div className='p-grid p-justify-center p-mt-6' style={{height: '90%'}}>
            <div className='p-col-8 p-grid'
                style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                }}
            >
                <div className='p-col-4' style={{backgroundColor: '#ceffc4'}}>
                    <div className='p-grid p-justify-center p-ai-center vertical-container' style={{height: '100%'}}>
                        <Image src={logoURL} height="350"/>
                    </div>                   
                </div>
                <div className='p-col-8' style={{backgroundColor:'white'}}>
                    <div className='p-grid p-justify-center p-ai-center vertical-container'  style={{height:'95%'}}>
                        <div className='p-col-12 p-grid p-justify-center'>
                            <h3 className='p-col-12 p-mb-6' style={{textAlign:'center'}}>Sign In</h3>
                            <Form className='p-col-8' onSubmit={submitHandler}>
                            <Form.Group>    
                                <div className='p-inputgroup'>
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-phone"></i>
                                    </span>
                                    <InputText keyfilter={'num'} ref={phoneNumberRef} placeholder="Phone number" />
                                </div>
                                {errors.phoneNumber.map((error,index)=> <p key={index}>{error}</p>)}
                            </Form.Group>
                                <br/>
                                <div className='p-inputgroup'>
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-shield"></i>
                                    </span>
                                    <Password feedback={false} ref={passwordRef} placeholder="Password" toggleMask />
                                </div>
                                {errors.password.map((error,index)=> <p key={index}>{error}</p>)}
                                <Divider/>
                                <div className='p-grid p-justify-center'>   
                                    <div className='p-col-12 p-mb-6' style={{textAlign:'end'}}>
                                        <Link to='/forgotpassword' style={{textDecoration:'none',color:'black',fontWeight:'bolder'}}>Forgot Password?</Link>
                                    </div>                                    
                                    <Button className='p-col-12' color={PRIMARY_COLOR} type='submit' label='Sign In'/>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className='p-col-12' style={{textAlign:'center'}}>
                        <Link to='/signup' style={{textDecoration:'none'}}>You don't have account? Sign Up</Link>
                    </div>   
                </div>
            </div>           
        </div>
    );
}

export default SignIn;