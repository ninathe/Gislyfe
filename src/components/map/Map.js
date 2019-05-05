import React, { Component } from 'react'
import './map.css'
import mapboxgl from 'mapbox-gl'
import roads from './veg.json';
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { updateLayers } from "../../actions";
import { Layer } from 'react-mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';


class Map extends Component{
  constructor(props) {
    super(props);
    this.state = {
      layersInMap: [],
      // lng: -80.00,
      // lat: 40.438,
      lng: 10.257952289845194, 
      lat: 63.41008738358773,
      zoom: 11
    };
  }


  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom
    });
    
    this._map = map;

    map.on('load', function () {
      this.addHeatmap();
    }.bind(this));

     map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

  }
  componentDidUpdate() {
    this.updateMapLayers()
  }

  updateMapLayers(props){
    this.deleteLayers();
    this.addLayers();    
  }

  deleteLayers(){
    for (let i = 0; i < this.state.layersInMap.length; i++) {
      if(this._map.getSource(this.state.layersInMap[i].id)){
        this._map.removeLayer(this.state.layersInMap[i].id)
        this._map.removeSource(this.state.layersInMap[i].id)
      }
      if(this._map.getSource(this.state.layersInMap[i].id+'_outline')){
        this._map.removeLayer(this.state.layersInMap[i].id + '_outline')
        this._map.removeSource(this.state.layersInMap[i].id + '_outline')
      }

    }
  }

  addLayers(){
    for (let i = 0; i < this.props.layers.length; i++) {
      this.addLayerByType(this.props.layers[i]);
    }
    this.state.layersInMap = this.props.layers;
  }

  addLayerByType(layer){
    switch (layer.features[0].geometry.type) {
      case 'Polygon':
        this.addPolygonLayer(layer);
        break;
      case 'MultiPolygon':
        this.addPolygonLayer(layer);
        break;
      case 'MultiLineString':
        this.addLineLayer(layer);
        break;
      case 'Point':
        this.addPointLayer(layer);
        break;
      default:
        console.log('Unidentified layer type!!' + layer.type);
        
    }
  }

  addPointLayer(layer) {
    this._map.addLayer({
      'id': layer.id,
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': layer
      },
      'layout': {'visibility': layer.visible },
      'paint': {
        'circle-radius': 5,
        'circle-color': layer.fillColor,
        'circle-opacity': 1
      }
    });
  }


  addLineLayer(layer) {
    let map = this._map
    map.addLayer({
      'id': layer.name,
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': layer
      },
      'layout': {'visibility': layer.visible },
      'paint': {
        'line-color': layer.borderColor,
        'line-opacity': 1,
        'line-width': 2
      }
    });

  }


  addPolygonLayer(layer) {
    let map = this._map

    map.addLayer({
      'id': layer.id,
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': layer
      },
      'layout': {'visibility': layer.visible },
      'paint': {
        'fill-color': layer.fillColor,
        'fill-opacity': 1
      }
    });

    map.addLayer({
      'id': layer.id + '_outline',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': layer
      },
      'layout': {'visibility': layer.visible },
      'paint': {
        'line-color': layer.borderColor,
        'line-opacity': 1 ,
        'line-width': 1
      }
    });
  }


  addHeatmap(){
    let map = this._map

    map.addSource('trees', {
      type: 'vector',
      url: 'mapbox://ninath93.5kp4zadi'
    });

    map.addLayer({
      id: 'trees-heat',
      "source-layer": "trees-dhgc50",
      type: 'heatmap',
      source: 'trees',
      maxzoom: 15,
      paint: {
        // increase weight as diameter breast height increases
        'heatmap-weight': {
          property: 'dbh',
          type: 'exponential',
          stops: [
            [1, 0],
            [62, 1]
          ]
        },
        // increase intensity as zoom level increases
        'heatmap-intensity': {
          stops: [
            [11, 1],
            [15, 3]
          ]
        },
        // assign color values be applied to points depending on their density
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(236,222,239,0)',
          0.2, 'rgb(208,209,230)',
          0.4, 'rgb(166,189,219)',
          0.6, 'rgb(103,169,207)',
          0.8, 'rgb(28,144,153)'
        ],
        // increase radius as zoom increases
        'heatmap-radius': {
          stops: [
            [11, 15],
            [15, 20]
          ]
        },
        // decrease opacity to transition into the circle layer
        'heatmap-opacity': {
          default: 1,
          stops: [
            [14, 1],
            [15, 0]
          ]
        },
      }
    }, 'waterway-label');
    map.addLayer({
      id: 'trees-point',
      type: 'circle',
      source: 'trees',
      "source-layer": "trees-dhgc50",
      minzoom: 14,
      paint: {
        // increase the radius of the circle as the zoom level and dbh value increases
        'circle-radius': {
          property: 'dbh',
          type: 'exponential',
          stops: [
            [{ zoom: 15, value: 1 }, 5],
            [{ zoom: 15, value: 62 }, 10],
            [{ zoom: 22, value: 1 }, 20],
            [{ zoom: 22, value: 62 }, 50],
          ]
        },
        'circle-color': {
          property: 'dbh',
          type: 'exponential',
          stops: [
            [0, 'rgba(236,222,239,0)'],
            [10, 'rgb(236,222,239)'],
            [20, 'rgb(208,209,230)'],
            [30, 'rgb(166,189,219)'],
            [40, 'rgb(103,169,207)'],
            [50, 'rgb(28,144,153)'],
            [60, 'rgb(1,108,89)']
          ]
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': {
          stops: [
            [14, 0],
            [15, 1]
          ]
        }
      }
    }, 'waterway-label');

    map.on('click', 'trees-point', function(e) {
      new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML('<b>DBH:</b> ' + e.features[0].properties.dbh)
        .addTo(map);
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
        <div className="map" ref={el => this.mapContainer = el} />
    );
  }
}


Map.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    visible: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired
  }).isRequired).isRequired,
}


const mapStateToProps = (state) => ({
  layers: state.layers
});

const mapDispatchToProps = {
  updateLayers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);