import './App.less';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from './routes/Home';
import 'pace-js';
import 'pace-js/themes/green/pace-theme-minimal.css';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Customer from './routes/Customer';
import Catalogo from './routes/catalogo';
import Product from './routes/Product';
import Publish from './routes/Customer/publish';
import EditData from './routes/Customer/EditData';
import CreateProduct from './routes/Customer/CreateProduct';
import Chat from './routes/Customer/Chat';
import LostPassword from './containers/LostPassword';
import EditProduct from './routes/Customer/EditProduct';
import VerifyCode from './containers/VerifyCode';
// import { lazy } from 'react';
// const Product = lazy(() => import('./routes/Product'));

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/home" component={() => <Home />} />
        <Route exact path="/login" component={() => <SignIn />} />
        <Route exact path="/lostpassword" component={() => <LostPassword />} />
        <Route exact path="/register" component={() => <SignUp />} />
        <Route exact path="/customer" component={() => <Customer view={<Publish />} />} />
        <Route exact path="/personal" component={() => <Customer view={<EditData />} />} />
        <Route exact path="/create" component={() => <Customer view={<CreateProduct />} />} />
        <Route exact path="/edit/:id" component={() => <Customer view={<EditProduct />} />} />
        <Route exact path="/chat" component={() => <Chat />} />
        <Route exact path="/chat/:id" component={() => <Chat />} />
        <Route exact path="/catalogo" component={() => <Catalogo />} />
        <Route exact path="/catalogo/:page" component={() => <Catalogo />} />
        <Route exact path="/catalogo/:categorie" component={() => <Catalogo />} />
        <Route exact path="/catalogo/s/:search" component={() => <Catalogo />} />
        <Route exact path="/product/:id" component={() => <Product />} />
        <Route exact path="/verifycode/:code" component={() => <VerifyCode />} />
        <Redirect to="/home" />
      </Switch>
    </Router>
  );
}

export default App;
