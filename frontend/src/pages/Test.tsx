import { useState } from "react";

import "./FormStyles.css"; // We'll create this for styling

const Test = () => {
  const [formData, setFormData] = useState({
    text: "",
    password: "",
    email: "",
    search: "",
    url: "",
    tel: "",
    // Numeric inputs
    number: "",
    range: 50,
    // Date and time inputs
    date: "",
    month: "",
    week: "",
    time: "",
    datetimeLocal: "",
    // Selection inputs
    checkbox: false,
    radio: "",
    select: "",
    multiSelect: [],
    // File input
    file: null,
    // Other inputs
    color: "#000000",
    hidden: "hidden-value",
    image: null,
    // Button type (no state needed)
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle different input types
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    } else if (type === "select-multiple") {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData((prevState) => ({
        ...prevState,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleReset = () => {
    setFormData({
      text: "",
      password: "",
      email: "",
      search: "",
      url: "",
      tel: "",
      number: "",
      range: 50,
      date: "",
      month: "",
      week: "",
      time: "",
      datetimeLocal: "",
      checkbox: false,
      radio: "",
      select: "",
      multiSelect: [],
      file: null,
      color: "#000000",
      hidden: "hidden-value",
    });
    setErrors({});
    setSubmittedData(null);
  };
  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (email.length > 254) {
      newErrors.email = "Email is too long";
    } else if (/\s/.test(email)) {
      newErrors.email = "Email cannot contain spaces";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }
    // URL validation
    if (formData.url && !/^https?:\/\/.+\..+/.test(formData.url)) {
      newErrors.url =
        "Please enter a valid URL starting with http:// or https://";
    }

    // Phone validation
    if (formData.tel && !/^[\d\s\-+]+$/.test(formData.tel)) {
      newErrors.tel = "Please enter a valid phone number";
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmittedData(formData);
      console.log("Form submitted:", formData);
    } else {
      console.log("Form has validation errors");
    }
  };
  return (
    <div className="comprehensive-form-container">
      <h1>React Form - All Input Types</h1>

      <form onSubmit={handleSubmit} className="comprehensive-form">
        {/* Text Input Types */}
        <div className="form-section">
          <h2>Text Inputs</h2>

          <div className="form-group">
            <label htmlFor="text">Text:</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter text"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="search">Search:</label>
            <input
              type="search"
              id="search"
              name="search"
              value={formData.search}
              onChange={handleChange}
              placeholder="Search..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL:</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className={errors.url ? "input-error" : ""}
            />
            {errors.url && <span className="error-message">{errors.url}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tel">Telephone:</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className={errors.tel ? "input-error" : ""}
            />
            {errors.tel && <span className="error-message">{errors.tel}</span>}
          </div>
        </div>

        {/* Numeric Inputs */}
        <div className="form-section">
          <h2>Numeric Inputs</h2>

          <div className="form-group">
            <label htmlFor="number">Number:</label>
            <input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              placeholder="Enter a number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="range">
              Range (Current value: {formData.range}):
            </label>
            <input
              type="range"
              id="range"
              name="range"
              value={formData.range}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>

        {/* Date and Time Inputs */}
        <div className="form-section">
          <h2>Date and Time Inputs</h2>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="month">Month:</label>
            <input
              type="month"
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="week">Week:</label>
            <input
              type="week"
              id="week"
              name="week"
              value={formData.week}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="datetimeLocal">Date and Time (Local):</label>
            <input
              type="datetime-local"
              id="datetimeLocal"
              name="datetimeLocal"
              value={formData.datetimeLocal}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Selection Inputs */}
        <div className="form-section">
          <h2>Selection Inputs</h2>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="checkbox"
                checked={formData.checkbox}
                onChange={handleChange}
              />
              Checkbox (Checked: {formData.checkbox ? "Yes" : "No"})
            </label>
          </div>

          <div className="form-group">
            <label>Radio Buttons:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="radio"
                  value="option1"
                  checked={formData.radio === "option1"}
                  onChange={handleChange}
                />
                Option 1
              </label>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value="option2"
                  checked={formData.radio === "option2"}
                  onChange={handleChange}
                />
                Option 2
              </label>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value="option3"
                  checked={formData.radio === "option3"}
                  onChange={handleChange}
                />
                Option 3
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="select">Single Select:</label>
            <select
              id="select"
              name="select"
              value={formData.select}
              onChange={handleChange}
            >
              <option value="">-- Please select --</option>
              <option value="select1">Selection 1</option>
              <option value="select2">Selection 2</option>
              <option value="select3">Selection 3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="multiSelect">
              Multiple Select (Hold Ctrl/Cmd):
            </label>
            <select
              id="multiSelect"
              name="multiSelect"
              multiple
              value={formData.multiSelect}
              onChange={handleChange}
              size="3"
            >
              <option value="multi1">Multiple 1</option>
              <option value="multi2">Multiple 2</option>
              <option value="multi3">Multiple 3</option>
              <option value="multi4">Multiple 4</option>
            </select>
          </div>
        </div>

        {/* File Input */}
        <div className="form-section">
          <h2>File Input</h2>

          <div className="form-group">
            <label htmlFor="file">Choose File:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            {formData.file && (
              <div className="file-info">
                Selected: {formData.file.name} (
                {(formData.file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>
        </div>

        {/* Other Inputs */}
        <div className="form-section">
          <h2>Other Inputs</h2>

          <div className="form-group">
            <label htmlFor="color">Color Picker:</label>
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <span
              className="color-preview"
              style={{ backgroundColor: formData.color }}
            >
              {formData.color}
            </span>
          </div>

          <input type="hidden" name="hidden" value={formData.hidden} />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Submit Form
          </button>
          <button type="reset" className="btn-reset" onClick={handleReset}>
            Reset Form
          </button>
          <button
            type="button"
            className="btn-button"
            onClick={() => alert("Button clicked!")}
          >
            Simple Button
          </button>
        </div>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <div className="submitted-data">
          <h2>Submitted Data:</h2>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
export default Test;
