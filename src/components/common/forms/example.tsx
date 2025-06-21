// UserForm.tsx
import React from 'react';
import * as Yup from 'yup';
import GenericForm, { FormField } from './GenericForm';
import SelectInput from './fields/SelectInput';
import TextInput from './fields/TextInput';
 

type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};
 
const UserForm = () => {
  const initialValues: UserFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Role is required'),
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
    { value: 'editor', label: 'Editor' },
  ];

  const handleSubmit = (values: UserFormValues, actions: any) => {
    console.log('Form submitted:', values);
    setTimeout(() => {
      actions.setSubmitting(false);
      alert('Form submitted successfully!');
    }, 1000);
  };

  const fields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      component: TextInput,
    },
    {
      name: 'role',
      label: 'Role',
      required: true,
      component: SelectInput,
      options: roleOptions,
    },
  ];

  return (
    <GenericForm<UserFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={fields as FormField[]}
      title="User Registration"
      submitButtonText="Register"
    />
  );
};

export default UserForm;