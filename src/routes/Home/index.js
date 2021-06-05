import { Col, Row } from 'antd';
import Footer from '../../components/Footer';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Menu from '../../components/Menu';
import { ImgHome } from '../../images';
import Products from './Products';
import What from './What';
import StepsPublish from './Steps';
import { Helmet } from 'react-helmet';
import { getData, opt1 } from '../../utils/api';
import Categories from './categorias';
import Cookies from "js-cookie";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            products: [],
            categories: [],
            search: ''
         }
    }

    async componentDidMount() {
        window.scrollTo({top: 0, left: 0, behavior: 'auto'})
        const categories = await getData('categories', opt1);
        const products = await getData('products/limit8', opt1);
        console.log(Cookies.get('token'))
        this.setState({categories, products});
    }

    onSearch = (e) => {
       this.setState({search: e.target.value});
    }

    onKey = async (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            // const busqueda = await getData('products/search/'+this.state.search, opt1);
            // console.log(busqueda);
            this.props.history.push('/catalogo/s/'+this.state.search);
        }
    }

    render() { 
        return ( 
            <div className="home_main">
                <Helmet>
                    <title>Upgrap | Inicio</title>
                </Helmet>
                <Menu onKey={this.onKey} onSearch={this.onSearch} search={true} catalogo={false} />
                <div className="portada">
                    <Row style={{width: '100%'}} align="middle" justify="space-between">
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <h2>INTERCAMBIA tus Productos</h2>
                            <h1>FÁCIL Y <span>RÁpido</span></h1>
                            <h4>Intercambia productos en tu ciudad</h4>
                            <Link to="/register">Registrarme</Link>
                        </Col>
                        <Col style={{textAlign: 'center'}} xs={24} sm={24} md={12} lg={12}>
                            <ImgHome width="80%" />
                        </Col>
                    </Row>
                </div>
                <div style={{padding: '5%'}}>
                <StepsPublish />
                <What />
                <Categories data={this.state.categories} />
                {this.state.products.length > 0 && <Products data={this.state.products} />}
                </div>
                <Footer />
            </div>
         );
    }
}
 
export default withRouter(Home);