import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, message } from 'antd';
import Cookies from 'js-cookie';
import Modal from 'antd/lib/modal/Modal';
import { countries } from '../../utils/contries';
import { opt2, updateData } from '../../utils/api';
const {Option} = Select;

class EditData extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            paises: [],
            customer: null,
            loading: false,
            modal: false,
            email: '',
            password: '',
            repass: '',
            city: ''
         }
    }
    async componentDidMount(){
        const user = JSON.parse(window.localStorage.getItem('user'));
        this.setState({customer: user, paises: countries});
    }

    onFinish = async (values) => {
        this.setState({loading: true})
        const data = {...values}
        updateData('customer/', data, this.state.customer.id, opt2()).then(res => {
            window.localStorage.setItem('user', JSON.stringify(res.user));
            message.success('Datos actualizado con exito')
            this.setState({loading: false})
        }).catch(err => {
            message.error('Error al actualizar datos')
            console.log(err)
            this.setState({loading: false})
        })
        console.log('Success:', data);
      };

      openModal = () => this.setState({modal: true});
      closeModal = () => this.setState({modal: false});

      changePassword = async () => {
      }

      hanledchange = (e) => {
          this.setState({[e.target.name]: e.target.value})
      }

    render() { 
        const {customer} = this.state;
        return ( 
            <div className="editdata_main">
                {customer !== null &&
                <Modal title="Cambiar contraseña" confirmLoading={this.state.loading} onOk={this.changePassword} onCancel={this.closeModal} visible={this.state.modal}>
                    <Input placeholder="Correo electronico" type="email" className="input_new" style={{marginTop: 20}} name="email" onChange={this.hanledchange} value={this.state.email} />
                    <Input placeholder="Contraseña actual" type="password" className="input_new" style={{marginTop: 20}} name="password" onChange={this.hanledchange} value={this.state.password} />
                    <Input placeholder="Contraseña nueva" type="password" className="input_new" style={{marginTop: 20}} name="repass" onChange={this.hanledchange} value={this.state.repass} />
                </Modal>}
                <Button type="primary" style={{margin: '20px 0'}} onClick={this.openModal}>Cambiar Contraseña</Button>
                
        {customer !== null && <Form
          name="basic"
          initialValues={{...customer, prefix: !customer.prefix ? '+51' : customer.prefix}}
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
                    message: 'Por favor ingresa tu nombre',
                },
                ]}
            >
                <Input placeholder="Por favor ingresa tu nombre" className="input_new" />
            </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="phone"
                rules={[
                {
                    required: true,
                    message: 'Por favor ingresa tu Numero celular',
                },
                ]}
            >
                <Input addonBefore={<Form.Item name="prefix" noStyle>
          <Select showSearch={true} style={{ width: 70 }}>
            {this.state.paises.map(p => <Option value={p.dial_code}>{p.dial_code}</Option>)}
          </Select>
        </Form.Item>} placeholder="Por favor ingresa tu Numero celular" className="input_new" />
            </Form.Item>


            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="pais"
                rules={[
                {
                    required: true,
                    message: 'Por favor ingresa tu Pais',
                },
                ]}
            >
              <Select
              showSearch={true}
              placeholder="Por favor ingresa tu Pais"
              allowClear
            >
              {this.state.paises.map((p, i)=> 
                <Option key={i} value={p.name_es}>{p.name_es}</Option>)}
            </Select>
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="city"
                rules={[
                {
                    required: true,
                    message: 'Por favor ingresa Ciudad estado',
                },
                ]}
            >
                <Input placeholder="Ciudad/Estado" className="input_new" />
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="dir"
                rules={[
                {
                    required: true,
                    message: 'Por favor ingresa tu Dirección',
                },
                ]}
            >
                <Input placeholder="Por favor ingresa tu Dirección" className="input_new" />
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="email"
                rules={[
                {   type: "email",
                    required: true,
                    message: 'Por favor ingresa tu Dirección de correo electronico',
                },
                ]}
            >
                <Input disabled={customer.singin_method === 'email' ? false : true} placeholder="Por favor ingresa tu Dirección de correo electronico" className="input_new" />
            </Form.Item>
            </Col>
        </Row>
    
          <Form.Item style={{textAlign: 'right'}}>
            <Button type="primary" className="cube_btn" htmlType="submit" loading={this.state.loading}>
              Guardar
            </Button>
          </Form.Item>
        </Form>}
            </div>
         );
    }
}
 
export default EditData;