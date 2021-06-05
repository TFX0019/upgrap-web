import { Col, Row, Image, Card, Button, message } from 'antd';
import React, { Component } from 'react';
import MenuP from '../../components/Menu';
import Products from '../Home/Products';
import Footer from '../../components/Footer';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from "moment";
import { Helmet } from 'react-helmet';
import { addData, BASE_IMG, getData, getDataById, opt1, opt2 } from '../../utils/api';
import { notImage } from '../../images';
moment.updateLocale('es', {
  relativeTime: {
    future: "en %s",
    past:   "hace %s",
    s  : 'unos pocos segundos',
    ss : '%d segundos',
    m:  "un minuto",
    mm: "%d minutos",
    h:  "una hora",
    hh: "%d horas",
    d:  "un dia",
    dd: "%d dias",
    w:  "una semana",
    ww: "%d semana",
    M:  "un mes",
    MM: "%d mes",
    y:  "un año",
    yy: "%d años"
  }
})


class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            products: [],
            product: null,
            modal: false,
            vendedor: null,
            id: '',
            search: ''
         }
    }

    componentDidUpdate = async () => {
      const {id} = this.props.match.params;
      if(this.state.id !== id) {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
        const product = await getDataById('products/', id, opt1);
        this.setState({product, id})
      }
    }

    async componentDidMount() {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'})
        const {id} = this.props.match.params;
        const num = parseInt(id)
        console.log(num)
        const products = await getData('products/limit8', opt1);
        const product = await getDataById('products/'+num, opt1);
        console.log(product)
        this.setState({products, product, id})
    }

    toChat = async (iduser, email, name) => {
      const user = JSON.parse(window.localStorage.getItem('user'))
      const token = Cookies.get('toke n');
      if(!user && !token) {
        message.info('Debes estar registrado enviar mensaje');
      } else {
        message.loading('En breve estaras en contacto con tu posible trader', 7)
        // console.log(opt2(), token)
        await addData('chatlist', {id_customer: user.id, id_user: iduser}, opt2()).then(res => {
          addData('chatlist', {id_customer: iduser, id_user: user.id}, opt2()).then(pon => {
            const data = {fecha: moment().format('DD MMM YYYY HH:mm:ss'), message: `Hola estoy interesado en tu producto: ${name}`, id_sender: parseInt(user.id), id_receiver: parseInt(iduser), issee: false}
            addData('message', data, opt2()).then(() => {
              addData('message/send', {email: email}, opt1).then(() => {
                console.log(pon);
                this.props.history.push('/chat/'+iduser);
              }).catch(err => console.log(err))
            }).catch(err => console.log(err))
          }).catch(err => {
            if(err.data.code === 'registered') {
              this.props.history.push('/chat/'+iduser);
            } else {
              message.error('Error al enviar mensaje');
            }
          })
        }).catch(err => {
          if(err.data.code === 'registered') {
            addData('chatlist', {id_customer: iduser, id_user: user.id}, opt2()).then(res1 => {
              console.log(res1);
            }).catch(err => {
              if(err.data.code === 'registered') {
                const data = {fecha: moment().format('DD MMM YYYY HH:mm:ss'), message: `Hola estoy interesado en tu producto: ${name}`, id_sender: parseInt(user.id), id_receiver: parseInt(iduser), issee: false}
                addData('message', data, opt2()).then(() => {
                  addData('message/send', {email: email}, opt1).then(() => {
                    // console.log(pon);
                    this.props.history.push('/chat/'+iduser);
                  }).catch(err => console.log(err))
                }).catch(err => console.log(err))
                // this.props.history.push('/chat/'+iduser);
              } else {
                message.error('Error al enviar mensaje');
              }
            });
          } else {
            message.error('Error al enviar mensaje');
          }
        })

      }
    }

  //   onSearch = (e) => {
  //     this.setState({search: e.target.value});
  //   }

  //  onKey = (e) => {
  //      if(e.key === "Enter") {
  //          e.preventDefault();
  //          e.stopPropagation();
  //          this.props.history.push('/catalogo/s/'+this.state.search);
  //      }
  //  }


    render() { 
        const {product, vendedor} = this.state;
        return (
          <div className="product_detail_main">

            <MenuP onKey={this.onKey} onSearch={this.onSearch} search={true} catalogo={false} />
            {this.state.product !== null && (
              <Row style={{ marginTop: "5%" }} justify="center">
                <Col lg={8}>
                    <Image width={"100%"} 
                    height={'100%'} 
                    src={BASE_IMG+'products/'+product.photo} 
                    alt={product.name} />
                </Col>
                <Col lg={8}>
                  <Card>
                  {/* <Helmet>
              <title>upgrap | {product.name}</title>
            </Helmet> */}
                    <div>
                      <p>{`${product.estado} | ${product.pais}, ${product.city}`}</p>
                      <h1>{product.name}</h1>
                      <p>{product.description}</p>
                      <p><strong style={{color: '#19726c'}}>Cambio Por:</strong> {product.change}</p>
                      <p>
                        <strong style={{color: '#19726c'}}>Categoria:</strong> {product.categoria} | {moment(product.fecha).startOf('seconds').fromNow()}
                      </p>
                    </div>
                    <Button
                          style={{ width: "100%" }}
                          type="primary"
                          onClick={() => this.toChat(product.id_user, product.email, product.name)}
                        >
                          Me interesa
                        </Button>
                  </Card>
                          <Image.PreviewGroup>
                          <Row align="middle">
                  
                      {product.images &&
                      product.images.map(im =>
                      <Col lg={8}>
                          <Image width={"100%"} src={im} />
                          </Col>)}
                                                 
                    </Row>
                        </Image.PreviewGroup>
                </Col>
              </Row>
            )}

            <div style={{ padding: "5%" }}>
              <Products data={this.state.products} />
            </div>

            <Footer />
          </div>
        );
    }
}
 
export default withRouter(Product);