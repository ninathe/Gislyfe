import styled from "styled-components";
import React, {Component} from 'react';
import MapContainer from './map/Map'
import Navbar from './RDrawer';
import Tools from './ToolsPopup';


const MapWrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  align-items: stretch;
`;

class MapWrapper extends Component{
  constructor(props){
    super(props);
    this.state = {
      receivedJson: this.props.receivedJson,
      layers: [],
    };
  }

  updateMapLayers(layers){
    this.setState({ layers: layers });
  }

  render() {
    return (
      <div>
        <Navbar updateMapLayers={this.updateMapLayers.bind(this)}/>
        <MapWrapperDiv>
          <MapContainer />
        </MapWrapperDiv> 
        <Tools />
      </div> 
    );
  }
}


export default MapWrapper;