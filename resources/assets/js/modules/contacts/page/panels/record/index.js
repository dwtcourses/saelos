import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getContact, getCustomFieldsForContacts } from '../../../store/selectors';
import { fetchContact, saveContact } from '../../../service';
import _ from 'lodash';
import * as MDIcons from 'react-icons/lib/md'

class Record extends React.Component {
  constructor(props) {
    super(props)

    this._toggleEdit = this._toggleEdit.bind(this)
    this._submit = this._submit.bind(this)

    this.state = {
      inEdit: false,
      formState: Object.assign({}, props.contact)
    }
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.dispatch(fetchContact(this.props.match.params.id))
    }
  }

  _toggleEdit() {
    this.setState({inEdit: !this.state.inEdit})
  }

  _submit() {
    this.props.dispatch(saveContact(this.state.formState))

    this.setState({inEdit: false})
  }

  render() {
    const { contact } = this.props;
    const groups = _.groupBy(this.props.customFields, 'group');
    const inEdit = this.state.inEdit;
    const contactFields = Object.keys(groups).map(key => (
      <div className="card mb-1" key={key}>
        <ul className="list-group list-group-flush">
          <li key={key} className="list-group-item">
            <div className="mini-text text-muted">{key}</div>
            {groups[key].map(f => {
              let fieldValue = _.get(this.state.formState, f.alias);

              if (typeof fieldValue === 'object') {
                fieldValue = _.get(fieldValue, 'name');
              }

              const hidden = typeof fieldValue === 'undefined' || fieldValue.length === 0 ? 'd-none' : '';
              const readOnly = !inEdit ? {
                readOnly: true,
                className: 'form-control-plaintext'
              } : {
                readOnly: false,
                className: 'form-control'
              }

              return (
                <div className={`form-group row ${hidden}`} key={f.alias}>
                  <label htmlFor={f.alias} className="col-sm-3 col-form-label">{f.label}</label>
                  <div className="col-sm-9">
                    <input type="text" {...readOnly} id={f.alias} name={f.alias} value={fieldValue} />
                  </div>
                </div>
              )
            })
          }
          </li>
        </ul>
      </div>
    ));

    return (
      <main key={0} className="col main-panel px-3">
        <div className="toolbar border-bottom py-2 heading">
          <button type="button" className="btn btn-default mr-2">1</button>
          <button type="button" className="btn btn-default mr-2">2</button>
          <button type="button" className="btn btn-default mr-2">3</button>
          <button type="button" className="btn btn-default mr-2">4</button>
          <button type="button" className="btn btn-default mr-2">5</button>
          <div className="float-right text-right">
            <div className="mini-text text-muted">Assigned To</div>
            <div className="text-dark mini-text"><b>{contact.user.name}</b></div>
          </div>
        </div>
        {inEdit ?
          <span className="float-right">
            <span onClick={this._toggleEdit}>Cancel</span>
            <span className="btn btn-success" onClick={this._submit}>Save</span>
          </span>
          :
          <span className="float-right">
            <span className="btn btn-primary" onClick={this._toggleEdit}>Edit</span>
          </span>
        }
        <h3 className="border-bottom py-2">
          {contact.firstName} {contact.lastName}
        </h3>

        <div className="h-scroll">
          {contactFields}
        </div>
      </main>
    )
  }
}

Record.propTypes = {
  contact: PropTypes.object.isRequired
}

export default withRouter(connect((state, ownProps) => ({
  contact: getContact(state, ownProps.match.params.id),
  customFields: getCustomFieldsForContacts(state)
}))(Record))