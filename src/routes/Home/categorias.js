import { Button, Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { BASE_IMG } from "../../utils/api";

const Categories = (props) => {
    return (
      <div className="categorias_main">
        <Link to="/catalogo"><h1>Categorias</h1></Link>
        <Row>
          {props.data.map((d) => (
            <Col key={d.id} xs={24} sm={24} md={12} lg={6}>
              <Link to={`/catalogo/${d.id}`}>
                <Card>
                    <img src={BASE_IMG+d.image} />
                     <h5>{d.name}</h5>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        <div style={{width: '100%', textAlign: 'right', marginTop: 20}}>
          <Button type="primary"><Link to="/catalogo">Ver más</Link></Button>
        </div>
      </div>
    );
}

export default Categories;