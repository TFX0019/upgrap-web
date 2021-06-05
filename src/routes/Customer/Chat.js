import { Button, Card, Col, Input, Row, Menu, Image, Badge } from 'antd';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {UserOutlined, SendOutlined, ArrowLeftOutlined} from '@ant-design/icons'
import Cookies from 'js-cookie';
import MenuP from '../../components/Menu';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { addData, getDataById, opt2 } from '../../utils/api';
import io from 'socket.io-client';


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            message: '',
            customer: null,
            idchat: null,
            user: null,
            customers: [],
            messages: [],
            chatList: [],
            chats: [],
            search: '',
            loading: false,
            chatActive: null
         }
         this.chat = React.createRef();
        //  this.socket = io.connect('http://localhost:4000');
        this.socket = io.connect('https://prueba.upgrap.com');
    }

    async componentDidMount() {
      const token = Cookies.get('token');
      if(!token) {
        this.props.history.push('/login');
      } else {
        const user = JSON.parse(window.localStorage.getItem('user'));
        const chatlist = await getDataById('chatlist/', user.id, opt2());
        let chatlist2 = chatlist.map(c => { return {...c, see: true}})
        console.log(chatlist2)
        this.setState({chatList: chatlist2, customer: user});
        // console.log({chatlist, customer: user});
        this.socket.on('room1', (data) => {
          const user = JSON.parse(window.localStorage.getItem('user'));
          if(data.id_receiver === parseInt(user.id) && data.id_sender === parseInt(this.state.chatActive)) {
            let arr = this.state.chats.concat([data])
            this.setState({chats: arr})
  
            // scroll
            setTimeout(() => { 
              let chat = this.chat.current;
              if(chat) chat.scrollTo({left: 0, top: chat.scrollHeight, behavior: 'smooth'})
            }, 100);
          }
          // let arr2 = chatlist2.map(c => data.chatlist === c.id ? {...c, see: true} : c);
          let chatlist2 = this.state.chatList;
          chatlist2.forEach((c, i) => {
            if(parseInt(c.id_user) === parseInt(data.id_sender)) {
              chatlist2[i].see = true
              console.log('ok')
            } else {
              console.log('err')
            }
          });
          // console.log(arr2);
          // let arr = this.state.chats.concat([data])
          this.setState({chatList: chatlist2})
          console.log(data)
        })
          const {id} = this.props.match.params;
          if(id) {
            this.handleClick(id);
          }
      }

    }

    // componentDidUpdate() {
    //   this.socket.on('room1', (data) => {
    //     const user = JSON.parse(window.localStorage.getItem('user'));
    //     if(data.id_receiver === parseInt(user.id) && data.id_sender === parseInt(this.state.chatActive)) {
    //       let arr = this.state.chats.concat([data])
    //       this.setState({chats: arr})

    //       // scroll
    //       setTimeout(() => { 
    //         let chat = this.chat.current;
    //         if(chat) chat.scrollTo({left: 0, top: chat.scrollHeight, behavior: 'smooth'})
    //       }, 100);
    //     }
    //     // let arr2 = chatlist2.map(c => data.chatlist === c.id ? {...c, see: true} : c);
    //     let chatlist2 = this.state.chatList;
    //     chatlist2.forEach((c, i) => {
    //       if(parseInt(c.id_user) === parseInt(data.id_sender)) {
    //         chatlist2[i].see = true
    //         console.log('ok')
    //       } else {
    //         console.log('err')
    //       }
    //     });
    //     // console.log(arr2);
    //     // let arr = this.state.chats.concat([data])
    //     this.setState({chatList: chatlist2})
    //     console.log(data)
    //   })
    // }

    validateChatList = (data) => {

    }

    handleClick = async (e, id) => {
      console.log(e, id);
      const messages = await getDataById('message/', `${e}/${this.state.customer.id}`, opt2());
      const user = await getDataById('customer/',e, opt2());
      console.log(messages);
      let message = messages[messages.length-1];
      if(message && message.issee === false) {
        let arr = this.state.chatList.map(c => c.id === id ? {...c, see: false} : c)
      this.setState({chats: messages, chatActive: e, user: user[0], chatList: arr, idchat: id})
      } else {
        this.setState({chats: messages, chatActive: e, user: user[0], idchat: id})
      } 
      setTimeout(() => {
        let chat = this.chat.current;
        if(chat) chat.scrollTo({left: 0, top: chat.scrollHeight})
        
      }, 100);
      
    }

    sendMessage = async (file) => {
      const data = {fecha: moment().format('DD MMM YYYY HH:mm:ss'), message: this.state.message, id_sender: this.state.customer.id, id_receiver: parseInt(this.state.chatActive), issee: false, chatlist: this.state.idchat}
      await addData('message', data, opt2()).then(() => {
        let arr = this.state.chats.concat([data]);
        // this.socket.emit('message', data);
        this.setState({chats: arr, message: ''})
        // setTimeout(() => {
          let chat = this.chat.current;
          this.chat.current.scrollTo({left: 0, top: chat.scrollHeight, behavior: 'smooth'})
      })
      // }, 100);
      // console.log(this.chat.current.clientHeight)
      
    }

    sendMessageWithKey = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.sendMessage()
      }
  }

  // uploadImage = async (e) => {
  //   const hide = message.loading('Subiendo imagen');
  //   const storageRef = storage.ref();
  //   let t = this;
  //   const file = e.target.files[0];
  //   var metadata = {
  //       contentType: file.type
  //     };
  //     let uploadTask = storageRef.child('messages/' + file.name).put(file, metadata);
  //     uploadTask.on('state_changed', function(snapshot){
  //       // Observe state change events such as progress, pause, and resume
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       // t.setState({progress})
  //       // console.log('Upload is ' + progress + '% done');
  //     }, function(error) {
  //       // Handle unsuccessful uploads
        
  //       // message.error('Error al subir imagen seleccione de nuevo', 10);
  //       hide.then(() => message.error('Error al subir imagen'))
  //     }, function() {
  //       // Handle successful uploads on complete
  //       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //       uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
  //         t.sendMessage(downloadURL);
  //         hide.then(() => message.success('Imagen se ah subido con exito'))
  //         // t.setState({ imageUrl: downloadURL});
  //       });
  //     });
  // }

  // clickinputFile = () => {
  //   document.getElementById('file').click();
  // }

  //   handleClick = async (e) => {
  //     const uid = Cookies.get('customer');
  //     const customer = await getCustomerById(e.key);
  //     const chatsRef = database.ref('messages');
  //     let cus = [];
  //     chatsRef.on('value', snapshot => {
  //       let arr=[];
  //       const data = snapshot.val();
  //       for(let i in data) {
  //         if((data[i].receiver === uid && data[i].sender === e.key) || (data[i].receiver === e.key && data[i].sender === uid)) {
  //           arr.push({i, ...data[i]});
  //           if(data[i].see === false) {
  //             cus= this.state.chatList.map(c => e.key === c.key ? {...c, see: false} : c)
  //             database.ref('messages').child(i).update({see: true})
  //             this.setState({chatList: cus});
  //           }
  //           // console.log(data[i].key)
  //         }
  //       }
  //       console.log(arr);
  //       this.setState({chatActive: e.key, chats: arr, customer});
  //       setTimeout(() => {
  //         let zone = document.getElementById('chats_zone');
  //         if(data) {
  //           if(data.length <= 0){
  //             zone.scrollBy({top: zone.clientHeight+40, left: 0, behavior: 'smooth'})
  //           }
  //         }
  //       }, 100);
  //     })
  //   }

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
        const {customer, chatList, user} = this.state;
        return (
          <div className="chat_main">
            <Helmet>
              <title>Upgrap | Chat</title>
            </Helmet>
            <MenuP onKey={this.onKey} onSearch={this.onSearch} search={true} catalogo={false} />

            <Button style={{marginTop: 30}} type="link" icon={<ArrowLeftOutlined />}>
              <Link to="/customer">Volver</Link>
            </Button>
            <Card
              bordered={false}
              title={
                user !== null &&
                `${user.name} - ✆ ${user.prefix !== null ? user.prefix : ''}${!user.phone ? '' : user.phone}`
              }
              className="chat_card"
            >
              <Row>
                {/* chat list */}
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Menu
                    
                    style={{ width: "100%", minHeight: "60vh" }}
                    defaultSelectedKeys={[this.state.chatActive]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                  >
                    <Menu.ItemGroup key="sub1" title="Chats">
                      {chatList.length > 0 &&
                        chatList.map((c) => (
                          <Menu.Item
                            onClick={() => this.handleClick(c.idchat, c.id)}
                            icon={<UserOutlined />}
                            key={c.idchat}
                          ><Badge dot={c.see}>
                            {`${c.name}`}
                            </Badge></Menu.Item>
                        ))}
                    </Menu.ItemGroup>
                  </Menu>
                </Col>


                <Col className="col_chat" xs={24} sm={24} md={18} lg={18}>
                  {this.state.chats.length > 0 && (
                    <div ref={this.chat} id="chats_zone" className="zone_messages">
                      {this.state.chats.map((m) =>
                        m.id_sender !== this.state.customer.id ? (
                          <div className="container_left">
                            {m.image ? <Image src={m.image} width={200} />
                            : <div >
                              <p className="mesageTag">{m.message}</p> <br/>
                              <span style={{fontSize: 'small'}}>{moment(m.fecha).startOf('seconds').fromNow()}</span>
                              </div>}
                          </div>
                        ) : (
                          <div className="container_right">
                            {m.image ? (
                              <div className="imgchat"><Image src={m.image} width={200} /></div>
                            ): <div>
                              <p className="messageRight">{m.message}</p> <br/>
                              <span style={{fontSize: 'small'}}>{moment(m.fecha).startOf('seconds').fromNow()}</span>
                              </div>}
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {this.state.chatActive !== null && (
                    <div className="zone_input">
                      <Input
                        onKeyDown={this.sendMessageWithKey}
                        style={{
                          width: "100%",
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                        value={this.state.message}
                        onChange={(e) =>
                          this.setState({ message: e.target.value })
                        }
                      />
                      {/* <label htmlFor="file">
                        <Button
                          onClick={this.clickinputFile}
                          type="link"
                          style={{ marginRight: 10 }}
                          icon={<CameraOutlined />}
                        />
                        <input
                          onChange={this.uploadImage}
                          id="file"
                          type="file"
                          className="inputfile"
                        />
                      </label> */}
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => this.sendMessage(null)}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </div>
        );
    }
}
 
export default withRouter(Chat);