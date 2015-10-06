import React from 'react';
import Cell from './EditableCell';
import connectToStores  from 'alt/utils/connectToStores';
import RubricStore from '../stores/RubricStore';
import RubricActions from '../actions/RubricActions';
import uniqueId from  'uniqueid';
import Immutable from 'immutable';
import validator from 'validator';

@connectToStores
class Main extends React.Component {

  static getStores(){
    return [RubricStore];
  }

  static getPropsFromStores(){
    return RubricStore.getState();
  }

  componentDidMount(){
    RubricStore.listen(this.onChange.bind(this));
  }

  componentWillUnmount(){
    RubricStore.unlisten(this.onChange.bind(this));
  }

  onChange(state){
    this.setState(state, function(){
      this.refs['cell'+state.criteria.last().get('id')].focus();
    });
  }

  render() {
    var btnGroup;
    if(this.props.editMode == false) {
      btnGroup = <div className="btn-group pull-right">
        <a href="#" onClick={this.toggleEditMode.bind(this, true)} className="btn btn-default btn-sm">Edit</a>
      </div>;
    }
    else {
      btnGroup = <div className="pull-right">Editing...</div>
    }

    var deleteRowHeading;
    if(this.props.editMode == true) {
      deleteRowHeading = <th className="text-center"></th>
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {btnGroup}
          <h1 className="panel-title">Rubric</h1>
        </div>
        <table className="table table-bordered">
          <thead>
            <th className="text-center">Criteria</th>
            <th className="text-center">Description</th>
            <th className="text-center">Pts</th>
          </thead>
          <tbody>
            {this.props.criteria.map((c) => {
              return (
                <tr key={c.get('id')}>
                  <Cell
                    editMode={this.props.editMode}
                    ref={'cell'+c.get('id')}
                    editing={c.get('editing')}
                    keyName="name"
                    id={c.get('id')}
                    text={c.get('name')}
                    cellLength={4}
                  />
                  <Cell
                    editMode={this.props.editMode}
                    keyName="description"
                    id={c.get('id')}
                    text={c.get('description')}
                    cellLength={6}
                  />
                  <Cell
                    editMode={this.props.editMode}
                    keyName="points"
                    id={c.get('id')}
                    validator={validator.isNumeric}
                    text={c.get('points')}
                  />
                  {(()=>{
                    switch(this.props.editMode){
                      case true:
                        return(
                          <td>
                            <a onClick={this.removeCriteria.bind(this, c.get('id'))} href="#">
                              <span className="glyphicon glyphicon-remove"></span>
                            </a>
                          </td>
                        )
                      default:
                        return null;
                    }
                  })()}
                </tr>
              )
            })}
            <tr style={{marginTop:"0px", lineHeigh:"20px"}}>
              <td colSpan="4">
                {(()=>{
                  switch(this.props.editMode){
                    case true:
                      return(
                        <div style={{float:"left"}}>
                          <a onClick={this.addCriteria.bind(this, uniqueId({multiplier: 10}))} href="#"><i className="glyphicon glyphicon-plus"> </i>Add Criteria</a>
                        </div>
                      )
                    default:
                        return null
                  }
                })()}
                <div style={{float:"right"}}>
                  <span style={{paddingRight:"10px"}}>
                    Total Points: {RubricStore.getPointTotal()}
                  </span>
                </div>
              </td>
            </tr>
            {(()=> {
              switch(this.props.editMode){
                case true:
                  return (
                    <tr>
                      <td colSpan="3">
                        <div className="pull-left">
                          <a href="#" onClick={this.toggleEditMode.bind(this, false)} className="btn btn-default btn-sm">Cancel</a>
                        </div>
                        <div className="pull-right">
                          <a href="#" onClick={this.saveRubric.bind(this)} className="btn btn-success btn-sm">Save</a>
                        </div>
                      </td>
                    </tr>
                  )
              }
            })()}
          </tbody>
        </table>
      </div>
    )
  }

  toggleEditMode(toggle, e){
    e.preventDefault();
    RubricActions.toggleEditMode(toggle)
  }

  addCriteria(id, e){
    e.preventDefault();
    let criteria = Immutable.fromJS({
      id:id,
      editing:true,
      name:'Criteria name',
      description:'Description of criteria',
      points:10
    });
    RubricActions.addCriteria(criteria);
  }

  removeCriteria(id, e){
    e.preventDefault();
    RubricActions.removeCriteria(id);
  }

  saveRubric(){

  }

}
React.render(<Main/>, document.getElementById('rubric'));
