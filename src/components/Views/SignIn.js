import React,{useRef,useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {Form} from 'react-bootstrap';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import credentialService from '../../service/credential.service';
import './Form.css';
import Validation from '../Utils/Validation.utils';
import CredentialValidation from '../Validations/CredentialRequest.validation';
import statusCode from 'http-status-codes';

let DEFAULT_ERRORS_STATE = {
    username:[],
    password:[]
}

const SignIn = (props)=>{
    const _useHistory=useHistory();
    const [errors,setErrors] = useState(DEFAULT_ERRORS_STATE);

    const usernameRef=useRef();
    const passwordRef=useRef();

    const submitHandler = async (e)=>{
        global.loading.show();
        e.preventDefault();
        const submitData={
            username: usernameRef.current.value,
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
        <div className='p-grid p-justify-center p-mt-6 p-pt-6'>
            <div className='p-col-5 p-mt-6 p-pt-6'>
                <Form className='form p-col-12' onSubmit={submitHandler}>
                <Form.Group>    
                    <div className='p-inputgroup'>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText ref={usernameRef} placeholder="Username" />
                            <Form.Text >
                                {errors.username.map((error,index)=> <p key={index}>{error}</p>)}
                            </Form.Text>
                    </div>
                </Form.Group>
                    <br/>
                    <div className='p-inputgroup'>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-shield"></i>
                            </span>
                            <Password feedback={false} ref={passwordRef} placeholder="Password" toggleMask />
                            <Form.Text >
                                {errors.password.map((error,index)=> <p key={index}>{error}</p>)}
                            </Form.Text>
                    </div>
                    <Divider/>
                    <div className='p-grid p-justify-center p-mt-4'>
                        <div className='p-col-12' style={{textAlign:'center'}}>
                            <Link to='/signup'>You don't have account? Sign Up</Link>
                        </div>    
                        <Button className='p-col-4' type='submit' label='Login'/>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default SignIn;