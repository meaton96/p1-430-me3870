import React from "react";

const EditableField = ({ label, value, type, onChange, labelSize = "is-flex-grow-2", readonly }) => (
    <div className="field is-horizontal">
        <div className={`field-label ${labelSize}`}>
            <label className="label">{label}</label>
        </div>
        <div className={`field-body`}>
            <div className="field">
                <div className="control">
                    <input
                        className="input"
                        type={type}
                        value={value}
                        onChange={onChange}
                        readOnly={readonly}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default EditableField;