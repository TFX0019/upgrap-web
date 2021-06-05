import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, message } from 'antd';
import Cookies from 'js-cookie'
import { Link, withRouter } from 'react-router-dom';
import bglogin from '../images/login.svg';
import Menu from '../components/Menu';
import { Helmet } from 'react-helmet';
import { addData, opt2 } from '../utils/api';
import moment from 'moment';

class LostPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


  onFinish = async (values) => {
    this.setState({loading: true})
    console.log('Success:', values);
    await addData('recover', {email: values.email}, opt2()).then(res => {
      this.setState({loading: false})
      if(res.code === 'success') {
        message.success('Se envio un email a su bandeja de correo', 10);
      } else {
        message.info('Email incorrecto o no existe', 10);
      }
    }).catch(err => {
      this.setState({loading: false})
      message.error('error al enviar correo de validación');
    })
    // if(!result) {
    //   const sender = await addData('changepass', {...values, expire: moment().format('DD MMM YYYY HH:mm:ss')}, opt2());
    //   console.log(sender)
    // }
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

render() {
    return (   
        <div className="login_main" style={{background: `url(${bglogin})`}}>
          <Helmet>
            <title>Upgrap | Recuperar contraseña</title>
          </Helmet>
            <Menu catalogo={false} search={false} />
            <div style={{width: '100%'}}>
            <h1>Recuperar Contraseña</h1>
            <p>¿Olvidaste tu contraseña? ingresa tu correo electronico para recuperar</p>
            <Row style={{width: '100%'}} justify="center">
                <Col xs={24} sm={24} md={12} lg={8}>
                <Form
          name="basic"
          initialValues={{
            email: '',
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu correo',
              },
            ]}>
            <Input className="input_new" placeholder="Ingresa tu correo electronico" />
          </Form.Item>
          <span>Si el correo no no llega a la bandeja principal revisa la bandeja de <strong>spam</strong> y <strong>Promociones</strong>.</span>
    
          <Form.Item style={{textAlign: 'center', marginTop: 20}}>
            <Button type="primary" className="cube_btn" htmlType="submit" loading={this.state.loading}>
              Recuperar
            </Button>
          </Form.Item>
        </Form>
                </Col>
            </Row>
            </div>
            <div className="footer_auth">
                <Link to="/login" style={{marginRight: 30}}>Iniciar sesión</Link>
                <Link to="/register">Registrarme</Link>
            </div>
        </div>
      );
}
};
export default withRouter(LostPassword);
