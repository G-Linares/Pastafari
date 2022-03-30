import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const [usernameProvided, setUsernameProvided] = useState("");
  const [passwordProvided, setPasswordProvided] = useState("");

  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const initialValues = {
    username: "",
    name: "",
    last_name: "",
    email: "",
    password: "",
    img: "",
    type:""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3,"Tiene que tener al menos 3 caracteres").required("no puede esta vacio el campo"),
    name: Yup.string().required("no puede esta vacio el campo"),
    last_name: Yup.string().required("no puede esta vacio el campo"),
    email: Yup.string("tiene que ser un email valido").required("no puede esta vacio el campo"),
    password: Yup.string().required("no puede esta vacio el campo"),
    img: Yup.string().required("no puede esta vacio el campo"),
    type: Yup.string().oneOf(["Admin", "Cliente"],"Escriba Admin o Cliente")
  });

  // se crea un nuevo usuario en la base de datos

  const onSubmitCreate = (data) => {
    axios.post(`http://localhost:3001/users`, data).then(() => {
      Swal.fire({
        icon: 'success',
        title: '¡Has creado una nueva cuenta!',
        text: "ya puedes iniciar sesion",
      });
    });
  };

  //hago una handle function que verifica que el usuario y la contrasenia se encuentren en la base de datos, si haces login bien o guarda en session storage

  const onSubmitLogin = () => {
    const userData = { username: usernameProvided, password: passwordProvided };
    axios
      .post(`http://localhost:3001/users/login`, userData)
      .then((response) => {
        if (response.data.error) {
          return  Swal.fire({
            icon: 'error',
            title: 'Usuario o contraseña incorrecta',
            text: `Por favor intenta acceder con una contraseña o usuario válido`
          })
        } else {
          // como el pedido ya caraga con datos del usuario y el token que de acceder a diferentes partes
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            type: response.data.type
          });
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Has accedido a tu cuenta ${response.data.username}`
          })
          history.push("/myaccount");
        }
      });
  };

  // esta fallando la promise de el submit
  return (
    <>
      <div className="loginWrapper">
        <div className="mainLogin">
          <input type="checkbox" id="chk" aria-hidden="true" />
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmitCreate}
            validationSchema={validationSchema}
          >
            <div className="signup">
              <Form>
                <label htmlFor="chk" aria-hidden="true">
                  Regístrate
                </label>
                <ErrorMessage name="username" component="span" />
                <Field
                  // type="text"
                  name="username"
                  placeholder="Usuario"
                  required=""
                />
                <ErrorMessage name="password" component="span" />
                <Field
                  name="password"
                  placeholder="Contraseña"
                  required=""
                  type="password"
                />
                <ErrorMessage name="name" component="span" />
                <Field name="name" placeholder="Nombre" required="" />
                <ErrorMessage name="last_name" component="span" />
                <Field name="last_name" placeholder="Apellido" required="" />
                <ErrorMessage name="email" component="span" />
                <Field
                  name="email"
                  placeholder="Email"
                  required=""
                  type="email"
                />
                <ErrorMessage name="img" component="span" />
                <Field name="img" placeholder="Foto de Perfil" required="" />
                <ErrorMessage name="type" component="div" className="admin_input_field" />
                <Field name="type" placeholder="Tipo de cuenta (Admin/Cliente)" required="" />
                
                <button type="submit">Regístrate</button>
              </Form>
            </div>
          </Formik>

          <div className="login">
            <div>
              <label htmlFor="chk" aria-hidden="true" className="sign_up">
                Inicia Sesión
              </label>

              <input
                name="username"
                placeholder="Usuario"
                required=""
                onChange={(event) => {
                  setUsernameProvided(event.target.value);
                }}
              />

              <input
                name="password"
                placeholder="Contraseña"
                required=""
                type="password"
                onChange={(event) => {
                  setPasswordProvided(event.target.value);
                }}
              />
              <button onClick={onSubmitLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
