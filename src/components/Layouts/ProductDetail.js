import React,{useRef,useEffect,useState,useCallback} from 'react';
import './ProductDetail.css';
import {Form} from 'react-bootstrap';
import {Button} from 'primereact/button';
import {useParams,useHistory,Link} from 'react-router-dom';
import Validation from '../Utils/Validation.utils';
import ProductRequestValidation from '../Validations/ProductRequest.validation';
import BackButton from '../Utils/Views/BackBtn';
import CustomConfirmDialog from '../Notifications/CustomConfirmDialog';
import { Editor } from 'primereact/editor';
import {Dropdown} from 'primereact/dropdown';
import ReactHtmlParser from 'react-html-parser';
import OrderImageList from '../Utils/Views/OrderImagesList';
import FileUpload from '../Utils/Views/FileUpload';
import Galleria from '../Utils/Views/Galleria';
import { InputSwitch } from 'primereact/inputswitch';
import {InputNumber} from 'primereact/inputnumber';
import 'primereact/editor/editor.min.css';
import {Divider} from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import productService from '../../service/product.service';
import {useSelector} from 'react-redux';
import { isEmpty } from 'lodash';
import { roles } from '../Constant/UserConstant';
import userService from '../../service/user.service';
import statusCode from 'http-status-codes';


