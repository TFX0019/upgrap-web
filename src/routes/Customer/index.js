import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Row, Col } from 'antd';
import MenuP from '../../components/Menu';
import {BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter} from 'react-router-dom';

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { getData, getDataById, opt2 } from '../../utils/api';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          customers: [],
          chatlist: [],
          collapsed: false,
          search: ''
         }
    }

    async componentDidMount() {
      const token = Cookies.get('token');
      if(!token) {
        this.props.history.push('/login');
      }

    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };

      onSearch = (e) => {
        this.setState({search: e.target.value});
      }
 
     onKey = (e) => {
         if(e.key === "Enter") {
             e.preventDefault();
             e.stopPropagation();
             this.props.history.push('/catalogo/s/'+this.state.search);
         }
     }

      
    render() { 
        return ( 
            <div style={{paddingTop: '2%'}} className="customer_main">
              <Helmet>
                <title>Upgrap | usuario</title>
              </Helmet>
              <MenuP onKey={this.onKey} onSearch={this.onSearch} search={true} catalogo={false} />
              <Row style={{marginTop: 30}}>
                <Col xs={24} sm={24} md={4} lg={6}>
                <Menu
        onClick={this.handleClick}
        style={{ width: '100%' }}
        defaultSelectedKeys={[window.location.href]}
        mode="inline"
      >
        <Menu.Item key="/customer">
          <Link to="/customer">Publicaciones</Link>
        </Menu.Item>
        <Menu.Item key="/personal">
          <Link to="/personal">Editar datos</Link>
        </Menu.Item>
        <Menu.Item key="/chat">
          <Link to="/chat">Chats</Link>
        </Menu.Item>
      </Menu>
                </Col>
                <Col xs={24} sm={24} md={20} lg={18}>
                  {this.props.view}
                </Col>
              </Row>
               
      {/* <Layout style={{ minHeight: '100vh'}}>
        <Sider style={{minWidth: 300, width: 300, maxWidth: 300}} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" >
              <h1 style={{color: '#fff', padding: 10, fontSize: 30}}>Menu</h1>
          </div>
          <Menu theme="dark" defaultSelectedKeys={[window.location.href]} mode="inline">
            <Menu.Item key="/customer" icon={<PieChartOutlined />}>
              <Link to="/customer">Publicaciones</Link>
            </Menu.Item>
           
            <Menu.Item key="/personal" icon={<DesktopOutlined />}>
              <Link to="/personal">Mis datos</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="Chats">
              {this.state.customers.length > 0 && 
              this.state.customers.map(c => 
                <Menu.Item key={`/chat/${c.key}`}>
                  <Link to={`/chat/${c.key}`}>{c.name}</Link>
                </Menu.Item>)}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ background: '#f0f2f5', padding: '10px 0', height: 84 }} >
          <MenuP search={false} catalogo={false} />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            {this.props.view}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout> */}
            </div>
         );
    }
}
 
export default withRouter(Customer);