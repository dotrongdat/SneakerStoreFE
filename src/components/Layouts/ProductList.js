import React from 'react';
import Product from './Product';
import './Product.css';
import './ProductList.css';
import { isEmpty } from 'lodash';

const ProductList=(props)=>{
    const products=props.products;
    const view = ()=>{
        return (
            <div className="p-grid p-formgrid p-fluid p-justify-right product-list">
                {products.map((product,index)=>(
                    
                    <div key={index} className='p-col-3  p-p-4'>
                        <div key={index} className='p-grid p-justify-center'>
                            <div key={index} className='p-col-11 product'> 
                    <Product key={product._id} product={product}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    const emptyView = ()=> {
        return (
            <div className="product-list p-grid p-align-center vertical-container p-justify-center">
                <h1 className='p-col' color='red'>Empty</h1>
            </div>
        )};  
    return (
        <React.Fragment>
            {isEmpty(products) ? emptyView() : view()}
        </React.Fragment>
    );                
}

export default ProductList