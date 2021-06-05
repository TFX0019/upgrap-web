import { Button, Input, Space, Grid, Menu as MenuA, Badge } from "antd"
import { Link, withRouter } from "react-router-dom"
import {FbIcon, InstagramIcon, Logo, TiktoIcon, TwitterIcon} from '../images'
import Cookies from 'js-cookie'
import {useCallback, useEffect, useState} from "react"
import { MenuOutlined, WechatOutlined, HomeOutlined, LogoutOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import notification from '../sounds/notification.ogg';
import io from 'socket.io-client';
import { getDataById, opt2 } from "../utils/api"
// import News from "./AlertasWeb"
// import tiktok from '../images/tiktok.svg';
// import fb from '../images/fb2.svg';
// import instagram from '../images/instagram.svg';
// import twitter from '../images/twitter.svg';


const {useBreakpoint} = Grid;
const { SubMenu } = MenuA;

const Menu = (props) => {
    const screens = useBreakpoint();
    const [user, setUser] = useState();
    const [dot, setDot] = useState(false);
    const [menuMovil, setMenuMovil] = useState(false);
    const [chatList, setChatList] = useState([]);
    // const socket = io.connect('https://prueba.upgrap.com');

    useEffect(() => {
        const token = Cookies.get('token');
        const user = JSON.parse(window.localStorage.getItem('user'));
        // getDataById('chatlist/', user.id, opt2()).then(res => {
        //   setChatList(res)
        // })
        // let valid = false;
        // let dataRef = database.ref('messages');
        setUser(token);
        // socket.on('room1', data => {
        //     if(token && window.localStorage.getItem('user')) {
        //         if (parseInt(user.id) === parseInt(data.id_receiver)) {
        //         playNotification();
        //     }
        //     console.log(data)
        //     }
        // })
        // console.log(screens);
        // socket.on('room1', (data) => {
        //   const user = JSON.parse(window.localStorage.getItem('user'));

        //   let chatlist2 = chatList;
        //   chatlist2.forEach((c, i) => {
        //     if(parseInt(c.id_user) === parseInt(data.id_sender)) {
        //       setDot(true)
        //       console.log('ok')
        //     } else {
        //       console.log('err')
        //     }
        //   });
        //   // console.log(arr2);
        //   // let arr = this.state.chats.concat([data])
          
        //   console.log(data)
        // })
    }, [])

    function playNotification() {
        const aud = document.getElementById('audioId');
        aud.play();
    }

    const logout = async () => {
            Cookies.remove('token');
            localStorage.removeItem('user')
            props.history.push('/');
    }
    const shoMenu = async () => {
        setMenuMovil(!menuMovil);
    }
    const toChat = () => {
      props.history.push('/chat');
    }

    const hanlekey = (e) => {
        console.log(e)
        if(e.key === 'logout') {
            logout();
        } else {
            props.history.push(e.key);
        }
    }

    return (
      <>
      {/* <News /> */}
      <div className="menu_prima">
        <audio id="audioId" src={notification} autoPlay={false} loop={false} />
        <div className="c1">
          <Link to="/">
            <img src={Logo} />
          </Link>
          {screens.lg === true &&                     <div  className="rds">
              <a target="blank" href="https://m.facebook.com/upgrap/" className="iconC">
                <FbIcon className="iconR" />
              </a>
              <a target="blank" href="https://www.instagram.com/upgrap/?igshid=qhltjrcnc4zy" className="iconC">
                <InstagramIcon className="iconR" />
              </a>
              <a target="blank" href="https://twitter.com/upgrap_" className="iconC">
                <TwitterIcon className="iconR" />
              </a>
              <a target="blank" href="https://vm.tiktok.com/ZMJ7T7Xbm/" className="iconC">
                <TiktoIcon className="iconR" />
              </a>
            </div>}
        </div>

        {screens.lg === true && <div style={{display: 'flex', alignItems: 'center'}}>
            <Link to="/catalogo">Productos</Link>
            {props.search !== false && (
          <Input type="search" allowClear onKeyDown={props.onKey} onChange={props.onSearch} className="search" placeholder="buscar..." />
        )}
        {props.catalogo !== false && (
          <Input
          allowClear
            onKeyDown={props.onKey}
            value={props.valueSearch}
            onChange={props.onChange}
            className="search"
            placeholder="buscar..."
          />
        )}

            </div>}
            { screens.lg === false && props.search !== false && (
          <Input style={{marginRight: 10}} allowClear type="search" onKeyDown={props.onKey} onChange={props.onSearch} className="search" placeholder="buscar..." />
        )}
        { screens.lg === false && props.catalogo !== false && (
          <Input
          allowClear
          type="search"
          onKeyDown={props.onKey}
          style={{marginRight: 10}}
            value={props.valueSearch}
            onChange={props.onChange}
            className="search"
            placeholder="buscar..."
          />
        )}
        {screens.xs === true || screens.md === false || screens.lg === false ? (
          <div>
            <Button
              onClick={shoMenu}
              type="primary"
              icon={<MenuOutlined />}
            ></Button>
            <div>
              {!user ? (
                <MenuA
                onClick={hanlekey}
                  className={menuMovil === true ? "showMenu" : "menuMovil"}
                  style={{ width: 256 }}
                  defaultSelectedKeys={[window.location.href]}
                  mode="inline"
                >
                  <img src={Logo} width="100" style={{ padding: 20 }} />
                  <MenuA.Item key="/home">Inicio</MenuA.Item>
                  <MenuA.Item key="/catalogo">Productos</MenuA.Item>
                  <MenuA.Item key="/login">Iniciar Sesión</MenuA.Item>
                  <MenuA.Item key="/register">Registrarme</MenuA.Item>
                </MenuA>
              ) : (
                <MenuA
                onClick={hanlekey}
                  className={menuMovil === true ? "showMenu" : "menuMovil"}
                  style={{ width: 256 }}
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["sub1"]}
                  mode="inline"
                >
                  <img src={Logo} width="100" style={{ padding: 20 }} />
                  <MenuA.Item icon={<HomeOutlined />} key="/home">Inicio</MenuA.Item>
                  <MenuA.Item icon={<BookOutlined />} key="/catalogo">Productos</MenuA.Item>
                  <MenuA.Item icon={<UserOutlined />} key="/customer">Mi cuenta</MenuA.Item>
                  <MenuA.Item icon={<WechatOutlined />} key="/chat">Chat</MenuA.Item>
                  <MenuA.Item icon={<LogoutOutlined />} key="logout">Cerrar Sesión</MenuA.Item>
                </MenuA>
              )}
            </div>
          </div>
        ) : !user ? (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Link to="/login">Iniciar sesión</Link>
            <span> | </span>
            <Link to="/register">Registrarme</Link>
          </div>
        ) : (
          <Space align="center">            
            <Button type="primary" style={{ borderRadius: 0 }}>
              <Link to="/customer">Mi Cuenta</Link>
            </Button>
            <Badge dot={dot}>
            <Button size="large" onClick={toChat} icon={<WechatOutlined />} type="link" />
            </Badge>
            <Button type="link" onClick={logout}>
              Cerrar Sesión
            </Button>
          </Space>
        )}
      </div>
      </>
    );
}

export default withRouter(Menu);