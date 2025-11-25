// analytics.js
import ReactGA from 'react-ga4'

export const initGA = () => {
  ReactGA.initialize('G-N1TSZPR8SS') // Tu ID
}

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
}

export const logEvent = (category, action, label) => {
  ReactGA.event({ category, action, label })
}