import React from 'react';
import { Form, Input, Button, Select, Row, Col, message, Checkbox } from 'antd';

import Cookies from 'js-cookie'
import { Link, withRouter } from 'react-router-dom';
import bglogin from '../images/login.svg';
import Menu from '../components/Menu';
import Modal from 'antd/lib/modal/Modal';
import { Helmet } from 'react-helmet';
import { addData, opt1 } from '../utils/api';
import { LoginFacebook, LoginGoogle } from '../components/LoginSocial';


const {Option} = Select;

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false
        }
    }

  onFinish = async (values) => {
    if(values.remember) {
      if(values.password === values.repassword) {
        this.setState({loading: true});
        console.log(values)
        addData('signup', {...values, singin_method: 'email'}, opt1).then(res => {
          console.log(res);
          Cookies.set('token', res.token, {expires: 1});
          window.localStorage.setItem('user', JSON.stringify(res.user));
          message.success('Felicidades te redigiras en unos segundos');
          setTimeout(() => {
            this.setState({loading: false});
            this.props.history.push('/customer');
          }, 1000);
          
        }).catch(err => {
          console.log(err);
          if(err.data.code === 'email/registered') {
            message.error('Su email ya se encuentra registrado', 9);
          } else {
            message.error('Error al registar usuario');
          }
          this.setState({loading: false});
        })
      } else {
        message.error('Contraseñas no coinciden')
      }
    } else {
      message.info('Acepta términos y condiciones para continuar')
    }
    // console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Llena los campos vacios')
  };



