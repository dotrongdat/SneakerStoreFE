import React,{useEffect,useState,useCallback} from 'react';
import './Cart.css';
import {useDispatch, useSelector} from 'react-redux';
import {DataTable} from 'primereact/datatable';
import userService from '../../service/user.service';
import statusCode from 'http-status-codes';
import {useHistory,Link} from 'react-router-dom';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import { routeResource } from '../Constant/ResourceConstant';
import orderService from '../../service/order.service';
import {Sidebar} from 'primereact/sidebar';
import CheckOut from './CheckOut';
import CustomConfirmDialog from '../Notifications/CustomConfirmDialog';
import { toVNDCurrencyFormat } from '../Utils/Function.util';
import InputNumber from '../Utils/Views/InputNumber';
import { BACKGROUND_COLOR } from '../Constant';

let t;
const Cart = (props) =>{
    const _useHistory = useHistory();
    //const dispatch = useDispatch();

    const {user,categories,allProducts} = useSelector(state=>state);
    const [selectedProduct,setSelectedProduct] = useState([]);
    const [quantityInputValue,setQuantityInputValue] = useState();
    const [total,setTotal]=useState(0);
    const [checkoutSideBar,setCheckoutSideBar]=useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [cart,setCart] = useState([]);
    
    const onChangeQuantityInputHandler = (value,_id) =>{
        //console.log(value);
        let func = () => {
            // const {value} = e;
            if(value || value === 0){
                const updateCart =  ()=>{
                    if(quantityInputValue[_id].available >= value){
                        let {cart} = user;
                        //const _id = e.originalEvent.nativeEvent.target.parentElement.parentElement.id ||  e.originalEvent.nativeEvent.target.parentElement.id;
                        const index = cart.findIndex(i=>i._id===_id);
                        cart[index].quantity = value;
                        userService.updateCart(cart);
                        return true;
                    } return false;                        
                }
                const remove = ()=>{
                    let {cart} = user;
                    cart = cart.filter(i=> i._id!==_id);
                    userService.updateCart(cart);
                }
                const reject = ()=>{
                    // setQuantityInputValue(prevData=>{
                    //     return {...prevData,
                    //         [_id]: {
                    //             ...prevData[_id],
                    //             quantity: 1
                    //         }
                    //     }
                    // })
                }
                if(value === 0){
                    CustomConfirmDialog("Do you want to remove this product from your cart ?","Remove",()=>{
                        remove();
                        global.toast.show({severity:'success', summary: 'Cart', detail: 'This product has been remove from your cart', life: 1500});
                    },reject);
                    // console.log("Value = 0")
                }else {
                    if(updateCart()) global.toast.show({severity:'success', summary: 'Cart', detail: 'Update cart successfully', life: 1500});
                }
            }
        }
        func();
        //if(value !== quantityInputValue[_id].quantity) {clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        //t = setTimeout(func,500);   }    
    };
    const onClickConfirmCartHandler = useCallback(async() => {
        global.loading.show();
        const res = await orderService.validate({cart:user.cart});
        switch (res.status){
            case statusCode.OK:
                setCheckoutSideBar(true);
                break;
            case statusCode.BAD_REQUEST:
                //await getCart();
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
        global.loading.hide();
    },[]);
    const onClickDeleteAllHandler = ()=>{
        CustomConfirmDialog('Do you want to remove these products from your cart ?','Remove',()=>{
            let {cart} = user;
            const _id = selectedRow.map(i=>i.product._id);
            cart = cart.filter(i=>!_id.includes(i._id));
            userService.updateCart(cart);
            global.toast.show({severity:'success', summary: 'Cart', detail: 'These products has been remove from your cart', life: 1500});               
        });        
    }
    const onClickDeleteItemHandler = (_id) => {
        CustomConfirmDialog('Do you want to remove this product from your cart ?','Remove',()=>{
            userService.updateCart(user.cart.filter(i=>i._id !== _id));
            global.toast.show({severity:'success', summary: 'Cart', detail: 'This product has been remove from your cart', life: 1500});               
        });
    }
    const onHideSideBarHandler = useCallback(() => setCheckoutSideBar(false),[]);
    const header = (
        <div className="p-d-flex p-jc-end">
                    <Button className='p-button-danger' type="button" icon="pi pi-trash" label="Delete" onClick={onClickDeleteAllHandler} disabled={!selectedRow || !selectedRow.length}/>                          
            </div>
    );
    const footer = `In total there are ${user.cart.length} products.`;
    const onSelectionChange = (e)=>{
        setSelectedRow(e.value);
    }
    const nameBodyTemplate = (rowData) => {
        return (
            <div className=''>
                <Link to={`/product/${rowData.product._id}`}  style={{textDecoration:'none'}}>
                    <img className='' src={rowData.product.album[0]} alt={rowData.product.name} style={{height:'5vw',width:'5vw'}}/>
                    {/* <div className='p-col-8' style={{width:'50px',whiteSpace:'normal',marginLeft:'5px'}}> */}
                        <span style={{marginLeft: '2px'}}>{rowData.product.name}</span>    
                    {/* </div>                        */}
                </Link>               
            </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
    const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.product.price)} VND</p>
    const quantityBodyTemplate = (rowData) => {
        return (
            // <InputNumber value={quantityInputValue[rowData.product._id].quantity} showButtons buttonLayout="horizontal" step={1} style={(rowData.product.quantity>=rowData.quantity)?{height:'2rem'}:{height:'2rem',backgroundColor:'red'}} size={1}
            //     decrementButtonClassName="p-button-secondary" required incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
            //     max={rowData.product.quantity} min={0} onValueChange={(e)=>onChangeQuantityInputHandler(e,rowData.product._id)} id = {rowData.product._id} tooltip={`Available: ${rowData.product.quantity}`}
            // /> 
            <InputNumber value={quantityInputValue[rowData.product._id].quantity} beforeValueChange={(value)=>onChangeQuantityInputHandler(value,rowData.product._id)} 
                size={3} min={0} max={rowData.product.quantity} 
                tooltip={`Available: ${rowData.product.quantity}`}
            />
        );
    }
    const actionBodyTemplate = (rowData) => {
        return <Button className='p-button-warning' type='button' icon='pi pi-trash' onClick={()=>onClickDeleteItemHandler(rowData.product._id)}/>
    }
    const rowClass = (rowData) =>{
        return {
            'disable':rowData.product.status === false,
            'enable':rowData.product.status === true
        }
    }
    useEffect(()=>{
        setSelectedProduct(selectedRow.map(i=>{
            return {...i.product, quantity: i.quantity}
        }))
    },[selectedRow])
    useEffect(()=>{
        let _cart = [];
        let _quantityInputValue = {};
        let _selectedRow = selectedRow;
        if(allProducts.length > 0) user.cart.forEach(i=>{
            const product = allProducts.find(p=>p._id === i._id);
            _cart.push({quantity: parseInt(i.quantity), product});
            _quantityInputValue = {..._quantityInputValue, 
                [i._id]:{
                    quantity:i.quantity,
                    available: product.quantity
                }
            }
            const index = _selectedRow.findIndex(row=>row.product._id === i._id);
            if(index !== -1)_selectedRow[index].quantity = parseInt(i.quantity);
        });
        setSelectedRow(_selectedRow);
        setCart(_cart);
        setCheckoutSideBar(false);
        setQuantityInputValue(_quantityInputValue);
    },[allProducts, user]);
    useEffect(()=>{
        setTotal(()=>{
            let _total = 0;
            selectedRow.forEach(v=> _total += v.quantity * v.product.price);
            return _total
        })
    },[JSON.stringify(selectedRow)])
    return (
        <React.Fragment>
            <Sidebar visible={checkoutSideBar} fullScreen onHide={onHideSideBarHandler}>
                <CheckOut hide={onHideSideBarHandler} items={selectedProduct} total={total}/>
            </Sidebar>
            <div className='p-d-flex p-mt-5'>
                <div className='cart p-justify-center p-col-8'>
                    <DataTable emptyMessage="Your cart is empty" className='p-col-12' responsiveLayout="scroll" dataKey='product._id'
                        value={cart} header={header} footer={footer} rowClassName={rowClass} showGridlines
                        selection={selectedRow} onSelectionChange={onSelectionChange}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        <Column header='Name' body={nameBodyTemplate}/>
                        <Column header='Brand' body={brandBodyTemplate}/>
                        <Column header='Price' body={priceBodyTemplate}/>
                        <Column header='Quantity' field='quantity' body={quantityBodyTemplate}/>
                        <Column body={actionBodyTemplate}/>
                    </DataTable>   
                </div>      
                <div className='p-col-4' style={{backgroundColor: BACKGROUND_COLOR}}>
                    <div className='p-col-11 p-ml-2 p-p-5' style={{backgroundColor: 'white', borderRadius: '10px'}}>
                        <h4 style={{fontFamily: 'cursive', fontWeight: 'bolder'}}>Total</h4>
                        <div className='p-d-flex p-jc-between'>
                            <p>Provisional sum</p>
                            <p style={{fontSize:'1.1rem', fontWeight:'bolder'}}>{toVNDCurrencyFormat(total)} VND</p>
                        </div>
                        <div className='p-d-flex p-jc-around'>
                            <Button className='p-col-6' style={{color: 'green', fontWeight: 'bolder', borderColor: 'green', backgroundColor: BACKGROUND_COLOR}}  label='Shopping' onClick={e=> _useHistory.replace('/')}/> 
                            <Button className='p-col-5 p-button-warning' style={{color: 'white', borderRadius: '20px'}} disabled={total === 0} label='Confirm Cart' onClick={onClickConfirmCartHandler}/>
                        </div>
                    </div>   
                </div>      
            </div>
        </React.Fragment>
    );
}

export default Cart;