import axios from 'axios'

export function connectToServer(server) {
  return {
    type: 'CONNECT_TO_SERVER',
    payload: axios.get(server + '/api/serverStatus'),
    meta: {
      server: server
    }
  }
}

export function showConnectionModal() {
  return {
    type: 'SHOW_CONNECTION_MODAL'
  }
}

export function hideConnectionModal() {
  return {
    type: 'HIDE_CONNECTION_MODAL'
  }
}