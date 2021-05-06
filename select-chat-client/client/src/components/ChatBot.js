import React, {Component} from 'react';
import {Launcher} from 'react-chat-window';

export default class ChatBot extends Component {
 
    constructor(props) {
      super(props);
      this.state = {
        messageList: []
      };
    }
   
    onMessageWasSent = (message) => {
        console.log("Message was sent", message);
        this.setState({
            messageList: [...this.state.messageList, message]
        })
        this._sendMessage(message.data.text);
    }
   
    sendMessage = (text) => {
        console.log(text)
      if (text.length > 0) {
          console.log("Sending message to dialogflow: ", text)
        this.setState({
          messageList: [...this.state.messageList, {
            author: 'them',
            type: 'text',
            data: { text }
          }]
        })
      }
    }
   
    render = () => 
      <div>
        <Launcher
          agentProfile={{
            teamName: 'SC+ Chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
          }}
          onMessageWasSent={this._onMessageWasSent}
          messageList={this.state.messageList}
          showEmoji
        />
      </div>
}