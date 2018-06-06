import server from './server'
import shuffletube from './shuffletube'
import rehydrate from './rehydrate'

function reduceReducers(...reducers) {
  return (state, action) => {
    return reducers.reduce((prev, reducer) => {
      return {
        ...reducer(undefined, {}),
        ...prev,
        ...reducer({
          ...reducer(undefined, {}),
          ...prev
        }, action)
      }
    }, state)
  }
}

// Order *might* matter for some things here
// if multiple reducers act on the same event
const reducer = reduceReducers(
  server,
  shuffletube,
  rehydrate
)

export default reducer