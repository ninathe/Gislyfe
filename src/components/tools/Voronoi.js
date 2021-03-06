import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { updateLayers } from "../../actions";
import { withStyles } from '@material-ui/core/styles';
import { TextField, Typography, IconButton, Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import InfoIcon from '@material-ui/icons/Info';
import * as turf from '@turf/turf'
import { addLayer } from '../../actions'
import formatJson from '../utils';


  const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  });

class DifferenceContent extends Component{
  constructor(props) {
    super(props);
    this.state = {
        layer: null
    }
  }

  // Changehandler - layerselect 
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitDifference(){
    if(this.state.layer == null ){
      alert("Velg et lag til å lage voronoi")
    } 
    else{
      // layer.features[0].geometry.type == "Point"
      let geom = this.props.layers.filter(layer => layer.id == this.state.layer)[0];
      // var options = {
      //   bbox: [-70, 40, -60, 60]
      // };
      // var points = turf.randomPoint(100, options);
      debugger
      var voronoiPolygons = turf.voronoi(geom);
      let name = geom.name+"_voronoi";
      // let geom1 = this.props.layers.filter(layer => layer.id == this.state.layer1)[0].features[0];
      // let difference = turf.difference(geom1, geom2);      //Difference geojson
      // let differenceName = geom1.properties.name+"_"+geom2.properties.name + "_Difference"
      this.props.addLayer(formatJson(voronoiPolygons,name, true, 0.5))    //formatJson difference-geojson, name, noBorder, fill-opacity
      this.props.close();
    } 
   
  }


  render() {
    const actions = [
        <Button
          primary={true}
          form="myform"
          onClick={this.submitDifference.bind(this)}
          >SUBMIT
          </Button>,
      ];

    return (
    <React.Fragment>
    {this.props.layers.length>0?
      <form className={this.props.classes.container} autoComplete="off" id = "myform">
        <TextField
          id="layer1-select"
          select
          label="Layer 1"
          className={this.props.classes.textField}
          value = {this.state.layer1}
          onChange={this.handleChange('layer')}
          SelectProps={{
            MenuProps: {
              className: this.props.classes.menu,
            },
          }}
          helperText="Select layer"
          margin="normal"
        >
          {this.props.layers
          .filter(layer =>{return layer.features[0].geometry.type == "Point"})
          .map(layer => (  
            <MenuItem key={layer.id} value={layer.id}>
              {layer.name}
            </MenuItem>
          ))}
        </TextField>
        
        <div>
            {actions} 
        </div> 
        
      </form>
    :
        <React.Fragment>
            <IconButton>
                <InfoIcon />
            </IconButton>
            <Typography variant="h7" color="inherit">
                Add layers in map. 
            </Typography>
        </React.Fragment>
    }   
    </React.Fragment>
      
    );
  }
}


//REDUX

const mapStateToProps = (state) => ({
  layers: state.layers
});

const mapDispatchToProps = {
  addLayer
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DifferenceContent));