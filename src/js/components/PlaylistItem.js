import React from 'react'
import { connect } from 'react-redux'
import Img from 'react-image'

import { getVideoInfo } from '../actions/shuffletube'

@connect(store => {
  return {
    videoInfo: store.videoInfo,
    server: store.server
  }
})
export default class PlaylistItem extends React.Component {
  render() {
    const track = this.props.track;
    if(!this.props.track) {
      return null;
    }
    if(!this.props.videoInfo[track.url]) {
      this.props.dispatch(getVideoInfo(track.url));
      return (
        <div>{track.url}</div>
      )
    } else if(this.props.videoInfo[track.url] == 'PENDING') {
      return (
        <div>{track.url} (Fetching data)</div>
      )
    } else {
      const trackInfo = this.props.videoInfo[track.url];
      return (
        <div style={{height: 100, display: 'table-row'}}>
          <Img style={{display: 'table-cell', padding: 5}} src={trackInfo.thumbnail} />
          <div style={{display: 'table-cell', height: '100%', verticalAlign: 'top'}}>
            <div style={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              padding: 5,
              paddingRight: 8
            }}>
              {trackInfo.title}
            </div>
          </div>
        </div>
      )
    }
  }
}