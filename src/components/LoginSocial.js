import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { addData, opt1 } from '../utils/api';
import Cookies from 'js-cookie'
import { message } from 'antd';
import {GoogleOutlined, FacebookFilled} from '@ant-design/icons';

export const LoginFacebook = () => {
    let history = useHistory()

    const responseFacebook = async (response) => {
        await addData('signinsocial', {name:response.name, email: response.email, userid: response.id, singin_method: 'facebook'}, opt1).then(res => {
          // console.log(res);
          Cookies.set('token', res.token, {expires: 1});
          window.localStorage.setItem('user', JSON.stringify(res.user));
          message.success('Has ingresado con exito. Te redigiras en unos segundos');
          setTimeout(() => {
            // this.setState({loading: false});
            history.push('/customer');
          }, 1000);
        }).catch(err => {
          console.log(err)
          if(err.data.code === 'email/registered') {
            message.error('Su email ya se encuentra registrado', 9);
          } else {
            message.error('Error al registrar')
          }
        });
        
      }

    return (
        <FacebookLogin
        appId="891037061645114"
        autoLoad={false}
        cssClass="my-facebook-button-class"
        icon="fa-facebook"
        textButton=""
        fields="name,email,picture"
        callback={responseFacebook} />
    )
}

export const LoginGoogle = () => {
    let history = useHistory()
    
  const responseGoogle = async (response) => {
    const {profileObj} = response
    console.log(response)
    await addData('signinsocial', {name:profileObj.name, email: profileObj.email, userid: profileObj.googleId, singin_method: 'google'}, opt1).then(res => {
      // console.log(res);
      Cookies.set('token', res.token, {expires: 1});
      window.localStorage.setItem('user', JSON.stringify(res.user));
      message.success('Has ingresado con exito. Te redigiras en unos segundos');
      setTimeout(() => {
        // this.setState({loading: false});
        history.push('/customer');
      }, 1000);
    }).catch(err => {
      console.log(err)
      if(err.data.code === 'email/registered') {
        message.error('Su email ya se encuentra registrado', 9);
      } else {
        message.error('Error al registrar')
      }
      
    });
    // console.log({name:profileObj.name, email: profileObj.email, userid: profileObj.googleId, singin_method: 'google'});
  }

  const failedGoogle = (response) => {
    console.log(response)
  }

    return (
        <GoogleLogin
        clientId="404466753320-8ob9c44f8na5ajcr317p25qv92juvv6e.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onRequest={failedGoogle}
        // scope="profile, email, name"
        render={renderProps => (
          <button className="my-google-button-class" onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <GoogleOutlined />
          </button>
        )}
        // onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    )
}