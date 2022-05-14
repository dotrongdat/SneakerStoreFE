import React,{useState,useEffect,useRef, Fragment} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {RadioButton } from 'primereact/radiobutton'
import {Link, useLocation} from  'react-router-dom';
import { routeResource } from '../Constant/ResourceConstant';
import {ADDRESS_API} from '../Constant/Location.constant';
import {useSelector} from 'react-redux';
import {Form} from 'react-bootstrap';
import orderService from '../../service/order.service';
import statusCode from 'http-status-codes';
import {PayPalButton} from 'react-paypal-button-v2';
import {AHAMOVE_LOGO, CASH_ON_DELIVERY_LOGO, emailRegex, GHN_LOGO, paymentMethodType, PAYPAL_LOGO, phoneNumberRegex, VNPAY_LOGO, VNPAY_URL_PAY, vnp_Url_config} from '../Constant/OrderConstant';
import './CheckOut.css';
import { createVNPayUrl, getKeyValueParamObject, toVNDCurrencyFormat } from '../Utils/Function.util';
import {Dropdown} from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { SelectButton } from 'primereact/selectbutton';
import { BACKGROUND_COLOR } from '../Constant';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import userService from '../../service/user.service';
import cryptoJs from 'crypto-js';
import crypto from 'crypto';
import {useFormik} from 'formik';
import { classNames } from 'primereact/utils';
import {mdiCashMultiple,mdiCreditCardMultiple,mdiCreditCardOutline} from '@mdi/js';
import Icon from '@mdi/react';
import { Sidebar } from 'primereact/sidebar';
import './CheckOut.css';

// const VNPayIPN = (props) => {
//     const {search} = useLocation();
//     useEffect(()=>{
//         global.loading.show();
//         const paramObject = getKeyValueParamObject(search.substring(1));

//     },[])
//     return (<></>)
// }

