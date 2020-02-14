import 'promise-polyfill/src/polyfill';
import EventManager from "./events/manager";
import Router from './router';
import * as youtubeService from './services/youtube';

let pageBody;

const routeConfig = {
  '/': {
    templatePath: '/assets/html/pages/home',
    onload(){}
  },
  '/youtube':{
    templatePath: '/assets/html/pages/youtube',
    onload(){
      youtubeService.channel().then(channelData => { 
        const youtubePage = createYoutubePage(channelData);
        pageBody.querySelector('.content--youtube>.playlists').replaceWith(youtubePage);
      });
    }
  },
  '/youtube/playlist/:[id]':{
    templatePath: '/assets/html/pages/youtube/playlist',
    onload(parameters){
      youtubeService.playlist(parameters.id).then(playlistData => { 
        console.log(playlistData);
      });
    }
  }
}

function createYoutubePlaylistItem(data){
  return (`
  <div class="playlists--item">
    ${data.thumbnail ?
      `<img src="${data.thumbnail.url}" alt="alt text">` :
      `<img src="https://resources.construx.com/wp-content/uploads/2016/08/video-placeholder-brain-bites.png" alt="alt text">`
    }
    <p>
      <a data-internal-link data-href="/youtube/playlist/${data.id}" target="_blank" href="https://www.youtube.com/channel/UCcBPAtdWxzHC_iRIyajuoFw">
        ${data.title}
      </a>
    </p>
    <p>${data.description}</p>
  </div>
  `);
}

// just creates the playlist items
function createYoutubePage(youtubeData){
  const pageFragment = document.createDocumentFragment();
  const playlistNodeClone = document.querySelector('.content--youtube .playlists').cloneNode();
  const playlistNodes = youtubeData.playlists.map(createYoutubePlaylistItem);
  playlistNodeClone.innerHTML = playlistNodes.join('');
  pageFragment.appendChild(playlistNodeClone);
  return pageFragment;
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
