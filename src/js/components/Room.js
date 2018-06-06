import React from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import QRCode from 'qrcode.react'
import { AutoSizer } from 'react-virtualized'

import Loading from './Loading'
import PlaylistItem from './PlaylistItem'

import { getRoomInfo, addTrack, nextTrack, importYoutubePlaylist } from '../actions/shuffletube'

@connect(store => {
  return {
    room: store.currentRoom,
    currentTrack: store.currentTrack,
    playbackQueue: store.playbackQueue,
    addTrackStatus: store.addTrackStatus,
    importPlaylistStatus: store.importStatus,
    server: store.server
  }
})
export default class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {enablePlayback: false}
  }

  componentDidMount() {
    this.updateRoom();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.nowPlaying == '' && this.props.room.tracks.length > 0) {
      this.setState({nowPlaying: this.props.room.tracks[0]});
    }
    setTimeout(this.updateRoom.bind(this), 1000);
  }

  updateRoom() {
    this.props.dispatch(getRoomInfo(this.props.server, this.props.roomId))
  }

  addTrack() {
    this.props.dispatch(addTrack(this.props.server, this.props.roomId, this.trackUrlInput.value));
  }

  importPlaylist() {
    this.props.dispatch(importYoutubePlaylist(this.props.server, this.props.roomId, this.playlistIdInput.value))
  }

  next(e) {
    this.props.dispatch(nextTrack());
    setTimeout(() => {e.target.playVideo()});
  }

  enablePlayback() {
    this.setState({enablePlayback: true})
  }

  render() {
    if(!this.props.room) {
      return <Loading/>
    }

    return (
      <div style={{display: 'table', height: '100%', width: '100%'}}>
        <div style={{width: 680, display: 'table-cell', padding: 20}}>
          {this.state.enablePlayback ? (
            <div>
              {this.props.currentTrack ? (
                <YouTube
                  videoId={this.props.currentTrack.url}
                  onReady={e =>  e.target.playVideo()}
                  onEnd={this.next.bind(this)}
                  opts={{autoplay: 1}}
                />  
              ) : (
                <h3 style={{fontSize: '1.5rem'}}>
                  Add some tracks to get started
                </h3>
              )}
            </div>
          ) : (
            <a class='waves-effect waves-light btn green' onClick={this.enablePlayback.bind(this)}>
              <i class='material-icons left'>airplay</i>
              Play Playlist
            </a>
          )}
          <div>
            <div style={{display: 'inline-block', width: 150}}>
              <div style={{fontSize: '2rem'}}>{this.props.roomId}</div>
              <QRCode value={window.location.href} size={128} />
            </div>
            <div style={{display: 'inline-block', width: 'calc( 100% - 150px )'}}>
              <div
                class='input-field' style={{display: 'inline-block', width: 'calc( 100% - 44px )'}}>
                <input
                  class={''
                    + (this.props.addTrackStatus == 'ADDED' ? 'valid' : '')
                    + (this.props.addTrackStatus == 'REJECTED' ? 'invalid' : '')}
                  id='track-url-input'
                  type='text'
                  ref={el => this.trackUrlInput = el}
                  />
                <label
                style={{width: '80%'}}
                  for='track-url-input'
                  data-error='Track already in playlist'
                  data-success='Track added'>
                  Add Track
                </label>
              </div>
              <i
                style={{position: 'relative', top: 8, left: 10, color: '#9e9e9e'}}
                class='material-icons'
                onClick={this.addTrack.bind(this)}>
                  send
              </i>
              <div class='progress' style={{visibility: (this.props.addTrackStatus == 'PENDING' ? 'visible' : 'hidden')}}>
                <div class='indeterminate'></div>
              </div>
              <div
                class='input-field' style={{display: 'inline-block', width: 'calc( 100% - 44px )'}}>
                <input
                  class={(typeof this.props.importPlaylistStatus.numResolved == 'number' ? 'valid' : '')}
                  id='playlist-id-input'
                  type='text'
                  ref={el => this.playlistIdInput = el}
                  />
                <label
                  style={{width: '80%'}}
                  for='playlist-id-input'
                  data-success={'Playlist import complete: '
                    + this.props.importPlaylistStatus.numResolved + ' imported, '
                    + this.props.importPlaylistStatus.numRejected + ' failed'}>
                  Import Playlist
                </label>
              </div>
              <i
                style={{position: 'relative', top: 8, left: 10, color: '#9e9e9e'}}
                class='material-icons'
                onClick={this.importPlaylist.bind(this)}>
                  send
              </i>
              <div class='progress' style={{visibility: (this.props.importPlaylistStatus == 'PENDING' ? 'visible' : 'hidden')}}>
                <div class='indeterminate'></div>
              </div>
            </div>
          </div>
        </div>
        <AutoSizer style={{display: 'table-cell', position: 'absolute', top: -15}}>
          {({ height, width }) => (
            <div style={{width: width - 680, height: height, position: 'absolute', top: 15}}>
              <div style={{width: '100%', height: 150}}>
                <div>
                  Now Playing:
                </div>
                <PlaylistItem track={this.props.currentTrack} />
                <div>
                  Coming Up:
                </div>
              </div>
              <div style={{width: '100%', height: height - 177, overflow: 'auto'}}>
                {this.props.playbackQueue.map(track => (<PlaylistItem track={track} key={track.id} />))}
              </div>
            </div>
          )}
        </AutoSizer>
      </div>
    )
  }
}