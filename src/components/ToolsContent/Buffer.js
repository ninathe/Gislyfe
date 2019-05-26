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
// import IconButton from '@material-ui/core/IconButton';
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

class ToolsPopup extends Component{
  constructor(props) {
    super(props);
  
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  updateText = name => event => {
    this.setState({ [name]: event.target.value });
  };

  doSomething(){
    debugger
    if(this.state != null && this.state.layer && this.state.bufferVal){
      let geom = this.props.layers.filter(layer => layer.id == this.state.layer)[0];
      let buffer = turf.buffer(geom, this.state.bufferVal, {units: 'meters'});      //Buffer geojson
      let bufferName = geom.name + "_Buffer"
      this.props.addLayer(formatJson(buffer,bufferName, true, 0.5))                 //formatJson buffer-geojson, name, noBorder, fill-opacity
    } else{
      alert("Velg layer og bufferverdi")
    }
   
  }


  render() {
    const actions = [
        <Button
          primary={true}
          form="myform"
          onClick={this.doSomething.bind(this)}
          >SUBMIT
          </Button>,
      ];

    return (
      <React.Fragment>
    {this.props.layers.length>0?
      <form className={this.props.classes.container} autoComplete="off" id = "myform">
      
        <TextField
          id="standard-name"
          label="Buffer"
          className={this.props.classes.textField}
          onChange={this.updateText('bufferVal')}
          margin="normal"
          helperText="Buffer in meter"

        />
        
        <TextField
          id="standard-select-currency"
          select
          label="Layer"
          className={this.props.classes.textField}
          onChange={this.handleChange('layer')}
          SelectProps={{
            MenuProps: {
              className: this.props.classes.menu,
            },
          }}
          helperText="Select layer"
          margin="normal"
        >
          {this.props.layers.map(layer => (
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


const mapStateToProps = (state) => ({
  layers: state.layers
});

const mapDispatchToProps = {
  addLayer
};

// const mapDispatchToProps ={
//   updateLayerVisibility,
//   updateLayerFill,
//   updateLayerBorder, 
//   updateLayerName,
//   deleteLayer
// };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ToolsPopup));
// export default connect()(Filedrop);