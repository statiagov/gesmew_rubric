var alt = require('../alt');

class RubricActions {
  addCriteria(criteria) {
    this.dispatch(criteria);
  }

  updateCriteria(obj) {
    this.dispatch(obj);
  }

  removeCriteria(id){
    this.dispatch(id);
  }

  toggleEditMode(codition){
    this.dispatch(codition)
  }
}

module.exports = alt.createActions(RubricActions);
