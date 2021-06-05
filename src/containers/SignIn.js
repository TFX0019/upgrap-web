import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, message } from 'antd';
import Cookies from 'js-cookie'
import { Link, withRouter } from 'react-router-dom';
import bglogin from '../images/login.svg';
import Menu from '../components/Menu';
import { Helmet } from 'react-helmet';
import { addData, opt1 } from '../utils/api';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { LoginFacebook, LoginGoogle } from '../components/LoginSocial';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

  onFinish = async (values) => {
    this.setState({loading: true})
    addData('signin', values, opt1).then(res => {
      console.log(res);
      Cookies.set('token', res.token, {expires: 1});
      window.localStorage.setItem('user', JSON.stringify(res.user));
      setTimeout(() => {
        this.setState({loading: false});
        this.props.history.push('/customer');
      }, 1000);
    }).catch(err => {
      console.log(err);
      if(err.data.code === "password/invalid") {
        message.error('Usuario/contraseña incorrecto');
      } else if(err.data.code === "email/empty") {
        message.error('Email no se encuentra registrado');
      } else {
        message.error('Error al iniciar sesión');
      }
      this.setState({loading: false})
    })
    // console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  responseFacebook = (response) => {
    console.log(response); 
  }

  responseGoogle = (response) => {
    console.log(response);
  }
render() {
    return (   
        <div className="login_main" style={{background: `url(${bglogin})`}}>
          <Helmet>
            <title>Upgrap | Iniciar Sesion</title>
          </Helmet>
            <Menu catalogo={false} search={false} />
            <div style={{width: '100%'}}>
            <h1>Iniciar Sesión</h1>
            <p>¡Hola a todos! inicia sesión y comienza a administrar <br />
los artículos de tu tienda</p>
            <Row style={{width: '100%'}} justify="center">
                <Col xs={24} sm={24} md={12} lg={8}>
                <Form
          name="basic"
          initialValues={{
            remember: true,
            email: '',
            password: ''
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input className="input_new" />
          </Form.Item>
    
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password className="input_new" />
          </Form.Item>
    
          <Form.Item style={{textAlign: 'center'}}>
            <Button type="primary" className="cube_btn" htmlType="submit" loading={this.state.loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
        <div style={{textAlign: 'center'}}>
                <p style={{margin: 0, padding: 0}}>O ingresa con:</p>
                <LoginFacebook />
              <LoginGoogle />
              </div>
                </Col>
            </Row>
            </div>
            <div className="footer_auth">
                <Link to="/lostpassword" style={{marginRight: 30}}>¿Olvidaste tu contraseña?</Link>
                <Link to="/register">Registrarme</Link>
            </div>
        </div>
      );
}
};
export default withRouter(SignIn);
