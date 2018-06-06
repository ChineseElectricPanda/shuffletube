export default function reducer(state = {
  createRoomStatus: 'NOT_CREATED',
  currentRoomStatus: 'NOT_JOINED',
  currentRoom: null,
  playbackQueue: [],
  currentTrack: null,
  videoInfo: {},
  addTrackStatus: 'NOT_ADDED',
  importStatus: 'NONE'
}, action) {
  switch(action.type) {
    case 'GET_ROOM_INFO_PENDING': {
      return {
        ...state,
        currentRoomStatus: 'PENDING'
      }
    }
    case 'GET_ROOM_INFO_FULFILLED': {
      let playbackQueue = [];
      const oldRoom = state.currentRoom;
      const newRoom = action.payload.data;
      // If the room was changed or if the first track was just added, shuffle the tracks and set it as the playback queue
      if(!oldRoom || oldRoom.id != newRoom.id || (!state.currentTrack && newRoom.tracks.length > 0)) {
        // Set the queue as the track list and shuffle it
        playbackQueue = newRoom.tracks;
        shuffle(playbackQueue);
        // Pop the first one off as the current track
        return {
          ...state,
          currentRoomStatus: 'JOINED',
          currentRoom: newRoom,
          currentTrack: playbackQueue[0],
          playbackQueue: playbackQueue.slice(1)
        }
      }

      // If the tracklist was changed, add any new tracks to the playabck queue at a random position
      // (Assume for now that tracks are only added, not removed)
      if(oldRoom.tracks.length != newRoom.tracks.length) {
        // The new tracks will be the additional ones at the end of the array
        const newTracks = newRoom.tracks.slice(oldRoom.tracks.length - newRoom.tracks.length);
        const newQueue = state.playbackQueue.slice(0);
        newTracks.forEach(newTrack => {
          newQueue.splice(Math.floor(Math.random() * (newQueue.length + 1)), 0, newTrack);
        });
        return {
          ...state,
          currentRoomStatus: 'JOINED',
          currentRoom: action.payload.data,
          playbackQueue: newQueue
        }
      }

      return {
        ...state,
        currentRoomStatus: 'JOINED',
        currentRoom: action.payload.data
      }
    }
    case 'GET_ROOM_INFO_REJECTED': {
      return {
        ...state,
        currentRoomStatus: 'REJECTED'
      }
    }

    case 'CREATE_ROOM_PENDING': {
      return {
        ...state,
        createRoomStatus: 'PENDING'
      }
    }
    case 'CREATE_ROOM_FULFILLED': {
      return { 
        ...state,
        currentRoomStatus: 'JOINED',
        createRoomStatus: {created: action.payload.data}

      }
    }

    case 'GET_VIDEO_INFO_PENDING': {
      return {
        ...state, 
        videoInfo: {
          ...state.videoInfo,
          [action.meta.videoId]: 'PENDING'
        }
      }
    }
    case 'GET_VIDEO_INFO_FULFILLED': {
      return {
        ...state,
        videoInfo: {
          ...state.videoInfo,
          [action.payload.data.items[0].id]: {
            title: action.payload.data.items[0].snippet.title,
            thumbnail: action.payload.data.items[0].snippet.thumbnails.default.url,
            duration: action.payload.data.items[0].contentDetails.duration
          }
        }
      }
    }

    case 'NEXT_TRACK': {
      let playbackQueue = state.playbackQueue;
      if(playbackQueue.length == 0) {
        playbackQueue = state.currentRoom.tracks;
        shuffle(playbackQueue);
      }
      return {
        ...state,
        playbackQueue: playbackQueue.slice(1),
        currentTrack: playbackQueue[0]
      }
    }

    case 'ADD_TRACK_PENDING': {
      return {
        ...state,
        addTrackStatus: 'PENDING'
      }
    }
    case 'ADD_TRACK_FULFILLED': {
      return {
        ...state,
        addTrackStatus: 'ADDED'
      }
    }
    case 'ADD_TRACK_REJECTED': {
      return {
        ...state,
        addTrackStatus: 'REJECTED'
      }
    }

    case 'IMPORT_YOUTUBE_PLAYLIST_PENDING': {
      return {
        ...state,
        importStatus: 'PENDING'
      }
    }
    case 'IMPORT_YOUTUBE_PLAYLIST_FULFILLED': {
      return {
        ...state,
        importStatus: action.payload
      }
    }
  }
  return state;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * https://stackoverflow.com/a/6274381
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}