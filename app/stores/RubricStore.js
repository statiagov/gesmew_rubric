var alt = require('../alt');
var RubricActions = require('../actions/RubricActions');
var _ = require('lodash')
var Immutable = require('immutable');
var ImmutableStore = require('alt/utils/ImmutableUtil');

class RubricStore {
  constructor(){
    this.state = {
      editMode:false,
      criteria: Immutable.fromJS([
        {id:1, name:'Mold', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.", points:9.5},
        {id:2, name:'Floor', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.", points:5},
        {id:3, name:'Some other criteria', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.", points:5},
      ])
    }
    this.bindListeners({
      handleAddCriteria: RubricActions.ADD_CRITERIA,
      handleUpdateCriteria: RubricActions.UPDATE_CRITERIA,
      handleRemoveCriteria: RubricActions.REMOVE_CRITERIA,
      handleToggleEditMode: RubricActions.TOGGLE_EDIT_MODE
    });
  }

  static getPointTotal() {
    let arr = []
    this.state.criteria.map((c, index) =>{
      arr.push(c.get('points'));
    });
    return _.sum(arr);
  }

  handleAddCriteria(criterion){
    this.setState({
      criteria:this.state.criteria.push(criterion)
    });
  }

  handleUpdateCriteria(criterion){
    let criteriaIndex =  this.state.criteria.findIndex((s) => s.get('id') === criterion.id);
    this.setState({
      criteria: this.state.criteria.update(criteriaIndex,
        (item) => {
          return item.set(criterion.keyName, criterion.text);
        })
    })
  }

  handleRemoveCriteria(id){
    if(this.state.criteria.size > 3) {
      let criteriaIndex =  this.state.criteria.findIndex((s) => s.get('id') === id);
      this.setState({
        criteria: this.state.criteria.delete(criteriaIndex)
      })
    }else {
      alert("A rubric needs at least three criteria")
    }
  }

  handleToggleEditMode(condition){
    this.state.editMode = condition;
  }
}
module.exports = alt.createStore(ImmutableStore(RubricStore));
