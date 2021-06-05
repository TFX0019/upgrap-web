import { Card, Col, Image, Row, Tag } from "antd"
import { Link } from "react-router-dom"
import { notImage } from "../../images";
import { BASE_IMG } from "../../utils/api";

const Products = (props) => {

    return (
      <div className="product_main">
        <h1>Ultimos Productos</h1>
        <Row style={{width: '100%'}}>
            {props.data.map((d) => (
              <Col style={{padding: 5}} xs={24} sm={12} md={8} lg={6}>
                <Link to={`/product/${d.id}`}>
                  <Card key={d.id} className="card_product">
                  <Tag className="tag_estado">{d.estado}</Tag>
                  <div style={{textAlign: 'center'}}>
                  <div className="container_img">
                    <Image src={BASE_IMG+'products/'+d.photo} preview={false} fallback={notImage} />
                  {/* <img src={BASE_IMG+d.photo} /> */}
                  </div>
                  </div>
                  <h4>{d.name}</h4>
                  <p>
                    {d.description.substring(0, 70)+'...'}
                  </p>
                  <span style={{fontSize: 'small', fontWeight: 700}}>{`${d.pais ? d.pais+', ' : ''} ${d.city ? d.city : ''}`}</span> <br />
                  <Link to={`/product/${d.id}`}>Más Información</Link>
                </Card>
                </Link>
              </Col>
            ))}

        </Row>
      </div>
    );
}

export default Products;