
import * as yup from 'yup';

// Before submitting any forms we want to verify that user has filled out all things required before submitting.

const schema = yup.object().shape({
    first_name: yup
        .string() // first-name property should be a string method
        .trim()
        .required('First name is required') // first-name is mandatory
        .min(3, 'First name must be at least 3 characters long'),
    last_name: yup
        .string() // lst-name property should be a string method
        .trim()
        .required('Last name is required') // last-name is mandatory
        .min(5, 'Last name must be at least 5 characters long'),
    email: yup
        .string() // email should be a string method
        .trim()
        .email('Must be a valid email address')
        .required('Email is required'), // email is mandatory
    terms: yup
        .boolean() // terms should be a boolean method
        .required('Please read the Terms of Service')
        .oneOf([true], 'Terms of Services must be accepted')
});

export default schema;
