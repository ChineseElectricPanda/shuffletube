export default function reducer(state = {
  rehydrated: false
}, action) {
  if(action.type == 'REHYDRATED') {
    return {
      ...state,
      rehydrated: true
    }
  }
  return state;
}