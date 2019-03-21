import React, {Component} from 'react';
import {DropzoneArea} from 'material-ui-dropzone';
import { connect } from 'react-redux'
import { addLayer, removeLayer } from '../actions'
import '../App.css'



const Filedrop = ({dispatch}) => {
  let layers = 0;

  function setupReader(file) {
    readFile(file, function (json) {
      dispatch(addLayer(json))
    });
  }

  function readFile(file, callback){
    let reader = new FileReader();

    reader.onload = function(e){
      try{
        let json = JSON.parse(e.target.result)
        callback(formatJson(json));
      } catch(ex){
        alert('ex when trying to parse json = ' + ex);
      }
    }

    reader.readAsText(file);
  }

  function formatJson(json){
    if(!json.name)
      json.name = "Layer"
    if(!json.visible)
      json.visible = "visible"
    if(!json.id)
      json.id = "layer-"+layers;
    if(!json.fillColor)
      json.fillColor = "red"
    if(!json.borderColor)
      json.borderColor = "black"
    layers++;
    return json
  }

  function deleteLayer(file){
    readFile(file, function (json) {
      dispatch(removeLayer(json))
    });
  }



  return (
    <DropzoneArea 
        dropzoneText={"Drop Json-files here"} 
        filesLimit={4}
        dropZoneClass={"HalloKlasse"}
        dropzoneParagraphClass={"TekstDrop"}
        acceptedFiles= {['application/json/*']} 
        onDrop={setupReader}
        onDelete={deleteLayer}
        showPreviewsInDropzone={false}
        />
  )
}
 
export default connect()(Filedrop);