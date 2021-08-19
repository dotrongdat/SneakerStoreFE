import React,{useState,useEffect,useRef} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {RadioButton } from 'primereact/radiobutton'
import {Link} from  'react-router-dom';
import { routeResource } from '../Constant/ResourceConstant';
import {useSelector} from 'react-redux';
import {Form} from 'react-bootstrap';
import orderService from '../../service/order.service';
import statusCode from 'http-status-codes';
import {PayPalButton} from 'react-paypal-button-v2';
import {paymentMethodType} from '../Constant/OrderConstant';
import './CheckOut.css';

const CheckOut = (props)=>{
    const [selectedProducts,setSelectedProducts]=useState([]);
    //const categories=JSON.parse(sessionStorage.getItem('categories'));
    const {user,categories} = useSelector(state=>state);   

    const receiverNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const [paymentMethod,setPaymentMethod] = useState('1');

    
    const nameBodyTemplate = (rowData) => {
        return (
            <div>
                <Link to={`/product/${rowData._id}`}>
                    <img src={routeResource.image+'/'+rowData.album[0]} alt={rowData.name} style={{height:'10vh',width:'10vw'}}/>
                </Link>               
                <p>{rowData.name}</p>
            </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.category).name}</p>;
    const priceBodyTemplate = (rowData) => <p>${` ${rowData.price}`}</p>;
    const quantityBodyTemplate = (rowData) => <p>{rowData.quantity}</p>;
    const checkout = async (paymentInfo) =>{
        let cart=[];
        const {items}=props
        for(let property in items){
            if(items[property]) cart.push(property);
        }
        const info = {
            receiverName : receiverNameRef.current.value,
            email : emailRef.current.value,
            phone : phoneRef.current.value,
            address : addressRef.current.value,
            paymentMethod : {
                type : paymentMethod,
                paymentInfo
            }
        }
        const res = await orderService.checkout({
            cart,
            info
        });
        switch (res.status){
            case statusCode.OK:
                global.toast.show({severity:'info', summary: 'Order', detail: 'Your order are in processing', life: 1500});
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
    }
    const onSubmitHandler = (e)=>{
        global.loading.show();
        e.preventDefault();
        checkout();
    }
    useEffect(()=>{
        const {items}=props
        if(items){
            let _selectedProducts=[];
            const {cart} = user;
            cart.forEach(i=>{
                if(items[i.product._id] === true){
                    let {product,quantity} = i;
                    _selectedProducts.push({...product,quantity});
                }
            })
            setSelectedProducts(_selectedProducts);
        }
    },[props, user])
    return (
        <div className='p-grid p-justify-center'>
            <div className='p-col-7 checkout'>
                <DataTable value={selectedProducts} showGridlines>
                    <Column header='Name' body={nameBodyTemplate}/>
                    <Column header='Brand' body={brandBodyTemplate}/>
                    <Column header='Price' body={priceBodyTemplate}/>
                    <Column header='Quantity' field='quantity' body={quantityBodyTemplate}/>
                </DataTable>
                <div className='p-grid p-justify-end'>
                     <h2>{`Total:   ${props.total}$`}</h2>
                </div>
                <Form id='checkout-form' onSubmit={onSubmitHandler}>
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
                        <InputText placeholder="Phone" ref={phoneRef} required/>
                    </div>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-map"></i>
                        </span>
                        <InputText placeholder="Address" ref={addressRef} required/>
                    </div>
                    <div className='p-grid p-justify-start p-mt-6'>
                        <h3 className='p-col-3'>Payment Method</h3>
                        <RadioButton className='p-col-1 p-ml-6 p-pl-5' inputId="COD"  value={paymentMethodType.COD} onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === paymentMethodType.COD} />
                        <label htmlFor="COD">COD</label>
                        <RadioButton className='p-col-1 p-ml-6 p-pl-5' inputId="Paypal" name="city" value={paymentMethodType.PAYPAL} onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === paymentMethodType.PAYPAL} />
                        <label htmlFor="Paypal">Paypal</label>
                    </div>
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
                    <div className='p-grid p-justify-end'>
                        {paymentMethod === paymentMethodType.COD && <Button className='p-col-2 p-mr-5 p-mt-6' type='submit' icon='' label='Check Out'/>}
                        <Button className='p-col-2 p-mt-6' type='button' icon='' label='Cancel' onClick={()=>props.hide()}/>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default CheckOut;