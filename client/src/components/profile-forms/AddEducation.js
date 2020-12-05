import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';
const AddEducation = ({ addEducation, history }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
    document.documentElement.scrollTop = 0;
  };

  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    typeofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });
  const {
    school,
    degree,
    typeofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [toDisplay, toggleToDisplay] = useState(true);

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-graduation-cap'></i> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            value={school}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            value={degree}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field Of Study'
            name='typeofstudy'
            value={typeofstudy}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              value={current}
              checked={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleToDisplay(!toDisplay);
              }}
              name='current'
              value=''
            />{' '}
            Current School or Bootcamp
          </p>
        </div>
        <div
          className='form-group'
          style={toDisplay ? null : { display: 'none' }}
        >
          <h4>To Date</h4>
          <input
            type='date'
            value={to}
            disabled={toDisplay ? '' : 'disabled'}
            onChange={(e) => onChange(e)}
            name='to'
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            value={description}
            onChange={(e) => onChange(e)}
            placeholder='Program Description'
          ></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <a className='btn btn-light my-1' href='dashboard.html'>
          Go Back
        </a>
      </form>
    </Fragment>
  );
};
AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