render() {
    return (   
        <div className="login_main" style={{background: `url(${bglogin})`}}>
          <Helmet>
            <title>Upgrap | Registrar usuario</title>
          </Helmet>
            <Menu catalogo={false} search={false} />
            <div style={{width: '100%'}}>
            <h1>Crear Cuenta</h1>
            <p>¡Hola a todos! inicia sesión y comienza a administrar <br />
los artículos de tu tienda</p>
            <Form
            initialValues={{
              remember: false,
              name: '',
              email: '',
              password: '',
              repassword: '',
              rol: 0
            }}
          name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
        <Row style={{width: '100%'}} justify="space-between">
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="name"
                rules={[
                {
                    required: true,
                    message: 'Ingresa tu nombre y apellido',
                },
                ]}
            >
                <Input placeholder="Ingresa tu nombre y apellido*" className="input_new" />
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="email"
                rules={[
                {   type: "email",
                    required: true,
                    message: 'Ingresa tu Dirección de correo electronico',
                },
                ]}
            >
                <Input placeholder="Ingresa tu Dirección de correo electronico*" className="input_new" />
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
            <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Ingresa tu contraseña',
              },
            ]}
          >
            <Input.Password placeholder="Ingresa tu contraseña*" className="input_new" />
          </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={11} lg={11}>
            <Form.Item
            name="repassword"
            rules={[
              {
                required: true,
                message: 'Repita su contraseña',
              },
            ]}
          >
            <Input.Password placeholder="Repita su contraseña*" className="input_new" />
          </Form.Item>
                </Col>
        </Row>
    <Row justify="center">
    <Col style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}} xs={24} sm={24} md={24} lg={25}>
                <Form.Item name="remember" valuePropName="checked">
 <Checkbox>Acepto los </Checkbox>
      </Form.Item>
      <span style={{color: '#32BAB0', cursor: 'pointer', marginTop: '-23px'}} onClick={() => this.setState({visible: true})} >Términos & condiciones</span>       
      </Col>
    </Row>
          <Form.Item style={{textAlign: 'center'}}>
            <Button type="primary" className="cube_btn" htmlType="submit" loading={this.state.loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
              <div style={{textAlign: 'center'}}>
                <p style={{margin: 0, padding: 0}}>O registrate con:</p>
                <LoginFacebook />
              <LoginGoogle />
              </div>
        <Modal onCancel={() => this.setState({visible: false})} width={'90%'} footer={false} visible={this.state.visible} title="Términos y Condiciones">
          <p>01 - Capacidad <br />
Los Servicios sólo están disponibles para personas que tengan capacidad legal para contratar (en adelante, el “Usuario”, o en plural, los “Usuarios”). No podrán utilizar los Servicios las personas que no tengan esa capacidad, los menores de edad o Usuarios de Upgrap que hayan sido suspendidos temporalmente o inhabilitados definitivamente. Para registrar un Usuario como Empresa, se deberá contar con la capacidad suficiente como para contratar a nombre y representación de tal entidad como así también de obligar a la misma en los términos de este Acuerdo. <br /><br />
02 - Registración<br />
Es obligatorio completar el formulario de registración en todos sus campos con datos válidos para poder utilizar los servicios que brinda Upgrap. El Usuario deberá completar el mencionado formulario de registración con la información personal que le sea solicitada de manera exacta, precisa y verdadera (en adelante, los "Datos Personales") y asume el compromiso de actualizar los Datos Personales conforme resulte necesario. El Usuario presta expresa conformidad con que Upgrap utilice diversos medios para identificar sus datos personales, asumiendo el Usuario la obligación de revisarlos y mantenerlos actualizados. Upgrap NO se responsabiliza por la certeza de los Datos Personales de los Usuarios. Los Usuarios garantizan y responden, en cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de sus Datos Personales.
A su exclusiva discreción, Upgrap podrá requerir una registración adicional a los Usuarios que operen como concesionarias o inmobiliarias, como requisito para que dichos Usuarios accedan a paquetes especiales de publicaciones. En estos casos, una vez efectuada la registración adicional, las ofertas de venta de automóviles o inmuebles que realicen las concesionarias o inmobiliarias, respectivamente, sólo se publicarán en Upgrap a través de alguno de dichos paquetes o bajo las modalidades que Upgrap habilite para este tipo de Usuarios.
Upgrap se reserva el derecho de solicitar algún comprobante y/o dato adicional a efectos de corroborar los Datos Personales, así como de suspender temporal o definitivamente a aquellos Usuarios cuyos datos no hayan podido ser confirmados. En estos casos de inhabilitación, se dará de baja todos los artículos publicados, así como las ofertas realizadas, sin que ello genere algún derecho a resarcimiento. <br /><br />

Upgrap se reserva el derecho de solicitar una indemnización o daño ulterior ocasionado por el usuario. <br /><br />

El Usuario accederá a su cuenta personal (en adelante, la "Cuenta") mediante el ingreso de su Apodo y clave de seguridad personal elegida (en adelante, la "Clave de Seguridad"). El Usuario se obliga a mantener la confidencialidad de su Clave de Seguridad.
La Cuenta es personal, única e intransferible, y está prohibido que un mismo Usuario registre o posea más de una Cuenta. En caso que Upgrap detecte distintas Cuentas que contengan datos coincidentes o relacionados, podrá cancelar, suspender o inhabilitarlas.
El Usuario será responsable por todas las operaciones efectuadas en su Cuenta, pues el acceso a la misma está restringido al ingreso y uso de su Clave de Seguridad, de conocimiento exclusivo del Usuario. El Usuario se compromete a notificar a Upgrap en forma inmediata y por medio idóneo y fehaciente, cualquier uso no autorizado de su Cuenta, así como el ingreso por terceros no autorizados a la misma. Se aclara que está prohibida la venta, cesión o transferencia de la Cuenta (incluyendo la reputación y calificaciones) bajo ningún título, salvo expresa autorización de Upgrap.
Upgrap se reserva el derecho de rechazar cualquier solicitud de registración o de cancelar una registración previamente aceptada, sin que esté obligado a comunicar o exponer las razones de su decisión y sin que ello genere algún derecho a indemnización o resarcimiento.<br /><br />

Está terminantemente prohibido publicar fotos con contenido sexual, drogas, violencia, entre otros contenidos ilícitos por ley vigente en el país que corresponde.<br /><br />

Upgrap solamente se encarga de compartir información publicada por cada uno de sus usuarios. No se responsabiliza directa o indirectamente por los intercambios y/o transacciones realizados dentro de la plataforma.<br /><br />

Upgrap no se responsabiliza por robos/secuestros y todo suceso que pueda ocurrir de ntro y fuera de la plataforma. El usuario es 100 % responsable de sus publicaciones hechas en la plataforma así como también de cualquier coordinación o reunión física o virtual entre usuarios de Upgrap.<br /><br />
</p>
<div style={{textAlign: 'center'}}>
  <Button onClick={() => this.setState({visible: false})} type="primary">Cerrar</Button>
</div>
        </Modal>
            </div>
            {/* <div className="footer_auth">
                <Link to="/lostpassword" style={{marginRight: 30}}>¿Olvidaste tu contraseña?</Link>
                <Link to="/register">Registrarme</Link>
            </div> */}
        </div>
      );
}
};
export default withRouter(SignUp);
