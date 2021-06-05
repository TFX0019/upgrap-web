import { Link } from 'react-router-dom';
import footer from '../images/footer.svg';
import logo from '../images/logob.svg';
import tiktok from '../images/tiktok.svg';
import fb from '../images/fb.svg';
import instagram from '../images/instagram.svg';
import twitter from '../images/twitter.svg';
import { Grid, Select } from 'antd'
import {InstagramOutlined, FacebookOutlined, TwitterOutlined} from '@ant-design/icons'
const {Option}=Select;

const {useBreakpoint}= Grid;

const Footer = () => {
    const screens = useBreakpoint();
    const changeLanguage = (e) => {
        if(e === 'en') {
            window.location.href = 'https://en.upgrap.com/'
        }
    }
    return(
        <footer style={{background: `url(${footer})`}} className="footer_">
            {screens.xs === true || (screens.sm === true && screens.md === false) ?
            <img src={logo} width="45%" /> : <img src={logo} width="15%" />}
            <div style={{marginTop: 20}}>
                <a className="a_footer" target="blank" href="https://m.facebook.com/upgrap/">
                    <img src={fb} />
                </a>
                <a className="a_footer" target="blank" href="https://www.instagram.com/upgrap/?igshid=qhltjrcnc4zy">
                    <img src={instagram} />
                </a>
                <a className="a_footer" target="blank" href="https://twitter.com/upgrap_">
                    <img src={twitter} />
                </a>
                <a className="a_footer" target="blank" href="https://vm.tiktok.com/ZMJ7T7Xbm/">
                    <img src={tiktok} />
                </a>
            </div>
            <p style={{color: "#fff", marginTop: 5, marginBottom: 0, paddingBottom: 0}}><strong>contacto:</strong> <a  style={{color: "#fff"}} href="mailto:support@upgrap.com">support@upgrap.com</a></p>
            <div>
                <Link to="/catalogo">Productos</Link> <span> | </span>
                <Link to="/login">Iniciar sesión</Link> <span> | </span>
                <Link to="/register">Registrarme</Link>
                <Select defaultValue="es" onChange={(e) => changeLanguage(e)} style={{ width: 120 }} bordered={false}>
                    <Option value="es">Español</Option>
                    <Option value="en">Ingles</Option>
                </Select>
            </div>
            <p>Todos los derechos reservados copyright 2020-2021 | Hecho en Peru</p>
        </footer>
    )
}

export default Footer;