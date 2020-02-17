import 'promise-polyfill/src/polyfill';
import EventManager from "./events/manager";
import Router from './router';
import * as youtubeService from './services/youtube';
import youtubeIndexTemplate from '../html/pages/youtube/index.hbs';
import youtubePlaylistTemplate from '../html/pages/youtube/playlist/index.hbs';
import homeTemplate from '../html/pages/home/index.hbs';

let pageBody;

const routeConfig = {
  '/': {
    template: homeTemplate,
    onload(template){
    }
  },
  '/youtube':{
    template: youtubeIndexTemplate,
    dataResolver: youtubeService.channel,
    onload(template){
    }
  },
  '/youtube/playlist/:[id]':{
    template: youtubePlaylistTemplate,
    dataResolver: parameters => youtubeService.playlist(parameters.id),
    onload(template){
    }
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
  const anchor = document.querySelector('.content-wrapper');
  const eventManager = new EventManager(pageBody);
  const router = new Router(anchor, routeConfig) 
  installWindowNavigationHook(window,router);
  registerListeners(window, eventManager);
  router.navigate(window.location);
}

((window,document) => {
  window.onload = () => initialize(window,document)
})(window,document);
