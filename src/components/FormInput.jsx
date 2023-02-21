import { Form } from "react-bootstrap";
import "./FormInput.css";

const FormInput = ({
    className,
    name,
    icon,
    type,
    placeholder,
    onChange,
    onBlur,
    readOnly,
    required,
    value,
    disabled,
    touched = "",
    errors = ""
}) => {
    return (
        <Form.Group className={['position-relative ' + className]}>
            <i className={icon}></i>
            <Form.Control 
                type={type}
                name={name} 
                placeholder={placeholder} 
                readOnly={readOnly}
                required={required}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                value={value}
                isInvalid={!!errors[name]}
            />
            <Form.Control.Feedback type="invalid">
                {errors[name]}
            </Form.Control.Feedback>

        </Form.Group>
    )
}

export default FormInput;