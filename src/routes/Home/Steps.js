import { Col, Row, Grid } from "antd"
const {useBreakpoint} = Grid;

const StepsPublish = () => {
    const screens = useBreakpoint();
    return (
        <div className="steps_main">
            <h1>Pasos para publicar</h1>
            {screens.md === true ?             <Row>
                <Col style={{borderRight: '1px solid #ccc'}} xs={24} sm={24} md={8} lg={8}>
                    <h2>Registrarme</h2>
                    <p>Regístrate para publicar</p>
                </Col>
                <Col style={{borderRight: '1px solid #ccc'}} xs={24} sm={24} md={8} lg={8}>
                    <h2>Crea una publicación</h2>
                    <p>Publica tu producto</p>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <h2>Negocia</h2>
                    <p>Recibe solicitudes</p>
                </Col>
            </Row> : 
                        <Row>
                        <Col style={{marginTop: 20, borderBottom: '1px solid #ccc'}} xs={24} sm={24} md={8} lg={8}>
                            <h2>Registrarme</h2>
                            <p>Regístrate para publicar</p>
                        </Col>
                        <Col style={{marginTop: 20, borderBottom: '1px solid #ccc'}} xs={24} sm={24} md={8} lg={8}>
                            <h2>Crea una publicación</h2>
                            <p>Publica tu producto</p>
                        </Col>
                        <Col style={{marginTop: 20}} xs={24} sm={24} md={8} lg={8}>
                            <h2>Negocia</h2>
                            <p>Recibe solicitudes</p>
                        </Col>
                    </Row>}

        </div>
    )
}

export default StepsPublish;