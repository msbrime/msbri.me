import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import EventManager from "./events/manager";
import Router from './router';

let pageBody;
const routeConfig = {
  '/youtube': () => { 
    fetch('/assets/html/pages/youtube').then(response => {
      response.text().then(text => {
        console.log('here')
        pageBody.querySelector('.content-wrapper').innerHTML = text;
      })
    })
  }, 
  '/': () => {
    fetch('/assets/html/pages/home').then(response => {
      response.text().then(text => {
        pageBody.querySelector('.content-wrapper').innerHTML = text;
      })
    })
  }
}

function themeChangeHandler(event){
  pageBody.classList.toggle("light");
}

function registerListeners(window, eventManager){
  eventManager.register("change", "#toggle", themeChangeHandler);
  setUpNavigationLinks(window,eventManager);
}

function setUpNavigationLinks(window, eventManager){
  eventManager.register('click','[data-internal-link]', event => {
    event.preventDefault();
    const route = event.target.getAttribute('data-href');
    window.history.pushState({},'Salis Braimah', route );
    window.dispatchEvent(new Event('popstate'),window);
  })
}

function installWindowNavigationHook(window, router){
  window.addEventListener('popstate',event => {
    router.navigate(window.location);
  });
}

function initialize(window,document){
  pageBody = document.body;
  const eventManager = new EventManager(pageBody);
  const router = new Router(routeConfig) 
  installWindowNavigationHook(window,router);
  registerListeners(window, eventManager);
  router.navigate(window.location);
}

((window,document) => {
  window.onload = () => initialize(window,document)
})(window,document);