import { ChakraProvider, ColorModeScript, Box, CSSReset } from "@chakra-ui/react";
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import {app} from './services/FirebaseSDK'
import { AuthProvider } from "./context/AuthProvider";
import theme from "./themes/Theme";
import './styles/duckie-style.css'

const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

root.render(
  <AuthProvider>
    {/* <React.StrictMode> */}
        <CSSReset />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    {/* </React.StrictMode> */}
  </AuthProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()


