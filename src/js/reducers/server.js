import isElectron from 'is-electron'

export default function reducer(state = {
  server: '',
  lastServerConnected: '',
  connectionStatus: (isElectron() ? 'UNCONNECTED' : 'CONNECTED'),
  showConnectionModal: isElectron()
}, action)  {
  switch(action.type) {
    case 'CONNECT_TO_SERVER_PENDING': {
      return {...state, connectionStatus: 'PENDING'}
    }
    case 'CONNECT_TO_SERVER_REJECTED': {
      return {...state, connectionStatus: 'FAILED'}
    }
    case 'CONNECT_TO_SERVER_FULFILLED': {
      return {
        ...state,
        connectionStatus: 'CONNECTED',
        server: action.meta.server,
        lastServerConnected: action.meta.server
      }
    }
    case 'SHOW_CONNECTION_MODAL': {
      return {...state, showConnectionModal: true}
    }
    case 'HIDE_CONNECTION_MODAL': {
      return {...state, showConnectionModal: false}
    }
  }
  return state;
}