import React,{useEffect,useState,useCallback} from 'react';
import './Cart.css';
import {useDispatch, useSelector} from 'react-redux';
import {DataTable} from 'primereact/datatable';
import userService from '../../service/user.service';
import statusCode from 'http-status-codes';
import {useHistory,Link} from 'react-router-dom';
import {Column} from 'primereact/column';
import {InputNumber} from 'primereact/inputnumber';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import { routeResource } from '../Constant/ResourceConstant';
import orderService from '../../service/order.service';
import {Sidebar} from 'primereact/sidebar';
import CheckOut from './CheckOut';
import CustomConfirmDialog from '../Notifications/CustomConfirmDialog';


const Cart = (props) =>{
    let t;
    const _useHistory = useHistory();
    const dispatch = useDispatch();

    const {user,categories} = useSelector(state=>state);
    const [checkedBoxList,setCheckedBoxList] =useState();
    const [checkedBoxAll,setCheckedBoxAll]=useState(false);
    const [total,setTotal]=useState(0);
    const [checkoutSideBar,setCheckoutSideBar]=useState(false);
    
    const getCart = useCallback(async () =>{
        global.loading.show();
        const res = await userService.getCart();
        switch (res.status){
            case statusCode.OK: 
                const {cart} = res.data.payload;
                let checkedBoxListInitState={}; 
                cart.forEach(i=>{
                    checkedBoxListInitState = {...checkedBoxListInitState ,[i.product._id]:false};
                });
                setCheckedBoxList(checkedBoxListInitState);
               dispatch({type:'updateCart',cart});
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                break;
            default:
        }
        global.loading.hide();
    },[]);
    const onChangeQuantityInputHandler =useCallback(e =>{
        const updateCart = async ()=>{
            const {value} = e;
            if(value){
                global.loading.show();
                let {cart} = user;
                const _id = e.originalEvent.nativeEvent.target.parentElement.parentElement.id ||  e.originalEvent.nativeEvent.target.parentElement.id;
                cart = cart.map((i)=>{
                    let {product,quantity} = i;
                    if(product._id === _id) quantity=value;
                    return {product:product._id,quantity};
                })      
                const res = await userService.updateCart({cart});
                switch (res.status) {
                    case statusCode.OK: 
                            // setCheckedBoxAll(false);
                            break;
                    case statusCode.UNAUTHORIZED:  
                            _useHistory.replace('/signin');
                            break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                            global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                            break;
                    default: 
                }
                global.loading.hide();
            }
        }
        clearTimeout(t);
        t = setTimeout((updateCart),500);       
    },[]);
    const onClickCheckBoxHandler =useCallback(e =>{
        const _id=e.value;
        setCheckedBoxList((prevData)=>{
            return {...prevData,[_id]:e.checked};
        })
    },[])
    const onClickCheckBoxAllHandler = useCallback(async (e) => {
        setTotal(0);
        setCheckedBoxAll(e.checked);
        setCheckedBoxList((prevData)=>{
            let updateData={...prevData};
            for(let property in prevData){
                updateData[property]=e.checked;
            }
            return updateData;
        })
    },[])
    const onClickDeleteButtonHandler = useCallback (() => {
        CustomConfirmDialog('Do you want to remove this products from your cart ?','Remove',async ()=>{
            global.loading.show();
            let {cart} = user;
            cart = cart.filter(i=>checkedBoxList[i.product._id]===false);
            cart = cart.map((i)=>{
                let {product,quantity} = i;
                product = product._id;
                return {product,quantity};
            })        
            const res = await userService.updateCart({cart});
            switch (res.status) {
                    case statusCode.OK: 
                            setCheckedBoxAll(false);
                            break;
                    case statusCode.UNAUTHORIZED:  
                            _useHistory.replace('/signin');
                            break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                            global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});                   
                            break;
                    default: 
                }
            global.loading.hide();
        });        
    },[checkedBoxList, user.cart])
    const onClickConfirmCartHandler = useCallback(async() => {
        let cart = [];
        for(let property in checkedBoxList){
            if(checkedBoxList[property]) cart.push(property);
        }
        const res = await orderService.validate({cart});
        switch (res.status){
            case statusCode.OK:
                setCheckoutSideBar(true);
                break;
            case statusCode.BAD_REQUEST:
                await getCart();
                global.toast.show({severity:'error', summary: 'Fail', detail: 'Appear invalid items in your cart. Please check again!', life: 1500});               
                break;
            case statusCode.UNAUTHORIZED:  
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                break;
            default:
        }
    },[checkedBoxList, getCart]);
    const onHideSideBarHandler = useCallback(() => setCheckoutSideBar(false),[]);
    const header = (
        <div className="table-header">
            <h4>Your Shopping Cart</h4>
        </div>
    );
    const footer = `In total there are ${user.cart.length} products.`;
    
    const checkboxHeader = (
        <React.Fragment>
            <Checkbox checked={checkedBoxAll}  onChange={onClickCheckBoxAllHandler}/>
            <Button icon='pi pi-trash' type='button' className='p-button-lg p-button-rounded p-button-secondary p-button-text' onClick={onClickDeleteButtonHandler}/>
        </React.Fragment>
    );
    const checkBoxTemplate = (rowData) => {
        return (
            <React.Fragment>
                {checkedBoxList && <Checkbox checked={checkedBoxList[rowData.product._id]}  onChange={onClickCheckBoxHandler} value={rowData.product._id}/>}
            </React.Fragment>           
        );        
    }
    const nameBodyTemplate = (rowData) => {
        return (
            <div>
                <Link to={`/product/${rowData.product._id}`}>
                    <img src={routeResource.image+'/'+rowData.product.album[0]} alt={rowData.product.name} style={{height:'10vh',width:'10vw'}}/>
                </Link>               
                <p>{rowData.product.name}</p>
            </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
    const priceBodyTemplate = (rowData) => <p>${` ${rowData.product.price}`}</p>
    const quantityBodyTemplate = (rowData) => {
        return (
            <InputNumber value={rowData.quantity} showButtons buttonLayout="horizontal" step={1} style={(rowData.product.quantity>=rowData.quantity)?{height:'2rem'}:{height:'2rem',backgroundColor:'red'}} size={1}
                decrementButtonClassName="p-button-secondary" required incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                max={rowData.product.quantity} min={1} onChange={onChangeQuantityInputHandler} id = {rowData.product._id} tooltip={`Max: ${rowData.product.quantity}`}
            /> 
        );
    }
    const rowClass = (rowData) =>{
        return {
            'disable':rowData.product.status === false,
            'enable':rowData.product.status === true
        }
    }
    useEffect(()=>{
        if(checkedBoxList){
            let _total=0;
            user.cart.forEach(i=>{
                if(checkedBoxList[i.product._id]===true) _total+=(i.quantity * i.product.price);
            })
            setTotal(_total);
        }
    },[checkedBoxList,user.cart])
    useEffect(()=>{
        let checkedBoxListInitState={};
        user.cart.forEach(i=>{
            checkedBoxListInitState = {...checkedBoxListInitState ,[i.product._id]:false};
        });
        setCheckedBoxList(checkedBoxListInitState);
        setCheckoutSideBar(false);
    },[user.cart]);
    return (
        <React.Fragment>
            <Sidebar visible={checkoutSideBar} fullScreen onHide={onHideSideBarHandler}>
                <CheckOut hide={onHideSideBarHandler} items={checkedBoxList} total={total}/>
            </Sidebar>
            <div className='p-grid p-justify-center p-mt-5'>
                <div className='cart p-grid p-justify-center p-col-10'>
                    <DataTable scrollable scrollHeight="400px" className='p-col-12' value={user.cart} header={header} footer={footer} rowClassName={rowClass} showGridlines>
                        <Column header={checkboxHeader} body={checkBoxTemplate} />
                        <Column header='Name' body={nameBodyTemplate}/>
                        <Column header='Brand' body={brandBodyTemplate}/>
                        <Column header='Price' body={priceBodyTemplate}/>
                        <Column header='Quantity' field='quantity' body={quantityBodyTemplate}/>
                    </DataTable>
                    <div className='p-grid p-justify-start p-col-6'>
                        <h2>Total: $ {total}</h2>
                    </div>   
                    <div className='p-grid p-justify-end p-col-6'>
                        <Button icon='pi pi-credit-card' disabled={total === 0} label='Confirm Cart' onClick={onClickConfirmCartHandler} className='p-col-4 p-mr-5'/>
                        <Button className='p-col-4' label='Continue Shopping' onClick={e=> _useHistory.replace('/')}/> 
                    </div>      
                </div>            
            </div>
        </React.Fragment>
    );
}

export default Cart;