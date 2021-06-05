import React, { Component } from 'react';
import { Form, Input, Button, Image, Row, Col, Select, Radio, message, Upload, Modal } from 'antd';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { paisesList } from '../../utils/paises';
import { addData, BASE_IMG, getData, opt1, opt2, opt3, UploadFile } from '../../utils/api';
import moment from "moment";

const {Option} = Select;

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



class CreateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            categories: [],
            key: null,
            photo: null,
            image: null,
            image1: null,
            image2: null,
            product: null,
            loading: false,
            progress: 0,
            imageUrl: '',
            images: [],
            paises: [],
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [],
         }
    }

    async componentDidMount() {
      const categories = await getData('categories', opt1);
      this.setState({paises: paisesList, categories})
    }

    onFinish = async (values) => {
        console.log('Success:', values);
        console.log('files:', this.state.fileList);
        this.setState({loading: true});
        if(!values.photo) {
          message.info('Debe seleccionar una imagen principal');
        } else {
        let fd = new FormData();
        fd.append('file', values.photo[0].originFileObj)
        UploadFile('upload/product', fd, opt3()).then(res => {
          console.log(res)
          this.setState({photo: res});
          if(this.state.fileList.length > 0) {
            let count = 0;
            const user =  JSON.parse(window.localStorage.getItem('user'));
            this.state.fileList.forEach(p => {
              let fd = new FormData();
              fd.append('file', p.originFileObj);
              UploadFile('upload/product', fd, opt3()).then(con => {
                if(count === 0) this.setState({image: con});
                if(count === 1)this.setState({image1: con});
                if(count === 2)this.setState({image1: con});
                count+=1;
                if(count === this.state.fileList.length) {
                  delete values.photo;
                  delete  values.imagen;
                  addData('products', {...values, photo: this.state.photo, category: parseInt(values.category), fecha: moment().format('DD MMM YYYY HH:mm:ss'), id_user: user.id, visible: true, image: this.state.image, image1: this.state.image1, image2: this.state.image2}, opt2()).then(resp => {
                    console.log(res);
                    message.success('producto publicado con exito');
                    this.props.history.push('/customer');
                  }).catch(err => {
                    console.log(err)
                    this.setState({loading: false});
                    message.error('Error al publicar producto');
                  })
                }
              }).catch(err => console.log('error al subir imagen'))
            })

            console.log('0subir imagenes');
          } else {
            const user =  JSON.parse(window.localStorage.getItem('user'));
            delete values.photo;
            delete  values.imagen;
            addData('products', {...values, photo: this.state.photo, category: parseInt(values.category), fecha: moment().format('DD MMM YYYY HH:mm:ss'), id_user: user.id, visible: true}, opt2()).then(resp => {
              console.log(res);
              message.success('producto publicado con exito');
              this.props.history.push('/customer');
            }).catch(err => {
              console.log(err)
              this.setState({loading: false});
              message.error('Error al publicar producto');
            })
          }
        }).catch(err => {
          console.log(err)
          this.setState({loading: false});
          message.error('Error al subir imagen principal');
        }); 
        }
      };
    
      onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
    
      handleChange = ({ fileList }) => {
        // const {file} = fileList;
        console.log(fileList);
        // if(file.type !== 'image/png' || file.type !== 'image/jpg' || file.type !== 'image/jpeg') {
        //   message.error('Debe seleccionar tipo de archivo valido: PNG, JPG, JPEG' )
        // } else { 
          
        // }
        this.setState({ fileList })
      };
    
      beforeUpload = (file) => {
        // console.log(file)
        // if(file.type !== 'image/jpeg') {
        //   message.error('Debe seleccionar tipo de archivo valido: PNG, JPG, JPEG' );
        //   // return Upload.LIST_IGNORE;
        // } else if(file.type !== 'image/png') {
        //   message.error('Debe seleccionar tipo de archivo valido: PNG, JPG, JPEG' );
        // }
        // return file.type === 'image/jpeg' ? false : Upload.LIST_IGNORE;
        return false;
      }


    render() { 
      const { previewVisible, previewImage, fileList, previewTitle, product } = this.state;
      const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
        return (
          <div>
            <Form
          style={{marginTop: 50, padding: 40}}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Row justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese nombre del producto",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nombre del Producto"
                    className="input_new"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingreseuna descripción",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Descripcion"
                    className="input_new"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                  name="change"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese tipo de trueque",
                    },
                  ]}
                >
                  <Input
                    placeholder="Por que deseas cambiar"
                    className="input_new"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona una categoria",
                    },
                  ]}
                >
                  {this.state.categories.length > 0 && (
                    <Select
                      showSearch={true}
                      placeholder="Por favor selecciona una categoria"
                      allowClear
                    >
                      {this.state.categories.map(c => 
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      )}
                    </Select>
                  )}
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
              {this.state.paises.map(p => 
                <Option key={p.id} value={p.name}>{p.name}</Option>)}
            </Select>
            </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                name="city"
                rules={[
                {
                    message: 'Por favor ingresa Ciudad estado',
                },
                ]}
            >
                <Input placeholder="Ciudad/Estado" className="input_new" />
            </Form.Item>
            </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name="address"
                  rules={[
                    {
                      message: "Ingresa una direción referencial",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingresa una direción referencial"
                    className="input_new"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item
                  name="estado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione estado del producto",
                    },
                  ]}
                >
                    <Radio.Group>
                        <Radio value="usado">Usado</Radio>
                        <Radio value="nuevo">Nuevo</Radio>
                    </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <span>Selecciona una imagen principal(Obligatorio)</span>
              {/* <Input onChange={this.uploadPhoto} value="" type="file" placeholder="selecciona una imagen" />
                    <Progress percent={this.state.progress} />
                    <Image width="80px" src={this.state.imageUrl} /> */}
                          <Form.Item
                            name="photo"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Ingresa una imagen principal"
                          >
                            <Upload beforeUpload={this.beforeUpload} multiple={false} name="logo" action="/upload.do" listType="picture">
                              <Button icon={<UploadOutlined />}>Selecciona una imagen</Button>
                            </Upload>
                          </Form.Item>

              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
              <span style={{marginTop: 20}}>Puedes selecciona un maximo de 3 imagenes, PNG o JPG: (Opcional)</span> <br />
              {/* <Input type="file" onChange={this.selectImages} placeholder="Selecciona varias imagenes" multiple /> */}
              <Form.Item
                name="imagen"
                valuePropName="fileList"
                getValueFromEvent={normFile}>
              <Upload
              name="imagen"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={this.state.fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
              >
                {this.state.fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
              </Form.Item>
              </Col>
            </Row>
            <Row>
                      {this.state.images.map((im, i) =>
                        <Col>
                        <Image width={80} src={im} />
                        </Col>)}
                  </Row>
            <Form.Item style={{marginTop: 20}}>
              <Button loading={this.state.loading} type="primary" htmlType="submit">
                Publicar
              </Button>
            </Form.Item>
          </Form>
          </div>
        );
    }
}
 
export default withRouter(CreateProduct);