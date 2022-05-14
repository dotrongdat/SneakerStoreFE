import React, { Fragment } from 'react';
import {Carousel} from 'primereact/carousel';
import { useSelector } from 'react-redux';
import Product from './Product';
import { Link } from 'react-router-dom';
import { COVID19_PANEL } from '../Constant/ResourceConstant';
import { Divider } from 'primereact/divider';
import { PRIMARY_COLOR } from '../Constant';
const Home = () => {
    const items = [
        'https://s3.theasianparent.com/cdn-cgi/image/height=412/tap-assets-prod/wp-content/uploads/sites/6/2020/08/imgonline-com-ua-twotoone-0EB490dsXC4It.jpg',
        'https://www.dukehealth.org/sites/default/files/styles/hero_image_lg/public/blog_post/Kid%20version_1932%20x%20862-draft03b.webp?itok=LtqSRC7M',
        'https://render.fineartamerica.com/images/rendered/default/flat/face-mask/images/artworkimages/medium/3/1-naruto-shippuden-group-panels-t-shirt-copy-handeza-store-transparent.png?&targetx=227&targety=97&imagewidth=249&imageheight=300&modelwidth=704&modelheight=495&backgroundcolor=000000&orientation=0&producttype=facemaskflat-large&v=5',
    ]
    const panelTemplate = (item)=>{
        return <img src={item} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt='imagelogo' className="product-image" width={'100%'} />
    }
    const productCarouselTemplate = (item) => {
        return (
            <div style={{margin: '1.5vh'}}>
                <Product product={item}/>
            </div>                            
        )
    }
    const {allProducts, categories} = useSelector(state => state);

    return (
        <Fragment>
            <div class="p-grid p-mt-4 nested-grid" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '10px'}}>
                <div class="p-col-8">
                    <Carousel value={items} numVisible={1} numScroll={1} circular autoplayInterval={3000} itemTemplate={panelTemplate} />
                </div>
                <div class="p-col-3 p-ml-1">
                    <div class="p-grid">
                        <div class="p-col-12">
                            <img src={items[0]} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt='imagelogo' className="product-image" width={'100%'} />
                        </div>
                        <div class="p-col-12">
                        <img src={items[1]} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt='imagelogo' className="product-image" width={'100%'} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-grid p-mt-4 vertical-container' style={{backgroundImage: `url(${COVID19_PANEL})`, backgroundSize: '100% 100%', height: '500px', borderRadius:'10px'}}>                
                <div className='p-col-12 p-as-end p-mb-4 p-ml-2'>
                <img style={{marginRight: '25px'}} src='/virus.png' alt='medicineLogo' width={'5%'} height={'12%'}/>
                <p style={{color:'white',fontWeight:'bolder'}}>Covid symptoms</p>
                <img style={{marginRight: '25px'}} src='/vaccinated.png' alt='medicineLogo' width={'5%'} height={'12%'}/>
                <p style={{color:'white',fontWeight:'bolder'}}>How to take care of</p>
                <img style={{marginRight: '25px'}} src='/medicine.png' alt='medicineLogo' width={'5%'} height={'12%'}/>
                <p style={{color:'white',fontWeight:'bolder'}}>Medicine</p>
                <img style={{marginRight: '25px'}} src='/hotline.png' alt='medicineLogo' width={'5%'} height={'12%'}/>  
                <p style={{color:'white',fontWeight:'bolder'}}>Hotlines</p>
                </div>          
            </div>
            <div class="p-grid p-mt-4" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '10px'}}>
                <div className='p-col-12' style={containerTitleStyle}>
                    <h3 style={{fontFamily: 'cursive', fontWeight: 'lighter', color:'white'}}>Best Seller</h3>
                    <Link style={{position: 'absolute', right: '10px', top: '30%',textDecoration: 'none',fontFamily: 'cursive',color: 'white'}}>{'View all >'}</Link>                    
                </div>                
                <Carousel style={{margin: '10px'}} value={allProducts.slice(0,10)} numVisible={4} numScroll={4} itemTemplate={productCarouselTemplate}/>
            </div>
            <div class="p-grid p-mt-4" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '10px'}}>
                <div className='p-col-12' style={containerTitleStyle}>
                    <h3 style={{fontFamily: 'cursive', fontWeight: 'lighter',color:'white'}}>Best Price For Today</h3>
                    <Link style={{position: 'absolute', right: '10px', top: '30%',textDecoration: 'none',fontFamily: 'cursive',color: 'white'}}>{'View all >'}</Link>                    
                </div>               
                <Carousel style={{margin: '10px'}} value={allProducts.slice(5,12)} numVisible={4} numScroll={4} itemTemplate={productCarouselTemplate}/>
            </div>
            <div class="p-grid p-mt-4" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '10px'}}>
                <div className='p-col-12' style={containerTitleStyle}>
                    <h3 style={{fontFamily: 'cursive', fontWeight: 'lighter',color: 'white'}}>New Products</h3>
                    <Link style={{position: 'absolute', right: '10px', top: '30%',textDecoration: 'none',fontFamily: 'cursive',color: 'white'}}>{'View all >'}</Link>                    
                </div>
                <Carousel style={{margin: '10px'}} value={allProducts.slice(7,15)} numVisible={4} numScroll={4} itemTemplate={productCarouselTemplate}/>
            </div>
            
        </Fragment>
    )
}
export default Home;

const containerTitleStyle= {
    backgroundColor: PRIMARY_COLOR, 
    position: 'relative', 
    borderTopLeftRadius: '10px', 
    borderTopRightRadius:'10px'
}