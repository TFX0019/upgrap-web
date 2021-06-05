import { Col, Row, Grid } from "antd"
import { ImgFig1, ImgFig2, ImgTimeLine, Logo } from "../../images"
import logov from '../../images/logov.svg';

const {useBreakpoint} = Grid;

const What = () => {
    const screens = useBreakpoint();
    return (
        <div className="what_main">
            {/* <h1>Qué es upgrap</h1> */}
            <Row justify="center">
                <Col xs={24} sm={24} md={12} lg={12}>
                    {/* <h3>Publica articulos</h3>
                    <p>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.</p>
                     */}
                     {screens.md === true ? 
                     <img width="100%" style={{padding: '13% 25%'}} src={logov} />
                     :  <img width="100%" style={{padding: '10%'}} src={logov} /> }
                    
                </Col>
                {/* {screens.md === true &&              
                <Col style={{textAlign: 'center'}} xs={1} sm={1} md={8} lg={8}>
                    <ImgTimeLine className="linetime" />
                </Col>} */}
                <Col xs={24} sm={24} md={12} lg={12}>
                {/* <ImgFig1 className="figura" /> */}
                <h3 style={{marginTop: '10%'}}>Que es upgrap?</h3>
                    <p>
                    Es una plataforma colaborativa, que conecta personas alrededor del mundo que quieran intercambiar objetos. Tienes algo que no utilizas  y piensas  regalarlo? ...mejor intercambialo por algo que si quieras utilizar! <br /><br />
                    Intercambiar en Upgrap es 100% gratuito. Acuérdate no pagas ni compras nada, solo intercambias!<br /><br />
                    Let’s trade!</p>
                </Col>
            </Row>
        </div>
    )
}

export default What;