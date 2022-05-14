import React,{useRef,useEffect,useState,useCallback, useImperativeHandle, forwardRef} from 'react';
import './ProductDetail.css';
import {Form, Button as BSButton} from 'react-bootstrap';
import {Button} from 'primereact/button';
import {useParams,useHistory,Link} from 'react-router-dom';
import Validation from '../../Utils/Validation.utils';
import ProductRequestValidation from '../../Validations/ProductRequest.validation';
//import BackButton from '../Utils/Views/BackBtn';
import { Editor } from 'primereact/editor';
import {Dropdown} from 'primereact/dropdown';
// import ReactHtmlParser from 'react-html-parser';
import OrderImageList from '../../Utils/Views/OrderImagesList';
import FileUpload from '../../Utils/Views/FileUpload';
// import Galleria from '../Utils/Views/Galleria';
// import { InputSwitch } from 'primereact/inputswitch';
import {InputNumber} from 'primereact/inputnumber';
import 'primereact/editor/editor.min.css';
// import {Divider} from 'primereact/divider';
// import { InputTextarea } from 'primereact/inputtextarea';
import productService from '../../../service/product.service';
import {useSelector} from 'react-redux';
// import { isEmpty } from 'lodash';
import statusCode from 'http-status-codes';
import { InputText } from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';


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
const ProductDetail=(props,ref)=>{
    const [product,setProduct]= useState('');
    const [errors,setErrors]=useState(DEFAULT_ERRORS_STATE);
    const [blog, setBlog] = useState('');
    const [categoryOptions,setCategoryOptions]=useState();
    const [categoryDropdownValue,setCategoryDropdownValue]=useState([]);
    const [detailDescription,setDetailDescription] = useState([]);
    const [album,setAlbum]=useState([]);
    //const [isAdminView,setIsAdminView]=useState(false);
    const [promotion,setPromotion] = useState(null);
    //const [availableQuantity,setAvailableQuantity] = useState();
    //const [isInitialize,setIsInitialize] = useState(false);
    
    const albumRef=useRef();
    const nameInput=useRef();
    const descriptionInput=useRef();
    const brandInput=useRef();
    const quantityInput=useRef();
    const priceInput=useRef();
    const formRef = useRef()
    const saveButtonRef = useRef();
    const testButtonRef = useRef();

    //const quantityCustomerInput=useRef();

    const _useHistory = useHistory();

    const {categories} = useSelector(state=>state);
    //const {_id}=useParams();

    const addErrors=(comp,errorMsg)=>{
        setErrors((prevData)=>{
            return {
                ...prevData,
                [comp]: errorMsg
            }
        })
    }
    const addDescriptionDetailFieldInput = () => {
        setDetailDescription(prevData=>{
            return [...prevData,{title:'',content: ''}]
        })
    }
    const removeDescriptionDetailFieldInput = (index) => {
        setDetailDescription(prevData=>{
            let updateData = [...prevData];
            updateData.splice(index,1);
            return updateData;
        })
    }
    // const onClickResetHandler =()=>{
    //     albumRef.current.clear();
    //     setAlbum(DEFAULT_ALBUM_STATE);
    //     setCategoryDropdownValue(DEFAULT_DROPDOWN_STATE);
    //     setBlog(DEFAULT_BLOG_STATE);
    //     setErrors(DEFAULT_ERRORS_STATE);        
    // }
    // const onClickDeleteHandler=async()=>{
    //     CustomConfirmDialog('Do you want to delete this project ?','Delete',deleteAction);
    // }
    // const onSwitchChangeHandler = (e)=>{
    //     setIsAdminView(e.value);
    //     if(!e.value) onClickResetHandler();
    // }
    // const deleteAction = async()=>{
    //     const data={_id:product._id};
    //     const res = await productService._delete(data);
    //     switch (res.status){
    //         case statusCode.OK:
    //             global.toast.show({severity:'success', summary: 'Delete product', detail: 'Successfully', life: 1500});
    //             props.onUpdate();
    //             _useHistory.replace('/');
    //             break;
    //         case statusCode.UNAUTHORIZED:
    //             _useHistory.replace('/signin');
    //             break;
    //         case statusCode.INTERNAL_SERVER_ERROR:
    //             global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
    //             break;
    //         default:
    //     }
    // }
    useImperativeHandle(ref,()=>({
        update: () => saveButtonRef.current.click(),
        reset: () =>  {
            formRef.current.reset();
            albumRef.current.clear();
            setAlbum(DEFAULT_ALBUM_STATE);
            setCategoryDropdownValue(DEFAULT_DROPDOWN_STATE);
            setBlog(DEFAULT_BLOG_STATE);
            setErrors(DEFAULT_ERRORS_STATE);
        }
    }));
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
    useEffect(()=>{                  
        // const product = allProducts.find((product=>product._id === props._id));
        // if(product){
        //     setProduct(product);
        //     let _detailDescription = [];
        //     product.detailDescription.forEach(des=>{
        //         _detailDescription.push(des);
        //     })
        //     setDetailDescription(_detailDescription);
        // } 
            const product = props.data;
            if(product){
                setProduct(product);
                let _detailDescription = [];
                product.detailDescription.forEach(des=>{
                    _detailDescription.push(des);
                })
                setDetailDescription(_detailDescription);
                setPromotion(props.data.promotion);
                setCategoryDropdownValue(product.category);
                setBlog(product.blog);
                setAlbum(product.album);
                setErrors(DEFAULT_ERRORS_STATE);
                //albumRef.current.clear();
                DEFAULT_ALBUM_STATE=product.album;
                DEFAULT_DROPDOWN_STATE=product.category;
                DEFAULT_BLOG_STATE=product.blog;
            }
    },[props.data]);
    const onSubmitHandler=async (e)=>{
        e.preventDefault();
        let submitAlbum = [];
        album.map(i=>(i.name)?submitAlbum.push(i.name):submitAlbum.push(i));
        let updateData={
            _id: product._id,
            name: nameInput.current.value,
            category: categoryDropdownValue,
            quantity: quantityInput.current.value,
            price: priceInput.current.value,
            description: descriptionInput.current.value,
            detailDescription: detailDescription.map(v=>JSON.stringify(v)),
            brand: brandInput.current.value,
            album: submitAlbum,
            promotion: promotion ? JSON.stringify(promotion) : undefined,
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
                    //setAlbum(resProduct.album);
                    setErrors(DEFAULT_ERRORS_STATE);
                    albumRef.current.clear();
                    DEFAULT_ALBUM_STATE=resProduct.album;
                    DEFAULT_DROPDOWN_STATE=resProduct.category;
                    DEFAULT_BLOG_STATE=resProduct.blog;
                    global.toast.show({severity:'success', summary: 'Update product', detail: 'Successfully', life: 1500});
                    //props.onUpdate(); 
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
    // const emptyView = ()=>{
    //     return (
    //         <div className="product-detail p-grid p-align-center vertical-container p-justify-center">
    //             <h1 className='p-col-12'>Product is not exist</h1>
    //             <Link className='p-col-12' to='/'><p>Back to shop</p></Link>
    //         </div>
    //     );
    // }
    return (
        // <React.Fragment>
        //     {/* {user.role === roles.ADMIN && <InputSwitch checked={isAdminView} onChange={onSwitchChangeHandler} style={{position:'absolute',top:'2vh',left:'2vw'}}/>}
        //     {isInitialize && isAdminView && !isEmpty(product) && adminView()} */}
        //     {/* {isInitialize && !isAdminView && !isEmpty(product) && customerView()} */}
        //     {/* {isInitialize && isEmpty(product) && emptyView()} */}
        // </React.Fragment>
        <React.Fragment>               
                <Form className="product-detail" onSubmit={onSubmitHandler} ref={formRef}>
                <div className="p-grid p-justify-center">     
                    <div className='p-col-8 p-grid p-jc-center'>
                        <div className='p-col-12 p-mt-6'>
                            <OrderImageList allowRemove onRemove={(item)=>setAlbum(album.filter(f=>f!==item))} items={album} onChange={setAlbum}/>
                            <Form.Text >
                                {errors.album.map((error,index)=>
                                    <p key={index}>{error}</p>
                                )}                            
                            </Form.Text>
                        </div>
                        <div className='p-col-12 p-mt-6'>
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
                            <Form.Label>Brand</Form.Label>
                            <Form.Control defaultValue={product.brand} ref={brandInput} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Promotion</Form.Label>
                            <Form.Group>
                                <Form.Label>Value (%)</Form.Label>
                                <InputNumber min={0} max={100} value={promotion? promotion.value : null} onChange={(e)=>setPromotion(prevData=>{return {...prevData,value:e.value}})}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start date</Form.Label>
                                <Calendar id="icon" value={promotion ? promotion.startDate : null} onChange={(e)=>setPromotion(prevData=>{return {...prevData,startDate:e.value}})} showIcon />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End date</Form.Label>
                                <Calendar id="icon" value={promotion ? promotion.endDate : null} onChange={(e)=>setPromotion(prevData=>{return {...prevData,endDate:e.value}})} showIcon />
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
                        <Form.Label>Detail Description</Form.Label>
                        
                            {
                                detailDescription.map((val,index)=>{
                                    return (
                                        <Form.Group key={index}>
                                            <InputText type="text" className="p-inputtext-sm block mb-2" placeholder='Input title' value={detailDescription[index].title} 
                                                onChange={e=>setDetailDescription(prevData=>{
                                                    let updateData = [...prevData];
                                                    updateData[index].title = e.target.value;
                                                    return updateData;
                                                })
                                            }/>
                                            <InputText type="text" className="p-inputtext-sm block mb-2" placeholder='Input content' value={detailDescription[index].content} 
                                                onChange={e=>setDetailDescription(prevData=>{
                                                    let updateData = [...prevData];
                                                    updateData[index].content = e.target.value;
                                                    return updateData;
                                                })
                                            }/>
                                            {/* <Button icon='pi pi-trash' className="p-button-warning" onClick={()=>removeDescriptionDetailFieldInput(index)} style={{}}/> */}
                                            <BSButton variant='warning' type='button' onClick={()=>removeDescriptionDetailFieldInput(index)}>Remove</BSButton>
                                        </Form.Group>
                                    )
                                })
                            }
                        <Form.Group>
                            <Button icon='pi pi-plus-circle' type='button' className="p-button-sm" label='Add' onClick={addDescriptionDetailFieldInput}/>
                        </Form.Group>
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
                        <Button type='submit' hidden ref={saveButtonRef}/>
                        {/* <Button type='submit' hidden onClick={()=>console.log('click')} ref={testButtonRef}/>
                        <Button type='button' onClick={()=>testButtonRef.current.click()} label='Click me'/>
                        <Button type='submit'  label='Save'/> */}
                        {/* <Button type='button' className='p-mr-4' onClick={onClickDeleteHandler} icon='pi pi-times' label='Delete'/> 
                        <Button type='reset' className='p-mr-4' onClick={onClickResetHandler} icon='pi pi-undo' label='Reset'/>
                        <BackButton/>                        */}
                    </div>
                    </div>               
                </Form>
                <div className="card">
               
                </div>
            </React.Fragment>
    );
 }

export default forwardRef(ProductDetail);