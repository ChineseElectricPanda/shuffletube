import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, compose } from 'redux'

// Redux middleware
import { createLogger } from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import { persistStore, autoRehydrate } from 'redux-persist'

// Redux provider
import { Provider } from 'react-redux'

import { Redirect, Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import reducer from './reducers'

import Loading from './components/Loading'
import VisibleRoute from './components/VisibleRoute'

import Home from './components/Home'
import Room from './components/Room'

import { rehydrated } from './actions/rehydrate'

const middleware = compose(
  autoRehydrate(),
  applyMiddleware(promise(), thunk/*, createLogger()*/)
)

const store = createStore(reducer, middleware);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    persistStore(store, {
      whitelist: []
    }, () => {
      store.dispatch(rehydrated());
      this.forceUpdate();
    });
  }

  render() {
    if(!store.getState().rehydrated) {
      return (
        <Loading/>
      )
    } else {
      return (
        <Provider store={store}>
          <Router>
            {/* Height adjustment reference: https://stackoverflow.com/a/21652935 */}
            <div style={{position: 'relative', cursor: 'default', height: '100%', width: '100%', display: 'table', overflow: 'hidden'}}>
              <section style={{display: 'table-row', height: '100%'}}>
                <div style={{display: 'table-cell', height: '100%'}}>
                  <Route path='/' exact render={() => (<Home/>)} />
                  <Route path='/:roomId' render={({ match }) => (
                    <Room roomId={match.params.roomId}/>
                  )} />
                </div>
              </section>
            </div>
          </Router>
        </Provider>
      )
    }
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));