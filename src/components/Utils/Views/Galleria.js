import React from 'react';
import {Galleria as GalleriaP} from 'primereact/galleria';
import {routeResource} from '../../Constant/ResourceConstant';
const Galleria = (props)=>{
    const itemTemplate = (item)=><img src={(item.objectURL?item.objectURL:routeResource.image+'/'+item)} alt='itemTemp' style={{ width: '100%',height: '45vh' }}/>;
    const thumbnailTemplate = (item) => <img src={(item.objectURL?item.objectURL:routeResource.image+'/'+item)} style={{width:'4vw',height:'4vw', marginRight:'1vh'}} alt='thumbnailTemplate'/>
    return (
        <GalleriaP value={props.items} numVisible={5} item={itemTemplate} thumbnail={thumbnailTemplate}/>
    );
};
export default Galleria;