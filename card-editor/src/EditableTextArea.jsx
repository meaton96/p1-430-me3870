import React from "react";

const EditableTextArea = ({ label, value, onChange }) => (
    <div className="field is-horizontal">
        <div className="field-label is-normal">
            <label className="label">{label}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <div className="control">
                    <textarea
                        className="textarea"
                        value={value}
                        onChange={onChange}
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
);

export default EditableTextArea;