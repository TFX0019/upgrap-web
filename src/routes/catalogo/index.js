import { Col, Row, Card, Tag, Pagination, Menu, Switch, Divider, Select } from 'antd';
import { Link, withRouter } from "react-router-dom";
import React, { Component } from 'react';
import MenuP from '../../components/Menu';
import Footer from '../../components/Footer';
import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    TagOutlined,
    SettingOutlined,
    LinkOutlined,
  } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { BASE_IMG, getData, opt1 } from '../../utils/api';
import Cookies from 'js-cookie';
import { paisesList } from '../../utils/paises';

  const { SubMenu } = Menu;
  const {Option} = Select;


class Catalogo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          catalogo: [],
          categorias: [],
          filterList: [],
          pageSize: 12,
          paginationTotal: 0,
          currentPage: 1,
          categoriaSelected: 0,
          searchText: '',
          totalPages: 0,
          user: null,
          country: 'todo'
         }
    }

    async componentDidMount() {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
      const {categorie, search, page}=this.props.match.params;
      const categorias = await getData('categories', opt1);
      const user = JSON.parse(window.localStorage.getItem('user'));
      this.setState({categorias});

      if(!page) {
        this.props.history.push('/catalogo/'+1)
      } else {
        if(categorie) {
          const busqueda = await getData('products/c/'+categorie, opt1);
          this.setState({categoriaSelected: parseInt(categorie), paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
        } else if(search) {
            const busqueda = await getData('products/search/'+search, opt1);
            this.setState({searchText: search, paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
          // this.filterName(search);
        } else if (user) {
          this.setState({user, country: user.pais});
          const busqueda = await getData('products/co/'+user.pais, opt1);
          this.setState({paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
        } else {
          if(!page) {
            const catalogo = await getData('products/p/1', opt1);
            this.setState({paginationTotal: catalogo.total ,currentPage: 1, catalogo: catalogo.data, filterList: catalogo.data});
            // console.log(catalogo);
          } else {
            const catalogo = await getData('products/p/'+page, opt1);
            this.setState({paginationTotal: catalogo.total,currentPage: parseInt(page), catalogo: catalogo.data, filterList: catalogo.data});
          }
        }
      }
      
    }

    async componentDidUpdate() {
      const {categorie, search, page}=this.props.match.params;
      if(parseInt(page) !== this.state.currentPage) {
        window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
        // this.setState({currentPage: parseInt(page)});
        const catalogo = await getData('products/p/'+page, opt1);
        this.setState({paginationTotal: catalogo.total,currentPage: parseInt(page), catalogo: catalogo.data, filterList: catalogo.data});
        console.log(page)
      } 
      
    }



    changePage = async (e) => {
      window.scrollTo({left: 0, top: 0, behavior: 'smooth'});

      if (this.state.searchText && this.state.categoriaSelected === 0) {
        const catalogo = await getData(`products/search/${this.state.searchText}/p/${e}`, opt1);
        this.setState({paginationTotal: catalogo.total,currentPage: parseInt(e), catalogo: catalogo.data, filterList: catalogo.data});
      } else if(this.state.categoriaSelected !== 0) {
        const busqueda = await getData(`products/c/${this.state.categoriaSelected}/p/${e}`, opt1);
        this.setState({paginationTotal: busqueda.total ,currentPage: parseInt(e), catalogo: busqueda.data, filterList: busqueda.data});
      } else {
        this.props.history.push('/catalogo/'+e)
      }
    }

  filterCategories = async ({key}) => {
    if(parseInt(key) === 0) {
      const catalogo = await getData('products/p/1', opt1);
      this.setState({categoriaSelected: 0, paginationTotal: catalogo.total ,currentPage: 1, catalogo: catalogo.data, filterList: catalogo.data});
    } else {
      const busqueda = await getData('products/c/'+key, opt1);
    this.setState({categoriaSelected: parseInt(key), paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
    }
    console.log(key)
  }

  filterCountry = async (e) => {
    if(parseInt(e) === 'todo') {
      const catalogo = await getData('products/p/1', opt1);
      this.setState({country: 'todo', categoriaSelected: 0, paginationTotal: catalogo.total ,currentPage: 1, catalogo: catalogo.data, filterList: catalogo.data});
    } else {
      const busqueda = await getData('products/co/'+e, opt1);
    this.setState({country: e, categoriaSelected: 0, paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
    }
    console.log(e)
  }

  onSearch = (e) => {
    this.setState({searchText: e.target.value});
 }

 onKey = async (e) => {
     if(e.key === "Enter") {
         e.preventDefault();
         e.stopPropagation();
         if (!this.state.searchText || this.state.searchText === null || this.state.searchText === '' || this.state.searchText === ' ') {
          const catalogo = await getData('products/p/1', opt1);
          this.setState({paginationTotal: catalogo.total,currentPage: 1, catalogo: catalogo.data, filterList: catalogo.data});
         } else {
          const busqueda = await getData('products/search/'+this.state.searchText, opt1);
          this.setState({paginationTotal: busqueda.total ,currentPage: 1, catalogo: busqueda.data, filterList: busqueda.data});
         }
     }
 }

    render() { 
      const {filterList, categorias, categoriaSelected, searchText, user} = this.state;
        return (
          <div>
            <Helmet>
              <title>Upgrap | Productos</title>
            </Helmet>
                      <div className="catalogo_main">
            <MenuP search={false} valueSearch={searchText} onKey={this.onKey} catalogo={true} onChange={this.onSearch} />
            <Row style={{ marginTop: "5%" }}>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Select onChange={(e) => this.filterCountry(e)} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                  value={this.state.country} style={{width: '100%', marginBottom: 20}}>
                  {paisesList.map(p => (
                    <Option key={p.id} value={p.name}>{p.name}</Option>
                  ))}
                  
                </Select>
                <Menu
                  style={{ width: '100%' }}
                  defaultSelectedKeys={[categoriaSelected.key]}
                  defaultOpenKeys={["sub1"]}
                  mode="inline"
                  theme={"light"}
                >
                    <Menu.Item onClick={() => this.filterCategories({key: 0})} key={0} icon={<TagOutlined />}>
                      Todo
                    </Menu.Item>
                  {categorias.map((ca) => (
                    <Menu.Item onClick={() => this.filterCategories({key: ca.id})} key={ca.id} icon={<TagOutlined />}>
                      {ca.name}
                    </Menu.Item>
                  ))}

                </Menu>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18}>
                <Row>
                  {filterList.length > 0 ?
                  filterList.map((c) => (
                    <Col key={c.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                      <Link to={`/product/${c.id}`}>
                      <Card className="card_product">
                        <Tag className="tag_estado">{c.estado}</Tag>
                        <div className="container_img">
                        <img src={BASE_IMG+'products/'+c.photo} />
                        </div>
                        <h4>{c.name}</h4>
                        <p>{c.description.substring(0, 32)}</p>
                        <span style={{fontSize: 'small', fontWeight: 700}}>{`${c.pais ? c.pais+', ' : ''} ${c.city ? c.city : ''}`}</span> <br />
                        <Link to={`/product/${c.id}`}>Más Información</Link>
                      </Card>
                      </Link>
                    </Col>
                  )): <Col xs={24}><h2 style={{textAlign: 'center'}}>No hay resultados</h2></Col>}
                </Row>
              </Col>
            </Row>
            <div style={{ textAlign: "center" }}>
                  <Pagination 
                  style={{padding: '60px 0'}} 
                  onChange={this.changePage} 
                  pageSize={this.state.pageSize} 
                  current={this.state.currentPage} 
                  total={this.state.paginationTotal} />
                </div>
          </div>
          <Footer />
          </div>
        );
    }
}
 
export default withRouter(Catalogo);