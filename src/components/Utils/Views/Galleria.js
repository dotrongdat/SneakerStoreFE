import React from 'react';
import {Galleria as GalleriaP} from 'primereact/galleria';
import {routeResource} from '../../Constant/ResourceConstant';
const Galleria = (props)=>{
    const itemTemplate = (item)=><img src={(item.objectURL?item.objectURL:item)} alt='itemTemp' style={{ width: '100%',height: '45vh', borderRadius: '5px', borderColor: 'green', borderStyle:'solid', borderWidth: 'medium'}}/>;
    const thumbnailTemplate = (item) => <img src={(item.objectURL?item.objectURL:item)} style={{width:'3vw',height:'3vw', marginRight:'0.1vh',borderRadius: '5px', borderColor: 'white', borderStyle:'solid', borderWidth: 'thin'}} alt='thumbnailTemplate'/>
    return (
        <GalleriaP value={props.items} numVisible={5} item={itemTemplate} thumbnail={thumbnailTemplate}/>
    );
};
export default Galleria;