import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import Img from 'react-image'

import { createRoom, getRoomInfo } from '../actions/shuffletube'

@connect(store => {
  return {
    createRoomStatus: store.createRoomStatus,
    currentRoomStatus: store.currentRoomStatus,
    currentRoom: store.currentRoom,
    server: store.server
  }
})
export default class Home extends React.Component {
  createRoom() {
    this.props.dispatch(createRoom(this.props.server));
  }

  joinRoom() {
    this.props.dispatch(getRoomInfo(this.props.server, this.roomIdInput.value));
  }

  render() {
    if(this.props.createRoomStatus.created) {
      return (
        <Redirect push to={'/' + this.props.createRoomStatus.created} />
      )
    }

    if(this.props.currentRoomStatus == 'JOINED') {
      return (
        <Redirect push to={'/' + this.props.currentRoom.id} />
      )
    }
    return (
      <div style={{height: '100%', textAlign: 'center', padding: '10%', maxWidth: 800, margin: 'auto'}}>
        <h1>
          Shuffletube
        </h1>
        <Img src='/img/shuffletube-logo.png' style={{width: '30%'}}/>
        <div>
          <div style={{display: 'inline-block', width: '40%', height: 300, padding: '5%'}}>
            {this.props.currentRoomStatus == 'PENDING' ? (
              <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div class='input-field' style={{display: 'inline-block', width: 'calc( 100% - 44px )',}}>
                  <input
                    id='room-id-input'
                    type='text'
                    ref={el => this.roomIdInput = el}
                    />
                  <label for='room-id-input'>Join Room</label>
                </div>
                <i
                  style={{position: 'relative', top: 8, left: 10, color: '#9e9e9e'}}
                  class='material-icons'
                  onClick={this.joinRoom.bind(this)}>
                    send
                </i>
              </div>
            )}
          </div>
          <div style={{display: 'inline', width: 0}}> OR </div>
          <div style={{display: 'inline-block', width: '40%', height: 300}}>
            {this.props.createRoomStatus == 'NOT_CREATED' ? (
              <a class='waves-effect waves-light btn green' onClick={this.createRoom.bind(this)}>
                <i class='material-icons left'>add</i>
                Create Room
              </a>
            ) : (
              <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}