const PaymentMethod = (props) => {
    return (
        <div className={'parent ' + classNames(props.checked ? 'container_checked' : 'container_unchecked')} style={{borderRadius: '10px'}} onClick={()=> !props.pendingChoose && props.onClick()}>
            <div className={'p-d-flex ' + classNames(props.checked ? 'child_checked' : 'child_unchecked')} style={{position: 'relative', borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                <Icon path={props.iconPath} color='green' size={1} style={{marginLeft: '7px', marginTop: '2px',marginRight: '5px'}}/>
                <p style={{fontSize: '1rem'}}>{props.title}</p>
                <RadioButton style={{position: 'absolute', top: '2px', right: '2px'}} checked={props.checked}/>
            </div>
            <p style={{marginLeft: '10px', fontSize: '0.7rem'}}>{props.content}</p>
        </div>
    )
} 
const ShippingAddress = (props) => {
    // const [ward,setWard] = useState('');
    // const [district,setDistrict] = useState('');
    // const [province,setProvince] = useState('');
    // const [detailAddress,setDetailAddress] = useState('');
    const [provinceList, setProvinceList] = useState([]);
    const [districtList,setDistrictList] = useState([]);
    const [wardList,setWardList] = useState([]);

    const submitButtonRef = useRef();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            detailAddress: props.data.detailAddress,
            province: props.data.province,
            district: props.data.district,
            ward: props.data.ward,
            receiverName: props.data.receiverName,
            phoneNumber: props.data.phoneNumber,
            email: props.data.email
        },
        validate: (data) => {
            let errors = {};

            if (!data.detailAddress) {
                errors.detailAddress = 'Required field';
            }
            if (data.detailAddress.length < 2 || data.detailAddress.length > 350) {
                errors.detailAddress = 'The address length should be 2 - 350 characters';
            }
            if (!data.province) {
                errors.province = 'Required field';
            }
            if (!data.district) {
                errors.district = 'Required field';
            }
            if (!data.ward) {
                errors.ward = 'Required field';
            }
            if(!data.receiverName){
                errors.receiverName = 'Required field';
            }
            if(data.receiverName.length < 2 || data.receiverName.length > 50){
                errors.receiverName = 'The name length should be 2 - 50 characters';
            }
            if(!data.phoneNumber){
                errors.phoneNumber = 'Required field';
            }
            if(!phoneNumberRegex.test(data.phoneNumber)){
                console.log(data.phoneNumber);
                errors.phoneNumber = 'Please input valid phone number';
            }
            if(!data.email){
                errors.email = 'Required field';
            }
            if(!emailRegex.test(data.email)){
                errors.email = 'Please input valid email';
            }
            return errors;
        },
        onSubmit: (data) => {
            // setFormData(data);
            // setShowMessage(true);
            props.onSave(data);
            props.hide();
            //formik.resetForm();
        }
    });
    useEffect(()=>{
        setProvinceList(ADDRESS_API.map(i=>i.name));
    },[]);
    useEffect(()=>{
        if(formik.values.province !== ""){
            const _districtList = ADDRESS_API.find(i=>i.name === formik.values.province).district.map(i=>i.name);
            setDistrictList(_districtList);
            if(!_districtList.includes(formik.values.district)) {
                setWardList([]);
                formik.setFieldValue('ward','');
                formik.setFieldValue('district','');
            }
        }
    },[formik.values.province]);
    useEffect(()=>{
        if(formik.values.district !== ""){
            // const _districtList = 
            const _wardList = ADDRESS_API.find(i=>i.name === formik.values.province).district.find(i=>i.name === formik.values.district).ward.map(i=>i.name);
            setWardList(_wardList);
        }
    },[formik.values.district]);
    // useEffect(()=>{
    //     console.log('changeData');
    //     setWard(props.data.ward);
    //     setDistrict(props.data.district);
    //     setProvince(props.data.province);
    //     setDetailAddress(props.data.detailAddress);
    // },[props.data])
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const footer = () => {
        const onClickCloseHandler = () =>{
            props.hide();
            formik.resetForm();
        }
        return (
            <div>
                <Button label="Close" icon="pi pi-times" onClick={onClickCloseHandler} className="p-button-text" />
                <Button label="Save" type='button' icon="pi pi-check" onClick={()=>submitButtonRef.current.click()} autoFocus />
            </div>
        )
    }
    const onHide = () => {
        props.hide();
        formik.resetForm();
    }
    return (
        <Dialog visible={props.visible} footer={footer} onHide={onHide} style={{minHeight: '92vh', minWidth: '30vw'}} modal>
            <div className="flex justify-content-center">
                <div className="p-m-4" style={{minWidth:'450px'}}>
                    <h5 className="text-center">Shipping Address</h5>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-mt-2">
                            <span className="p-float-label">
                                <InputText id="receiverName" name="receiverName" value={formik.values.receiverName} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('receiverName') })}/>
                                <label htmlFor="receiverName" className={classNames({ 'p-error': isFormFieldValid('receiverName') })}>Full Name</label>
                            </span>
                            {getFormErrorMessage('receiverName')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="phoneNumber" keyfilter='num' name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('phoneNumber') })}/>
                                <label htmlFor="phoneNumber" className={classNames({ 'p-error': isFormFieldValid('phoneNumber') })}>Phone Number</label>
                            </span>
                            {getFormErrorMessage('phoneNumber')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="email" keyfilter='email' name="email" value={formik.values.email} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('email') })}/>
                                <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="p-mt-4">
                            <span className="p-float-label">
                                <Dropdown id="province" name="province" options={provinceList} value={formik.values.province} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('province') })}/>
                                <label htmlFor="province" className={classNames({ 'p-error': isFormFieldValid('province') })}>Province</label>
                            </span>
                            {getFormErrorMessage('province')}
                        </div>
                        <div className="p-mt-4">
                            <span className="p-float-label"> 
                                <Dropdown id="district" name="district" disabled={districtList.length === 0} options={districtList} value={formik.values.district} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('district') })} />
                                <label htmlFor="district" className={classNames({ 'p-error': isFormFieldValid('district') })}>District</label>
                            </span>
                            {getFormErrorMessage('district')}
                        </div>
                        {/* <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="district" name="district" options={wardList} value={formik.values.district} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('district') })} />
                                <label htmlFor="district" className={classNames({ 'p-error': isFormFieldValid('district') })}>Name*</label>
                            </span>
                            {getFormErrorMessage('district')}
                        </div> */}
                        <div className="p-mt-4">
                            <span className="p-float-label">
                                <Dropdown id="ward" name="ward"  disabled={wardList.length === 0} options={wardList} value={formik.values.ward} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('ward') })} />
                                <label htmlFor="ward" className={classNames({ 'p-error': isFormFieldValid('ward') })}>Ward</label>
                            </span>
                            {getFormErrorMessage('ward')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="detailAddress" name="detailAddress" value={formik.values.detailAddress} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('detailAddress') })} />
                                <label htmlFor="detailAddress" className={classNames({ 'p-error': isFormFieldValid('detailAddress')})}>Address</label>
                            </span>
                            {getFormErrorMessage('detailAddress')}
                        </div>
                        <Button type='submit' hidden ref={submitButtonRef}/>
                    </form>
                </div>
            </div>
        </Dialog>
    );
}
const CheckOut = (props)=>{
    //const [selectedProducts,setSelectedProducts]=useState([]);
    //const categories=JSON.parse(sessionStorage.getItem('categories'));
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleSidebarPaypal, setIsVisibleSidebarPaypal] = useState(false);
    // const [ward,setWard] = useState('');
    // const [district,setDistrict] = useState('');
    // const [province,setProvince] = useState('');
    const [address,setAddress] = useState({province: '',district: '', ward: ''});
    const [detailAddress,setDetailAddress] = useState('');
    const [receiverName,setReceiverName] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');
    const [email,setEmail] = useState('');
    const [isValidForm, setIsValidForm] = useState(true);

    const {user,categories} = useSelector(state=>state);   

    const receiverNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    // const addressRef = useRef();
    const [paymentMethod,setPaymentMethod] = useState(paymentMethodType.COD);
    const _useHistory = useHistory();

    
    const nameBodyTemplate = (rowData) => {
        return (
            // <div>
                <Link className='p-grid ' to={`/product/${rowData._id}`} style={{textDecoration: 'none'}}>
                    <img className='p-col-4' src={rowData.album[0]} alt='productImage' style={{height:'5vw',width:'5vw'}}/>
                    <p className='p-col-8' style={{wordWrap: 'break-word'}}>{rowData.name}</p>
                </Link>               
                
            // </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.category).name}</p>;
    const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.price)} VND</p>;
    const quantityBodyTemplate = (rowData) => <p>Qty: {rowData.quantity}</p>;
    // const paymentOptions = [
    //     {image: CASH_ON_DELIVERY_LOGO, name: 'Cash On Delivery', value: paymentMethodType.COD},
    //     {image: PAYPAL_LOGO, name: 'Paypal', value: paymentMethodType.PAYPAL},
    //     {image: VNPAY_LOGO, name: 'VNPay', value: paymentMethodType.VNPAY}
    // ]
    // const paymentOptionTemplate = (option) => {
    //     return (
    //         <div style={{width: '8vw'}}>
    //             <img src={option.image} width='50px' height='50px' alt='shipping logo'/> <span style={{fontSize: '13px'}}>{option.name}</span>
    //         </div>
    //     )
    // }
    // const onClickVNPayButton = () => {
    //     // console.log('test');
    //     // const date = new Date();
    //     // const year = date.getFullYear().toString();
    //     // const month = date.getMonth().toString().padStart(2,'0');
    //     // const day = date.getDate().toString().padStart(2,'0');
    //     // const hour = date.getHours().toString().padStart(2,'0');
    //     // const minute = date.getMinutes().toString().padStart(2,'0');
    //     // const second = date.getSeconds().toString().padStart(2,'0');
    //     // const dateParam = year + month + day + hour + minute + second;
    //     // const rawHash = `vnp_Amount=${props.total}&vnp_Command=${vnp_Url_config.vnp_Command}&vnp_CreateDate=${dateParam}&vnp_CurrCode=${vnp_Url_config.vnp_CurrCode}&vnp_IpAddr=${user.ip}&vnp_Locale=${vnp_Url_config.vnp_Locale}&vnp_OrderInfo=${vnp_Url_config.vnp_OrderInfo}&vnp_OrderType=${vnp_Url_config.vnp_OrderType}&vnp_ReturnUrl=${vnp_Url_config.vnp_ReturnUrl}&vnp_TmnCode=${vnp_Url_config.vnp_TmnCode}&vnp_TxnRef=${date.getTime()+ Math.round(100*Math.random()) + Math.round(1000*Math.random())}&vnp_Version=${vnp_Url_config.vnp_Version}`;
    //     // const vnp_SecureHash = cryptoJs.HmacSHA512(rawHash,vnp_Url_config.vnp_HashSecret).toString();
    //     // crypto.createHmac('')
    //     // const url = `${VNPAY_URL_PAY}?${rawHash}&vnp_SecureHash=${vnp_SecureHash}`;
    //     //return (<Redirect to={url}/>)
    //     //_useHistory.push(url);
    //     // console.log(url);
    //     window.location.href=createVNPayUrl({amount: props.total, ipAddr: user.ip});
    // }
    const calculateTotalQuantity = (items)=>{
        let quantity = 0;
        items.forEach(i=>quantity +=i.quantity);
        return quantity;
    }
    const checkout = async (paymentInfo) =>{
        let cart={};
        props.items.forEach(i=> cart = {...cart,[i._id]:i.quantity})
        // for(let property in items){
        //     if(items[property]) cart.push(property);
        // }
        const info = {
            receiverName,
            email : email,
            phone : phoneNumber,
            address : {
                detail: detailAddress,
                province: address.province,
                district: address.district,
                ward: address.ward
            },
            paymentMethod : {
                type : paymentMethod,
                paymentInfo
            }
        }
        if(receiverName){
            global.loading.show();
            const res = await orderService.checkout({
                cart,
                info
            });
            switch (res.status){
                case statusCode.OK:
                    if(res.data.payload.url){
                        window.location.href = res.data.payload.url;
                    }else {
                        _useHistory.push('/checkoutResult',{order:res.data.payload.order});
                        global.toast.show({severity:'info', summary: 'Order', detail: 'Your order are in processing', life: 1500});
                    }                
                    break;
                case statusCode.BAD_REQUEST:
                    global.toast.show({severity:'error', summary: 'Order', detail: 'Appear invalid items in your cart. Please check again!', life: 1500});
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Order', detail: res.data.message, life: 1500});
                    break;
                default:
            }
            props.hide();
            global.loading.hide();
        }else setIsValidForm(false);
    }
    // const onClickVNPayButtonHandler = () => {
    //     _useHistory.go()
    // }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        checkout();
    }
    const onSaveShippingAddressHandler = ({province,district,ward,detailAddress,receiverName,phoneNumber,email}) => {
        setAddress({province,district,ward});
        setReceiverName(receiverName);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        // setProvince(province);
        // setDistrict(district);
        // setWard(ward);
        setDetailAddress(detailAddress);
    }
    // useEffect(()=>{
    //     const {items}=props
    //     if(items){
    //         let _selectedProducts=[];
    //         const {cart} = user;
    //         cart.forEach(i=>{
    //             if(items[i._id] === true){
    //                 let {product,quantity} = i;
    //                 _selectedProducts.push({...product,quantity});
    //             }
    //         })
    //         setSelectedProducts(_selectedProducts);
    //     }
    // },[props, user])
    useEffect(()=>{
        if(receiverName) setIsValidForm(true);
    },[receiverName]);
    return (
        <div className='p-grid p-justify-center p-mt-2'>
            <ShippingAddress visible={isVisible} hide={()=>setIsVisible(false)} onSave={onSaveShippingAddressHandler} data={{detailAddress,ward: address.ward,district: address.district,province: address.province, receiverName, phoneNumber, email}}/>
            <Sidebar position='right' style={{minWidth: '25vw'}} visible={isVisibleSidebarPaypal} onHide={()=>setIsVisibleSidebarPaypal(false)}>
                <div className='p-grid p-jc-center'>
                    <h3 className='p-col-12' style={{textAlign: 'center'}}>Add a new card</h3>
                    <div className='p-col-12 p-grid p-jc-center p-mb-5' style={{textAlign: 'center', backgroundColor: BACKGROUND_COLOR, padding: '5px'}}>
                        <div className='p-d-flex p-mt-3'>
                            <i className='pi pi-shield' style={{fontSize: '1.5rem'}} color='green'/>
                            <p style={{color: 'green'}}>Covered by Mask Store Protection</p>
                        </div>
                    </div>
                    <PayPalButton
                        options = {
                            {clientId: 'AZ7lZAzmFzxo9pbrGvgKv_KVNY8qg5bD1ZJZ_Tfr_46Dl_dE_6mjNk_p9ue3BalpjazGRwEouZGjJ6va',
                            currency: 'USD'}
                        }
                        shippingPreference = 'NO_SHIPPING'
                        amount = {props.total}
                        onSuccess = {async (details,data)=>{
                                setIsVisibleSidebarPaypal(false);
                                setPaymentMethod(paymentMethodType.PAYPAL);
                                return checkout(JSON.stringify(details));
                        }}
                    />
                </div>
            </Sidebar>
            <form className='p-col-10 p-grid checkout' onSubmit={onSubmitHandler}>
                <div className='p-col-7'>
                <span className="p-float-label"> 
                    <div className={'p-mb-2 ' + classNames({ 'p-invalid': !isValidForm })}  style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', position:'relative'}}>
                        <p className='p-col-12' style={{backgroundColor: 'whitesmoke'}}>Shipping Address</p>
                        <div style={{paddingLeft: '10px', paddingBottom: '2px'}}>
                            {receiverName && <Fragment>
                                <div className='p-d-flex'>
                                    <p>{receiverName}</p>
                                    <p style={{marginLeft: '10px'}}>{phoneNumber}</p>
                                </div>
                                <p>{email}</p>
                                <p>{`${detailAddress},${address.ward},${address.district},${address.province}`}</p>
                                <p style={{position:'absolute',top:'2px', right: '5px', cursor: 'pointer', color: 'orange'}} onClick={()=>setIsVisible(true)}>Edit</p>
                            </Fragment>}
                            {!receiverName && <Fragment>
                                <div className='p-d-flex p-jc-center'>
                                    <p onClick={()=>setIsVisible(true)}>Please input shipping address</p>
                                </div>
                            </Fragment>}
                        </div>                       
                    </div>
                </span>
                {!isValidForm && <small className="p-error">Please input address shipping before</small>}
                    <Divider/>
                    <div className='cart'>
                        <DataTable className='p-mt-4' value={props.items} rowClassName='enable'>
                            <Column body={nameBodyTemplate}/>
                            <Column body={brandBodyTemplate}/>
                            <Column body={priceBodyTemplate}/>
                            <Column body={quantityBodyTemplate}/>
                        </DataTable>
                    </div>
                </div>
                <div className='p-col-4 p-ml-1' style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', padding: '10px'}}>
                    <p style={{fontSize: '1rem', fontWeight: 'bolder', marginTop: '10px'}}>Select Payment Method</p>
                    <PaymentMethod title='Cash On Delivery' iconPath={mdiCashMultiple} content='Pay when you receive' onClick={()=>{setPaymentMethod(paymentMethodType.COD)}} checked={paymentMethod === paymentMethodType.COD}/>
                    <PaymentMethod title='Paypal' iconPath={mdiCreditCardMultiple} content='Tap to add card' onClick={()=>{setIsVisibleSidebarPaypal(true)}} checked={paymentMethod === paymentMethodType.PAYPAL}/>
                    <PaymentMethod title='VNPay' iconPath={mdiCreditCardOutline} content='Pay online now' onClick={()=>{setPaymentMethod(paymentMethodType.VNPAY)}} checked={paymentMethod === paymentMethodType.VNPAY}/>
                    <p className='p-mt-2' style={{fontSize: '1rem', fontWeight: 'bolder'}}>Voucher</p>
                    <div className='p-d-flex p-jc-between'>
                        <InputText className='p-col-7' placeholder='Enter Voucher Code'/>
                        <Button className='p-col-4' type='button' label='Apply'/>
                    </div>
                    <p className='p-mt-2' style={{fontSize: '1rem', fontWeight: 'bolder'}}>Order Summary</p>
                    <div className='p-d-flex p-jc-between'>
                        <p>Subtotal {`(${calculateTotalQuantity(props.items)} items)`}</p>
                        <p>{`${toVNDCurrencyFormat(props.total)} VND`}</p>
                    </div>
                    <div className='p-d-flex p-jc-between'>
                        <p>Shipping Fee</p>
                        <p>{`${toVNDCurrencyFormat(50000)} VND`}</p>
                    </div>
                    <div className='p-d-flex p-jc-between'>
                        <p style={{fontSize: '1rem', fontWeight: 'bolder'}}>Total</p>
                        <p style={{fontSize: '1rem', fontWeight: 'bolder', color: 'orange'}}>{`${toVNDCurrencyFormat(props.total + 50000)} VND`}</p>
                    </div>
                    <Button style={{backgroundColor:'orange', borderColor: 'orange'}} className='p-col-12' type='submit' label='Proceed to Payment'/>
                </div>
                {/* <DataTable value={props.items}>
                    <Column body={nameBodyTemplate}/>
                    <Column body={brandBodyTemplate}/>
                    <Column body={priceBodyTemplate}/>
                    <Column body={quantityBodyTemplate}/>
                </DataTable>
                <div className='p-grid p-mt-3 p-mr-1 p-jc-end'>
                     <h5 style={{fontFamily: 'cursive', fontWeight: 'bolder'}}>{`Total:   ${toVNDCurrencyFormat(props.total)} VND`}</h5>
                </div>
                <div className='p-jc-center p-grid p-mt-5'>
                <Form className='p-col-7' id='checkout-form' onSubmit={onSubmitHandler}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user-edit"></i>
                        </span>
                        <InputText placeholder="Name" ref={receiverNameRef} required/>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"></i>
                        </span>
                        <InputText placeholder="Email" ref={emailRef} required/>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-phone"></i>
                        </span>
                        <InputText keyfilter='num' placeholder="Phone" ref={phoneRef} required/>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-map"></i>
                        </span>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-map"></i>
                            <Button className={classNames(detailAddress ? "pi pi-pencil" : "pi pi-plus-circle" )} type='button' onClick={()=>setIsVisible(true)}/>
                        </span>
                        <InputText style={{cursor: 'text'}} onClick={()=>setIsVisible(true)} placeholder="Address" value={detailAddress ? `${detailAddress},${address.ward},${address.district},${address.province}` : ''} required/>
                        
                        {detailAddress && <div style={{position: 'relative'}}>
                            <p>{ward} - {district} - {province}</p>
                            <p>{detailAddress}</p>
                            <p style={{cursor: 'pointer', position: 'absolute', top: '2px', right: '2px'}} onClick={()=>setIsVisible(true)}>Edit</p>
                        </div>}
                        {!detailAddress && <Button className='p-col-12' type='button' onClick={()=>setIsVisible(true)} label='Add'/>}
                    </div>
                    <Divider/>
                    <div style={{backgroundColor: '#ffffab', borderRadius: '10px', padding: '5px'}}>
                        <p style={{fontSize: '15px', fontWeight: 'bolder'}}>Shipping method</p>
                        
                        <img src={AHAMOVE_LOGO} width='100px' alt='shipping logo'/> <span style={{fontSize: '13px'}}>Ahamove</span>
                        <img src={GHN_LOGO} width='100px' alt='shipping logo' style={{marginLeft:'3vw'}}/> <span style={{fontSize: '13px'}}>GHN</span>
                    </div>
                    <Divider/>
                    <div style={{backgroundColor: BACKGROUND_COLOR, borderRadius: '10px', padding: '5px', paddingBottom: '15px'}}>
                        <p style={{fontSize: '15px', fontWeight: 'bolder'}}>Payment method</p>
                        <img src={VNPAY_LOGO} width='100px' alt='shipping logo'/> <span style={{fontSize: '13px'}}>VN Pay</span>
                        <img src={CASH_ON_DELIVERY_LOGO} width='50px' alt='shipping logo' style={{marginLeft:'3vw'}}/> <span style={{fontSize: '13px'}}>Cash on delivery</span>
                        
                        <SelectButton className='p-ml-2 p-mb-5' value={paymentMethod} options={paymentOptions} itemTemplate={paymentOptionTemplate} onChange={e=>setPaymentMethod(e.value)}/>
                    
                        {paymentMethod === paymentMethodType.PAYPAL && <PayPalButton
                            options = {
                                {clientId: 'AZ7lZAzmFzxo9pbrGvgKv_KVNY8qg5bD1ZJZ_Tfr_46Dl_dE_6mjNk_p9ue3BalpjazGRwEouZGjJ6va',
                                currency: 'USD'}
                            }
                            shippingPreference = 'NO_SHIPPING'
                            amount = {props.total}
                            onSuccess = {async (details,data)=>{
                                    return checkout(JSON.stringify(details));
                            }}
                        />}
                        {paymentMethod === paymentMethodType.VNPAY && <div className='p-grid p-jc-center p-m-2 vnpay' onClick={onClickVNPayButton}> 
                            <img src={VNPAY_LOGO} width='70px' height='50px' alt='vnpaylogo'/>
                        </div>}
                    </div>
                    <div className='p-grid p-justify-start p-mt-6'>
                        <h3 className='p-col-3'>Payment Method</h3>
                        <RadioButton className='p-col-1 p-ml-6 p-pl-5' inputId="COD"  value={paymentMethodType.COD} onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === paymentMethodType.COD} />
                        <label htmlFor="COD">COD</label>
                        <RadioButton className='p-col-1 p-ml-6 p-pl-5' inputId="Paypal" name="city" value={paymentMethodType.PAYPAL} onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === paymentMethodType.PAYPAL} />
                        <label htmlFor="Paypal">Paypal</label>
                    </div>
                    <div className='p-grid p-justify-end'>
                        {paymentMethod === paymentMethodType.COD | paymentMethodType.VNPAY && <Button className='p-col-2 p-mr-5 p-mt-6' type='submit' icon='' label='Check Out'/>}
                        <Button className='p-col-2 p-mt-6' type='button' icon='' label='Cancel' onClick={()=>props.hide()}/>
                    </div>
                </Form>
                </div> */}
            </form>
        </div>
    );
}

export default CheckOut;