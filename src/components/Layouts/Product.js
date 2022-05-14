import React, { useState, Fragment } from 'react';
import './Product.css';
import {routeResource} from '../Constant/ResourceConstant';
import {Link} from 'react-router-dom';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import userService from '../../service/user.service';

const Product = (props)=>{
    const {product}=props;
    const _useHistory = useHistory();
    const [style,setStyle] = useState({cursor: 'pointer'});
    const onMouseOver = () => {
        setStyle(prevData=>{
            return {...prevData,borderColor: 'green',borderStyle: 'solid', borderWidth: 'thin'}
        })
    }
    const onMouseLeave = () => {
        setStyle({cursor: 'pointer'});
    }
    const onClickAddToCartHandler = () =>{
        userService.addToCart(product._id,1)
        global.toast.show({severity:'success', summary: 'Successfully', detail: 'This product has been added to your cart', life: 1500});
    }
    return (
        <div className='p-grid p-jc-center' style={{textAlign: 'center'}}>
            <div onClick={()=>_useHistory.push('/product/'+product._id)} className="product p-col-11" style={style} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                <img className="product_image" src={product.album[0]} alt={product.name}/>
                <div className='p-mt-3'>
                    <h6 className="product_name ">{product.name}</h6>
                    <h6 className="product_price ">{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h6>
                </div>                                
            </div>
            <div className='p-col-11' style={{marginTop: '-5.5vh'}} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                <Button style={{borderRadius: '7px',width: '100%'}} type='button' label='Add to cart' onClick={onClickAddToCartHandler}/>
            </div>
        </div>
    )
}

export default Product;