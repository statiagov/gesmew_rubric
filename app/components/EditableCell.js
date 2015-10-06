import React from 'react';
import RubricActions from '../actions/RubricActions'
import validator from 'validator';

export default class EditableCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: this.props.editing,
      text: this.props.text
    }
  }

  static defaultProps = {
    cellLength:2,
    editing: false,
    validator: validator.isAlphanumeric
  }

  render(){

    var editLinkStyle = {
      float: "right",
      marginBottom:"10px"
    }

    var html;
    if (this.state.editing){
      html = <textarea ref="text_input" rows={this.props.cellLength > 2 ? "3" : null} defaultValue={this.state.text || ''} className="form-control" onFocus={this.handleFocus} type="text" onChange={this.onChange.bind(this)}></textarea>
    }else {
      html = this.props.text
    }

    return (
      <td height="50px" className={`col-md-${this.props.cellLength}`} onMouseOver={this.pencilShow.bind(this)} onMouseLeave={this.pencilHide.bind(this)} style={{padding:"20px"}}>
        {html}

        {(() => {
          switch (this.state.editing) {
            case true:
                return (
                  <div style={{marginTop:"5px"}} className="text-center">
                    <button ref="ok" onClick={this.updateCriteria.bind(this)} style={{marginRight:"3px"}} className="btn btn-primary btn-xs">Ok</button>
                    <button onClick={this.toggleEditing.bind(this, false)} className="btn btn-xs">Cancel</button>
                  </div>
                )
              break;
            default:
              return (
                <span ref="pencil" className="hidden"  style={editLinkStyle}>
                  <a href="#" onClick={this.toggleEditing.bind(this, true)}>
                    <i className="glyphicon glyphicon-pencil"></i>
                  </a>
                </span>
              )
        }
        })()}
      </td>
    )
  }

  pencilShow(e){
    e.preventDefault();
    if (this.state.editing == false && this.props.editMode == true) {
      this.refs.pencil.getDOMNode().className = null;
    }
  }

  pencilHide(e){
    e.preventDefault();
    if (this.state.editing == false) {
      this.refs.pencil.getDOMNode().className = 'hidden';
    }
  }

  onChange(event) {
    if (this.props.validator){
      if(this.props.validator(event.target.value)){
        this.refs.ok.getDOMNode().disabled = false;
        this.setState({text:event.target.value})
      }
      else {
        this.refs.ok.getDOMNode().disabled = true;
      }
    }

  }

  handleFocus(e) {
    e.target.select();
  }

  updateCriteria(){
    RubricActions.updateCriteria(
      {
        id:  this.props.id,
        text: this.state.text,
        keyName: this.props.keyName
      }
    )
    this.setState({editing:false})
  }

  focus(){
    if (this.state.editing == true) {
      this.refs.text_input.getDOMNode().focus();
    }
  }

  toggleEditing(toggled, e){
    e.preventDefault();
    this.setState({editing:toggled}, () =>{
      this.focus();
    });
  }
}
