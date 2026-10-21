import { render } from 'preact'
import '@fontsource/im-fell-english/400.css'
import '@fontsource/im-fell-english/400-italic.css'
import '@fontsource/im-fell-english-sc/400.css'
import '@fontsource/alegreya-sans/400.css'
import '@fontsource/alegreya-sans/500.css'
import '@fontsource/alegreya-sans/700.css'
import './styles.css'
import { App } from './App.jsx'
import { startUpdater } from './lib/updater.js'

startUpdater()
render(<App />, document.getElementById('app'))
