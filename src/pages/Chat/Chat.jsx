import { io } from "socket.io-client";
import "./Chat.css";
import ChatService from "../../services/chat.service";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/chat/conversation";
import Message from "../../components/chat/message";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as timeago from 'timeago.js';


const API_URL = process.env.REACT_APP_URL;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export default function Chat() {
  var messageContainer = document.getElementById("message-container");
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState([null]);
  const [currentMessage, setCurrentMessage] = useState([{own : true, text : "....", createdAt: "2021-12-07T15:17:20.198+00:00"}, {own : false, text : "....", createdAt: "2021-12-07T15:17:20.198+00:00"}]);
  const scrollRef = useRef();
  // if(currentMessage == null){
  //   currentMessage = [{own : true, text : "true", createdAt: "2021-12-07T15:17:20.198+00:00"}, {own : false, text : "false", createdAt: "2021-12-07T15:17:20.198+00:00"}]
  // }


  const socket = io('http://localhost:3002');
  var id;
  var message1;

  
  //send and receive user
  socket.on("receive-message", (message) => {
    message1 = "received: " + message;
    appendMessage(message1);
    console.log("message1: :", message1);

    // const info = await ChatService.getUserInfor()
    // const messages = await ChatService.getMessage(info.username, currentChat)
    // setCurrentMessage(messages.data)

    ChatService.getUserInfor()
    .then((info) => {
      ChatService.getMessage(info.username, currentChat)
      .then((messages) => {
        console.log("received message: ")
        setCurrentMessage(messages.data)
      })
    })
    socket.emit("confirmReceived", message);
  });

  socket.on("getUsername", (name, message) => {
    ChatService.getUserInfor().then((info) => {
      if (info.username == name) {
        console.log("confirmUsername")
        socket.emit("confirmUsername", socket.id, message);
        ChatService.getUserInfor()
    .then((info) => {
      ChatService.getMessage(info.username, currentChat)
      .then((messages) => {
        console.log("Not confirmUsername")
        console.log("received message: ")
        setCurrentMessage(messages.data)
      })
    })
      } else {
        //socket.emit("sendMessage", socket.id + " fail" + name);
      }
    });
  });

  const send = async (e) => {
    e.preventDefault();
    appendMessage("send: " + e.target.m1.value);
    const info = await ChatService.getUserInfor()
    const save = await ChatService.saveMessage(currentChat, info.username, e.target.m1.value )
    const users = await ChatService.getListMessager(info.username)
    setConversations( users.data)
    const messages = await ChatService.getMessage(info.username, currentChat)
    setCurrentMessage(messages.data)
    socket.emit("sendMessageName", e.target.m1.value, currentChat);
  }

  // function getMessage(e) {
  //   e.preventDefault()
  //   ChatService.getUserInfor()
  //   .then((info) => {
  //     ChatService.getMessage(info.username, e.target.user.value)
  //     .then((user) => {
  //       for(let i = 0; i < user.data.length; i++) {
  //         if(user.data[i].sender == info.username){
  //           appendMessage(info.username + ": " + user.data[i].text)
  //         } else {
  //           appendMessage(e.target.user.value + ": " + user.data[i].text)
  //         }
  //       }
  //     })
  //   })
  // }

  //display user
  function appendMessage(message) {
    // console.log("send");
    // messageContainer = document.getElementById("message-container");
    // const messageElement = document.createElement("div");
    // messageElement.innerText = message;
    // messageContainer.append(messageElement);
  }

  // const getListConv = async () => {
  //   ChatService.getUserInfor()
  //   .then((info) => {
  //     console.log("username: ", info.username)
  //     ChatService.getListMessager(info.username)
  //     .then((users) => {
  //       console.log("v: ", users)
  //       setConversations( users.data)
  //       .then(() => {
  //         console.log("conversation: ", conversations )
  //         console.log("conversation[0]: ", conversations[0] )
  //       })
        
  //       //setCurrentChat(conversations[0])
  //       //console.log("currentChat: ", currentChat )
  //     })
  //   })
  // }

  const getListConv = async () => {
    const info = await ChatService.getUserInfor()

    const users = await ChatService.getListMessager(info.username)

    await setConversations( users.data)

    setCurrentChat(users.data[0])
    const messages = await ChatService.getMessage(info.username, currentChat)


    setCurrentMessage(messages.data)
    console.log("currentMessage: ", currentMessage)
  }

  const sc = async(e) => {
    setCurrentChat(e)
    const info = await ChatService.getUserInfor()
    const messages = await ChatService.getMessage(info.username, e)
    console.log("check: ", messages)
    setCurrentMessage(messages.data)
    console.log(currentMessage)
  }
  
  const socketInit = async() => {
    //display client's ID
  socket.on("connect", () => {
    id = socket.id;
    socket.emit("sendID", id);
  });
  socket.on("idconnect", (id) => {
    message1 = "id: " + id;
    //appendMessage(message1);
    console.log(message1)
  });
  }



  console.log(currentChat);

  useEffect(() => {
    getListConv();
    socketInit();
    //getMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessage]);

  return (
    <div>
      {/* <div id="message-container"></div>
      <form method="get" name="form1" id="form1" onSubmit={send}>
        <input type="text" name="m1"/>
        <button type="submit" form="form1" value="S1">Send Message To</button>
        <input type="text" name="name"/>
      </form>

      <form method="get" name="api" id="api" onSubmit={getUserInfor}>
        <input type="text" name="api"/>
        <button type="submit" form="api" value="S2">user name</button>
      </form>

      <form method="get" name="getListMessager" id="getListMessager" onSubmit={getListMessager}>
        <input type="text" name="message"/>
        <button type="submit" form="getListMessager" value="S3">get list message user</button>
      </form>

      <form method="get" name="getMessage" id="getMessage" onSubmit={getMessage}>
        <input type="text" name="user"/>
        <button type="submit" form="getMessage" value="S3">get message</button>
      </form> */}
      <Topbar />
      <div>
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper" id="conv">
            {conversations.map((e) => (
              <div key={e} onClick= {() => sc(e)} >
                <Conversation name = {e}></Conversation>
              </div>
            ))}
            </div>
            </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              {currentChat ? (
                <>
                  <div id="message-container" className="chatBoxTop">
                  {currentMessage.map((e) => (
                    <div ref={scrollRef}>
                      <Message own = {e.own} name={e.sender} content={e.text} time={timeago.format(e.createdAt)}></Message>
                    </div>
                      
                   ))}
                   
                  </div>
                  <div className="chatBoxBottom">
                    <form method="get" name="form1" id="form1" onSubmit={send}>
                      <input className="chatMessageInput" placeholder="write something" type="text" name="m1" autoComplete="off" />
                      <button className="chatSubmitButton" type="submit" form="form1" value="S1">
                        Send Message
                      </button>
                    </form>
                  </div>
                </>
              ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
              )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}


