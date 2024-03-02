import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/font.css'
import './styles/color.css'
import './styles/global_styles.css'
import './index.css'
import {store,persistor} from './redux/store.js'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading ={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
)
