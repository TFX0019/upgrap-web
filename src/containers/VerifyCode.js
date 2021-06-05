import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, message } from 'antd';
import Cookies from 'js-cookie'
import { Link, withRouter } from 'react-router-dom';
import bglogin from '../images/login.svg';
import Menu from '../components/Menu';
import { Helmet } from 'react-helmet';
import { addData, getData, opt1, opt2 } from '../utils/api';
import moment from 'moment';

class VerifyCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            expire: false,
            email: '',
            token: ''
        }
    }

    async componentDidMount() {
        const {code} = this.props.match.params;
        if(!code) {
            this.props.history.push('/')
        } else {
            await getData('verifycode/'+code, opt1).then(res => {
                console.log(res.info)
                const fechaExp = moment(res.info.expire).add(24, 'hour').format('DD MMM YYY HH:mm:ss')
                if( moment().format('DD MMM YYY HH:mm:ss') > fechaExp) {
                    message.info('Codigo de recuperación a expirado', 20)
                    this.setState({expire: true})
                } else {
                  this.setState({email: res.info.email, token: res.info.code})
                    console.log('ok')
                }
            }).catch(err => {
              message.error('error al Validar enlace');
            })
        }
    }

  onFinish = async (values) => {
    this.setState({loading: true})
    console.log('Success:', values);
    if(values.password === values.repassword) {
      await addData('changepass', {email: this.state.email.trim(), password: values.password.trim(), token: this.state.token.trim()}, opt1).then(res => {
        if(res.code === 'success') {
          message.success('Contraseña se ha cambiado con exito, redireccionacdo');
          setTimeout(() => {
            this.props.history.push('/login');
          }, 2000);
        } else {
          message.info('Codigo de recuperación a expirado')
        }
        console.log(res)
        this.setState({loading: false})
      }).catch(err => {
        console.log(err)
        this.setState({loading: false})
        message.error('error al cambiar contraseña');
      })
      
    } else {
      this.setState({loading: false})
      message.error('Contraseñas no coinciden')
    }
    // await addData('recover', {email: values.email}, opt2()).then(res => {
    //   this.setState({loading: false})
    //   if(res.code === 'success') {
    //     message.success('Se envio un email a su bandeja de correo', 10);
    //   } else {
    //     message.info('Email incorrecto o no existe', 10);
    //   }
    // }).catch(err => {
    //   message.error('error al enviar correo de validación');
    // })
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
            <h1>Restablecer contraseña</h1>
            <p>Ingresa tu nueva contraseña para reestablecer</p>
            <Row style={{width: '100%'}} justify="center">
                <Col xs={24} sm={24} md={12} lg={8}>
                <Form
          name="basic"
          initialValues={{
            password: '',
            repassword: '',
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu correo',
              },
            ]}
          >
            <Input type="password" className="input_new" placeholder="Ingresa tu nueva contraseña" />
          </Form.Item>
          
          <Form.Item
            name="repassword"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu correo',
              },
            ]}
          >
            <Input type="password" className="input_new" placeholder="Repite tu nueva contraseña" />
          </Form.Item>
    
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
export default withRouter(VerifyCode);
