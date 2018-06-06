import axios from 'axios'
import { GOOGLE_API_KEY } from '../constants'

export function getRoomInfo(server, roomId) {
  return {
    type: 'GET_ROOM_INFO',
    payload: axios.get(server + '/api/shuffletube/' + roomId)
  }
}

export function addTrack(server, roomId, url) {
  return {
    type: 'ADD_TRACK',
    payload: axios.post(server + '/api/shuffletube/' + roomId, {url: url})
  }
}

export function createRoom(server) {
  return {
    type: 'CREATE_ROOM',
    payload: axios.post(server + '/api/shuffletube/createRoom')
  }
}

export function nextTrack() {
  return {
    type: 'NEXT_TRACK'
  }
}

export function getVideoInfo(videoId) {
  return {
    type: 'GET_VIDEO_INFO',
    payload: axios.get(
      'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2C+contentDetails&id='
      + videoId + '&key=' + GOOGLE_API_KEY),
    meta: {
      videoId: videoId
    }
  }
}

export function importYoutubePlaylist(server, roomId, playlistId) {

  return {
    type: 'IMPORT_YOUTUBE_PLAYLIST',
    payload:
      getPlaylistPage([], playlistId, '')
        .then(videoIds => {
          // Create promises for adding the videos to the room
          const addVideoPromises = videoIds.map(id => {
            return axios.post(server + '/api/shuffletube/' + roomId, {url: 'https://youtu.be/' + id});
          });

          return Promise.all(addVideoPromises.map(reflect))
            .then(results => {
              return {
                numResolved: results.filter(x => x.status == 'RESOLVED').length,
                numRejected: results.filter(x => x.status == 'REJECTED').length
              }
            })
        })
  }
}

function getPlaylistPage(playlist, playlistId, pageToken) {
  return new Promise(resolve => {
    axios.get(
      'https://content.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId='
      + playlistId + '&pageToken=' + pageToken + '&key=' + GOOGLE_API_KEY)
    .then(res => {
      const newPlaylist = playlist.concat(res.data.items.map(item => item.snippet.resourceId.videoId));
      // Check if there are more pages
      if(res.data.nextPageToken) {
        // Get the next page
        resolve(getPlaylistPage(newPlaylist, playlistId, res.data.nextPageToken));
      } else {
        // Return the playlist
        resolve(newPlaylist);
      }
    })
  })
}

// Promise reflect
// https://stackoverflow.com/a/31424853
function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "RESOLVED" }},
                        function(e){ return {e:e, status: "REJECTED" }});
}