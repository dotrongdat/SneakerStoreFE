import React,{useRef,useEffect,useState} from 'react';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Badge} from 'primereact/badge';
import {DataScroller} from 'primereact/datascroller';
import {Skeleton} from 'primereact/skeleton';
import {useHistory} from 'react-router-dom';
import {notificationStatus,notificationType} from '../../Constant/NotificationConstant';
import notificationService from '../../../service/notification.service';
import statusCode from 'http-status-codes';
import { isEmpty } from 'lodash';
import moment from 'moment';
import './Notification.css';

const Notification = () =>{
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [totalUnread,setTotalUnread] = useState(0);
    //const [totalAdd, setTotalAdd] = useState(0);
    //const [from,setFrom] = useState(0);
    
    const loadingRef = useRef(false);    
    const overlayPanelRef = useRef();
    
    const _useHistory = useHistory();
    
    const itemTemplate =  (item,option)=>{
        let content;
        content = (item) ? JSON.parse(item.content) : null;
        const onClickHandler = ()=>{
            overlayPanelRef.current.hide();
            item.status === notificationStatus.UN_READ && makeReadNotification(item._id);
            switch (item.type){
                case notificationType.MESSAGE:
                    global.toast.show({severity:'info', summary: 'Order', detail: 'Your order are approved', life: 1500});
                    break;
                case notificationType.ORDER_REQUEST:
                    _useHistory.push(`/order/${content.order_id}`);
                    break;
                default:
            }
        }
        return (
                <div  style={{height:'auto',minHeight:'10vh',cursor:'pointer'}}>
                {item && <div onClick={onClickHandler} className={item.status === notificationStatus.UN_READ ? 'unread':'read'} >
                    <p style={{fontSize:'70%'}}>{moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    <div className='p-grid p-justify-start'>
                        <i className='pi pi-exclamation-circle p-text-secondary  p-col-1'/>
                        <p className='p-col-11 p-text-secondary p-text-bold'>{content.message}</p>
                    </div>                   
                </div>}
                {!item && <Skeleton style={{padding:'1vh'}} shape='rectangle' width='25vw' height='5vh'></Skeleton>}
                </div>
        );
    }

    const loadingTemplate = ()=>{
        return (
            <div>
                <Skeleton style={{padding:'1vh'}} shape='rectangle' width='28vw' height='5vh'></Skeleton>
                <Skeleton shape='rectangle' width='28vw' height='5vh'></Skeleton>
            </div>
        );
    }
    const loading = (bool)=>{
        bool ? setData(prevData => prevData.concat(Array.from({length:2}))) : setData(prevData=>prevData.filter(i=> !isEmpty(i)));
    }
    const onLazyLoadHandler = (e)=>{ 
        let {first,rows} = e;
        if(first>0 && !loadingRef.current){
            if(data.length<total){ 
                loading(true);
                loadingRef.current=true;
                setTimeout(async()=>{
                    await getNotification(data.length);
                    loading(false);
                    loadingRef.current=false;
                },2000); 
            }
        }else setData((prevData)=>[].concat(prevData))                 
    }
    const makeReadNotification = (_id)=>{
        notificationService.markRead({_id});
        setTotalUnread(prevData=> (prevData>0)?prevData-1:prevData);
        setData(prevData=>{
            let index = prevData.findIndex(i=>i._id===_id);
            let _data = prevData;
            _data[index] = {..._data[index],status: notificationStatus.READ};
            return _data;
        })
    }
    const getNotification = async (from=0,itemPerPage=6)=>{
        const res = await notificationService.get({from,itemPerPage});
        switch (res.status){
            case statusCode.OK:
                const {notification,total,totalUnread} = res.data.payload;
                setTotal(total);
                setTotalUnread(totalUnread);
                setData((prevData)=>prevData.concat(notification));
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                break;
            default:
        }
    }
    useEffect(()=>{
        getNotification();
        global.socket.on('notification',(notification)=>{
            setData((prevData)=> [notification,...prevData]);
            setTotal(prevData=>prevData+1);
            setTotalUnread(prevData=>prevData+1);
            switch (notification.type){
                case notificationType.ORDER_REQUEST:
                    global.toast.show({severity:'info', summary: 'Message', detail: JSON.parse(notification.content).message, sticky: true});
                    break;
                case notificationType.MESSAGE:
                    global.toast.show({severity:'info', summary: 'Message', detail: JSON.parse(notification.content).message, life: 1500});
                    break;
                default:
            }
        })
        return ()=>global.socket.off('notification');
    },[]);
    return (
        <div>
            <i className="pi pi-bell p-mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem',cursor:'pointer' }} onClick={e=>overlayPanelRef.current.toggle(e)}>{totalUnread>0 && <Badge value={totalUnread} severity="danger"></Badge>}</i>
            <OverlayPanel ref={overlayPanelRef} style={{width:'30vw'}}>
                <DataScroller  value={data} itemTemplate={itemTemplate} loadingTemplate={loadingTemplate} showLoader rows={6}  inline scrollHeight="60vh" lazy onLazyLoad={onLazyLoadHandler}/>
            </OverlayPanel>
        </div>
    );
}

export default Notification;