const DEFAULT_ERRORS_STATE={
    'name' : [],
    'description' : [],
    'publishedYear': [],
    'quantity': [],
    'price':[],
    'album':[],
    'albumFile':[]
}
let DEFAULT_ALBUM_STATE=[];
let DEFAULT_DROPDOWN_STATE='';
let DEFAULT_BLOG_STATE='';
const ProductDetail=(props)=>{
    const [product,setProduct]= useState('');
    const [errors,setErrors]=useState(DEFAULT_ERRORS_STATE);
    const [blog, setBlog] = useState('');
    const [categoryOptions,setCategoryOptions]=useState();
    const [categoryDropdownValue,setCategoryDropdownValue]=useState([]);
    const [album,setAlbum]=useState([]);
    const [isAdminView,setIsAdminView]=useState(false);
    const [availableQuantity,setAvailableQuantity] = useState();
    const [isInitialize,setIsInitialize] = useState(false);
    
    const albumRef=useRef();
    const nameInput=useRef();
    const descriptionInput=useRef();
    const publishedYearInput=useRef();
    const quantityInput=useRef();
    const priceInput=useRef();

    const quantityCustomerInput=useRef();

    const _useHistory = useHistory();

    const {user,categories} = useSelector(state=>state);
    const {_id}=useParams();

    const addErrors=(comp,errorMsg)=>{
        setErrors((prevData)=>{
            return {
                ...prevData,
                [comp]: errorMsg
            }
        })
    }
   
    const onClickResetHandler =()=>{
        albumRef.current.clear();
        setAlbum(DEFAULT_ALBUM_STATE);
        setCategoryDropdownValue(DEFAULT_DROPDOWN_STATE);
        setBlog(DEFAULT_BLOG_STATE);
        setErrors(DEFAULT_ERRORS_STATE);        
    }
    const onClickDeleteHandler=async()=>{
        CustomConfirmDialog('Do you want to delete this project ?','Delete',deleteAction);
    }
    const onSwitchChangeHandler = (e)=>{
        setIsAdminView(e.value);
        if(!e.value) onClickResetHandler();
    }
    const deleteAction = async()=>{
        const data={_id:product._id};
        const res = await productService._delete(data);
        switch (res.status){
            case statusCode.OK:
                global.toast.show({severity:'success', summary: 'Delete product', detail: 'Successfully', life: 1500});
                props.onUpdate();
                _useHistory.replace('/');
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                break;
            default:
        }
    }
    useEffect(()=>{
        setCategoryOptions(prevData => {
            let categoryDropdownData=[];
            categories.forEach((category)=>{
                categoryDropdownData.push({
                    name: category.name,
                    value: category._id
                })
            });
            return categoryDropdownData;
        });     
    },[categories]);
    const calculateAvailableQuantity = (productQuantity)=>{
        const productInCart =  user.cart.find(i=>i.product._id===_id);
        const quantityInCart = (productInCart) ? productInCart.quantity : 0;
        setAvailableQuantity(productQuantity-quantityInCart); 
    }
    useEffect(()=>{
        product && calculateAvailableQuantity(product.quantity);
    },[user.cart])
    useEffect(()=>{                
        window.scrollTo(0,0);   
        const getProduct = async () =>{
            global.loading.show();
            const res = await productService.get(_id);
            if(res.status === statusCode.OK){
                const resProduct=res.data.payload.products;
                if(resProduct){
                    setProduct(resProduct);
                    setCategoryDropdownValue(resProduct.category);
                    setBlog(resProduct.blog);
                    setAlbum(resProduct.album);
                    calculateAvailableQuantity(resProduct.quantity);
                    DEFAULT_ALBUM_STATE=resProduct.album;
                    DEFAULT_DROPDOWN_STATE=resProduct.category;
                    DEFAULT_BLOG_STATE=resProduct.blog;     
                }  
            }else global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
            setIsInitialize(true);
            global.loading.hide();
        }    
        getProduct();
    },[]);
    const customerView=useCallback(()=>{
        const onSubmitCustomerHandler = async (e) =>{
            e.preventDefault();
            if(user.role === roles.NO_AUTH){
                _useHistory.replace('/signin');
            }else if(user.role === roles.CUSTOMER){
                let quantity = quantityCustomerInput.current.inputRef.current.value;
                const res = await userService.addToCart({_id,quantity});
                switch (res.status){
                    case statusCode.OK:
                        global.toast.show({severity:'success', summary: 'Successfully', detail: 'New product has been added to your cart', life: 1500});
                        break;
                    case statusCode.UNAUTHORIZED:
                        _useHistory.replace('/signin');
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                        break;
                    default:
                }     
            }      
        }
        return (
            <React.Fragment>  
                <Form className="product-detail" onSubmit={onSubmitCustomerHandler}>
                <div className="p-grid p-justify-center">
                   <div className='p-col-10 p-mt-6 p-mb-6 p-pb-6 p-grid p-justify-end'>
                   <div className='p-col-6 p-mr-5'>
                         <Galleria items={product.album}/>
                    </div>                        
                    <div className="p-col-5">                        
                        <Form.Group>
                            <Form.Text><h2>{product.name}</h2></Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Text>{!isEmpty(categoryOptions) && categoryOptions.find((op)=>op.value===product.category).name}</Form.Text>
                        </Form.Group> 
                        <Form.Group>  
                            <Form.Label>Description</Form.Label>
                            <Form.Text><InputTextarea rows={3} cols={60} autoResize readOnly defaultValue={product.description}/></Form.Text> 
                        </Form.Group>                          
                        <Form.Group>
                            <Form.Label>Published Year</Form.Label>                            
                            <Form.Text>
                                <h3>{product.publishedYear}</h3>
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label><br/>
                            <InputNumber inputId="horizontal" ref={quantityCustomerInput} showButtons buttonLayout="horizontal" step={1} style={{width: '4rem',height:'2rem'}}
                            decrementButtonClassName="p-button-secondary" required incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            max={availableQuantity} min={1}
                            />
                            <p>{`(Available: ${availableQuantity})`}</p>                            
                        </Form.Group>                        
                        <Form.Group>
                            <Form.Label>Price</Form.Label>                            
                            <Form.Text>
                                <h1>{product.price} $</h1>
                            </Form.Text>
                        </Form.Group>                        
                        <br/><Button className='p-mr-4' disabled={!(availableQuantity>0)} type='submit' icon='pi pi-shopping-cart' label='Add to cart'/>
                        <BackButton/>                        
                    </div>
                    </div>                    
                </div>                
                <div className="p-grid p-mt-6 p-pt-6 p-justify-center">
                <div className='p-col-11 p-mt-6 p-mb-6'>
                <Divider align="left" type='solid'>                
                    <h1>{product.name}</h1>
                </Divider>
                </div>
                    <div className='p-col-10 p-mt-1'>
                        <div className='ql-editor blog_image'>
                            {ReactHtmlParser(product.blog)}
                        </div>                       
                    </div>
                </div>
                    
                </Form> 
            </React.Fragment>
        );
    },[availableQuantity, categoryOptions, product,user.role]);
    const adminView = ()=>{
        const onSubmitHandler=async (e)=>{
            e.preventDefault();
            let submitAlbum = [];
            album.map(i=>(i.name)?submitAlbum.push(i.name):submitAlbum.push(i));
            let updateData={
                _id: product._id,
                name: nameInput.current.value,
                category: categoryDropdownValue,
                description: descriptionInput.current.value,
                publishedYear: publishedYearInput.current.value,
                quantity: quantityInput.current.value,
                price: priceInput.current.value,
                album: submitAlbum,
                deleteAlbum: [],
                blog: blog
            }
            if(albumRef.current.files) updateData={...updateData,albumFile:albumRef.current.files}
            
            const validateReq=Validation(ProductRequestValidation.update(updateData));
            if(validateReq.isValid){           
                const res = await productService.update(updateData);
                switch (res.status){
                    case statusCode.OK:
                        const resProduct=res.data.payload.product;
                        setProduct(resProduct);
                        setCategoryDropdownValue(resProduct.category);
                        setBlog(resProduct.blog);
                        setAlbum(resProduct.album);
                        setErrors(DEFAULT_ERRORS_STATE);
                        setAvailableQuantity(resProduct.quantity);
                        albumRef.current.clear();
                        DEFAULT_ALBUM_STATE=resProduct.album;
                        DEFAULT_DROPDOWN_STATE=resProduct.category;
                        DEFAULT_BLOG_STATE=resProduct.blog;
                        global.toast.show({severity:'success', summary: 'Update product', detail: 'Successfully', life: 1500});
                        props.onUpdate(); 
                        break;
                    case statusCode.UNAUTHORIZED:
                        _useHistory.replace('/signin');
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                        break;
                    default:
                }
            } else setErrors((prevData)=>{ 
                let updateDataState={...prevData};
                for(let property in validateReq.errors){
                    updateDataState={...updateDataState,[property]:validateReq.errors[property]}
                }
                return updateDataState; 
            }); 
        }
        return (
            <React.Fragment>               
                <Form className="product-detail" onSubmit={onSubmitHandler}>
                <div className="p-grid p-justify-center">               
            <div className='p-col-7 p-ml-6 p-mt-6'>
                <OrderImageList allowRemove onRemove={(item)=>setAlbum(album.filter(f=>f!==item))} items={album} onChange={setAlbum}/>
                <Form.Text >
                    {errors.album.map((error,index)=>
                        <p key={index}>{error}</p>
                    )}                            
                </Form.Text>
            </div>
            <div className='p-col-3 p-mt-6'>
                <FileUpload _ref={albumRef} 
                    onChoose={(items)=>{setAlbum(album.concat(items))}} 
                    onRemove={(item)=>setAlbum(album.filter((i)=>i.objectURL!==item))}
                    onClear={()=>setAlbum(album.filter((i)=>i.objectURL===undefined))}
                    multiple={true}
                    invalidFileHandler={addErrors}
                    errorLabel='albumFile'
                />
                <Form.Text >
                    {errors.albumFile.map((error,index)=>
                        <p key={index}>{error}</p>
                    )}                            
                </Form.Text>
            </div>  
                    <div className="product-detail_content p-col-10 p-mt-6">
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={product.name} ref={nameInput} />
                            <Form.Text>{errors.name.map((error,index) =>
                                <p key={index}>{error}</p>
                            )}</Form.Text> 
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Group>
                            <Dropdown style={{width:'100%'}} optionLabel="name" options={categoryOptions} value={categoryDropdownValue} onChange={(e)=>setCategoryDropdownValue(e.value)}/>
                            </Form.Group>
                        </Form.Group>                         
                        <Form.Group>  
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" defaultValue={product.description} ref={descriptionInput}/>
                            <Form.Text>{errors.description.map((error,index) =>
                                <p key={index}>{error}</p>
                            )}</Form.Text>
                        </Form.Group>                          
                        <Form.Group>
                            <Form.Label>Published Year</Form.Label>
                            <Form.Control type="number" step="1"  defaultValue={product.publishedYear} ref={publishedYearInput} required/>
                            <Form.Text>{errors.publishedYear.map((error,index) =>
                                <p key={index}>{error}</p>
                            )}</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" step="1"  defaultValue={product.quantity} ref={quantityInput} required/>
                            <Form.Text>{errors.quantity.map((error,index) =>
                                <p key={index}>{error}</p>
                            )}</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" className="product-detail_price" step="1" defaultValue={product.price} ref={priceInput} required />
                            <Form.Text>{errors.price.map((error,index) =>
                                <p key={index}>{error}</p>
                            )}</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Blog</Form.Label>
                            <Editor style={{ height: '70vh' }} value={blog} onTextChange={(e) => setBlog(e.htmlValue)} />
                        </Form.Group>
                        <br/>
                        <Button type='submit' className='p-mr-4' icon='pi pi-save' label='Save'/>
                        <Button type='button' className='p-mr-4' onClick={onClickDeleteHandler} icon='pi pi-times' label='Delete'/> 
                        <Button type='reset' className='p-mr-4' onClick={onClickResetHandler} icon='pi pi-undo' label='Reset'/>
                        <BackButton/>                       
                    </div>
                    </div>               
                </Form>
                <div className="card">
               
                </div>
            </React.Fragment>
        );
    }
    const emptyView = ()=>{
        return (
            <div className="product-detail p-grid p-align-center vertical-container p-justify-center">
                <h1 className='p-col-12'>Product is not exist</h1>
                <Link className='p-col-12' to='/'><p>Back to shop</p></Link>
            </div>
        );
    }
    return (
        <React.Fragment>
            {user.role === roles.ADMIN && <InputSwitch checked={isAdminView} onChange={onSwitchChangeHandler} style={{position:'absolute',top:'2vh',left:'2vw'}}/>}
            {isInitialize && isAdminView && !isEmpty(product) && adminView()}
            {isInitialize && !isAdminView && !isEmpty(product) && customerView()}
            {isInitialize && isEmpty(product) && emptyView()}
        </React.Fragment>
    );
 }

export default ProductDetail;