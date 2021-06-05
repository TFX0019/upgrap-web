import { Button, Card, Col, Row, Dropdown, Menu, message, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { Component } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { addData, BASE_IMG, deleteData, getData, getDataById, opt2 } from '../../utils/api';

class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            products: [],
            modal: false,
            customer: null,
            timeExpire: 90,
            btnReSend: true,
            code: ''
         }
    }

    async componentDidMount() {
        const user =  JSON.parse(window.localStorage.getItem('user'));
        const products = await getDataById('products/customer/', user.id, opt2());
        this.setState({products, customer: user});
    }

    async componentWillUnmount() {
        if(this.intervalID) {
            clearInterval(this.intervalID);
        }
        
    }

    openModal = () => {
        this.intervalID = setInterval(() => {
            this.setState({timeExpire: this.state.timeExpire-=1});
            if(this.state.timeExpire === 0) {
                clearInterval(this.intervalID);
                this.setState({btnReSend: false});
            }
        }, 1000);
        this.setState({modal: true})
    };
    closeModal = () => this.setState({modal: false});

    createPublish = async () => {
        if(!this.state.customer.phone || !this.state.customer.prefix) {
            message.info('Debes agregar un numero de telefono para continuar');
        } else if(!this.state.customer.validate_phone) {
            const data = {phone: this.state.customer.prefix+this.state.customer.phone, id_user: this.state.customer.id, create_at: moment().format('DD MMM YYYY HH:mm:ss'), expire_at: moment().add(24, 'hour').format('DD MMM YYYY HH:mm:ss')}
            const validate = await getDataById('expirecode/', this.state.customer.id, opt2());

            if(validate === 0) {
                addData('send', data, opt2()).then(res => {
                    if(moment(res.expire_at).format('DD MMM YYYY HH:mm:ss') > moment().format('DD MMM YYYY HH:mm:ss')) {
                        addData('send', data, opt2()).then(mo => {
                            console.log('modal');
                            this.openModal();
                        })
                    } else {
                        console.log('modal');
                        this.openModal();
                    }
                    console.log(res)
                }).catch(err => console.log(err));
            } else {

                console.log('modal')
                this.openModal();
            }
            // addData('send', )
            console.log(data)
            console.log(validate)
        } else {
            this.props.history.push('/create');
        }
    }

    sendCode = async () => {
        addData('validate', {code: this.state.code, id_user: this.state.customer.id}, opt2()).then(res => {
            if(res) {
                const user =  JSON.parse(window.localStorage.getItem('user'));
                user.validate_phone = true;
                window.localStorage.setItem('user', JSON.stringify(user));
                this.setState({customer: user});
                message.success('Usuario verificado con exito')
                this.props.history.push('/create')
            } else {
                message.error('Su codigo es incorrecto por favor verifique')
            }
            console.log(res)
        }).catch(err => {
            message.error('Ha ocurrido un error al validar datos')
        });
    }

    reSendOTP = async () => {
        const data = {phone: this.state.customer.prefix+this.state.customer.phone, id_user: this.state.customer.id, create_at: moment().format('DD MMM YYYY HH:mm:ss'), expire_at: moment().add(24, 'hour').format('DD MMM YYYY HH:mm:ss')}
        addData('send', data, opt2()).then(res => {
            clearInterval(this.intervalID);
            this.setState({timeExpire: 300});
            this.setState({btnReSend: true});
            this.intervalID = setInterval(() => {
                this.setState({timeExpire: this.state.timeExpire-=1});
                if(this.state.timeExpire === 0) {
                    clearInterval(this.intervalID);
                    this.setState({btnReSend: false});
                }
            }, 1000);
            console.log(res)
        }).catch(err => {
            message.error('Error al reenviar mensaje')
            console.log(err)})
    }

    async handleMenuClick(e, data) {
        const {id}= e;
        if(data.key === 'edit') {
            this.props.history.push('/edit/'+id);
        } else {
            // console.log(e, data)
            await deleteData('products/', id, opt2()).then(res => {
                message.success('Producto eliminado con exito');
                // console.log(res, key)
                let arr = this.state.products.filter(p => p.id !== id);
                this.setState({products: arr});
            }).catch(err => {console.log(err); message.error('error al eliminar producto')})
        }
      }

    render() { 
        return ( 
            <div className="publish_main">
                <Button type="primary" onClick={this.createPublish}>Crear publicación</Button>
                {this.state.products.length > 0 ?
                this.state.products.map(p =>
                    <Card key={p.id} className="cardProduct">
                    <Row>
                        <Col  xs={22} sm={22} md={22} lg={22}>
                            <img src={BASE_IMG+'products/'+p.photo} width="60" />
                            <div className="description_card">
                                <p><strong>Nombre: </strong>{p.name} | {p.estado} | {p.categoria}</p>
                                <p><strong>Descripción: </strong>{p.description}</p>
                            </div>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                            <Dropdown.Button type="primary" overlay={
                                  <Menu onClick={(e) => this.handleMenuClick(p, e)}>
                                  {/* <Menu.Item key="edit">Editar</Menu.Item> */}
                                  <Menu.Item key="delete">Eliminar</Menu.Item>
                                </Menu>
                            } />
                        </Col>
                    </Row>
                </Card>
                ) : <div>No hay publicaciónes</div>}

                <Modal title="Verificación telefonica" 
                cancelText="Reenviar Codigo"
                okText="Enviar"
                onOk={this.sendCode}
                closable={false}
                footer={false}
                onCancel={this.reSendOTP} 
                visible={this.state.modal}>
                    <div className="inputsCode">
                        <p>Por favor ingresa el codigo de verificación enviado a <strong>{this.state.customer && this.state.customer.prefix+this.state.customer.phone}</strong></p>
                        <Input maxLength={6} minLength={6} onChange={(e) => this.setState({code: e.target.value})} value={this.state.code} type="number" className="input_new" />
                        <p><small>Si usted no recibe su codigo en {this.state.timeExpire} segundos <span style={{fontWeight: 700, color: '#32BAB0'}}>Haga click para volver a enviar</span></small></p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <Button style={{marginRight: 20}} disabled={this.state.btnReSend} onClick={this.reSendOTP}>Reenviar Código</Button>
                        <Button type="primary" onClick={this.sendCode}>Enviar</Button>
                    </div>
                </Modal>
            </div>
         );
    }
}
 
export default withRouter(Publish);