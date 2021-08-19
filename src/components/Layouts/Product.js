import React from 'react';
import './Product.css';
import {routeResource} from '../Constant/ResourceConstant';
import {Link} from 'react-router-dom';

const Product = (props)=>{
    const {product}=props;
    return (
        <Link to={'/product/'+product._id} className="product" style={{textDecoration:'none'}}>
            <img className="product_image" src={routeResource.image+'/'+product.album[0]} alt={product.name}/>
            <h2 className="product_name">{product.name}</h2>
            <h2 className="product_price">{product.price} USD</h2>
        </Link>
    )
}

export default Product;