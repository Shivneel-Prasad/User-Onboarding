import React, { useState, useEffect } from "react";
import User from "./Components/UserLists";
import UserForms from "./Components/UserForms";
import schema from "./Components/FormSchema";
import axios from "axios";
import * as yup from 'yup';

//////////////// INITIAL STATES ////////////////
const initialFormValues = {
  /////// TEXT INPUTS ///////
  first_name: '',
  lst_name: '',
  email: '',
  /////// CHECKBOXES ///////
  terms: false,
}

const initialFormErrors = {
  first_name: '',
  last_name: '',
  email: '',
  terms: false
};

const initialUsers = []
const initialDisabled = true;

export default function App() {
  //////////////// STATES ////////////////
  const [users, setUsers] = useState(initialUsers); // array of user objects
  const [formValues, setFormValues] = useState(initialFormValues) // object
  const [formErrors, setFormErrors] = useState(initialFormErrors) // object
  const [disabled, setDisabled] = useState(initialDisabled)       // boolean

  //////////////// HELPERS ////////////////
  const getUsers = () => {
// 🔥 IMPLEMENT! ON SUCCESS PUT FRIENDS IN STATE
//    helper to [GET] all users from `https://reqres.in/api/users`
    axios.get('https://reqres.in/api/users')
      .then(results => {
        console.log('AXIOS GET:', results.data.data);
        setUsers(results.data.data);
      }).catch(err => console.error(err));
  };

  const postNewUser = newUser => {
// 🔥 IMPLEMENT! ON SUCCESS ADD NEWLY CREATED FRIEND TO STATE
//    and regardless of success or failure, the form should reset
    axios.post('https://reqres.in/api/users', newUser)
      .then(results => {
        setUsers([results.data, ...users]);
        setFormValues(initialFormValues);
      }).catch(err => console.error(err));
      setFormValues(initialFormValues);
  };  

  //////////////// EVENT HANDLERS ////////////////
  const validate = (name, value) => {
    yup.reach(schema, name)
      .validate(value)
      .then(() => setFormErrors({ ...formErrors, [name]: '' }))
      .catch(err => setFormErrors({ ...formErrors, [name]: err.errors[0] }))
  }

  const inputChange = (name, value) => {
    // 🔥 RUN VALIDATION WITH YUP
    validate(name, value);
    setFormValues({
      ...formValues, 
      [name]: value // THIS IS NOT AN ARRAY
    });
  };

  const formSubmit = () => {
    const newUser = {
      first_name: formValues.first_name.trim(),
      last_name: formValues.last_name.trim(),
      email: formValues.email.trim(),
      terms: formValues.terms
    };
    // 🔥 POST NEW FRIEND USING HELPER
    postNewUser(newUser);
  };

  //////////////// SIDE EFFECTS ////////////////
  useEffect(() => {
    getUsers()
  }, []) 

  useEffect(() => {
    // 🔥 ADJUST THE STATUS OF `disabled` EVERY TIME `formValues` CHANGES
    schema.isValid(formValues).then(valid => setDisabled(!valid))
  }, [formValues])

  return (
    <div className='container'>
      <header><h1>User Application</h1></header>

      <UserForms 
        values={formValues}
        change={inputChange}
        submit={formSubmit}
        disabled={disabled}
        errors={formErrors}
      />

      {
        users.map(user => {
          return (
            <User key={user.id} details={user} />
          )
        })
      }
    </div>
  )
}
