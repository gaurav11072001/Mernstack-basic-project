import React, { useState } from 'react';

const ItemForm = ({ addItem, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [validation, setValidation] = useState({
    name: { valid: true, message: '' }
  });

  const { name, description } = formData;

  const validateField = (name, value) => {
    if (name === 'name') {
      if (!value.trim()) {
        return { valid: false, message: 'Item name is required' };
      }
      if (value.trim().length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters' };
      }
    }
    return { valid: true, message: '' };
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change
    if (name === 'name') {
      setValidation({
        ...validation,
        [name]: validateField(name, value)
      });
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    
    // Validate before submission
    const nameValidation = validateField('name', name);
    setValidation({ ...validation, name: nameValidation });
    
    if (!nameValidation.valid) {
      return;
    }
    
    addItem(formData);
    
    // Clear form
    setFormData({
      name: '',
      description: ''
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Item
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${!validation.name.valid ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter item name"
              disabled={isLoading}
            />
            {!validation.name.valid && (
              <div className="invalid-feedback">
                {validation.name.message}
              </div>
            )}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="description" className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Enter item description (optional)"
              rows="4"
              disabled={isLoading}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading || !validation.name.valid}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-plus-lg me-2"></i>
                Add Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
