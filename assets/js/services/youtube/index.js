import 'whatwg-fetch';

const BASE_URL = 'http://localhost:5001/self-service-20691/us-central1/api/api/youtube';

export function channel(){
  // return fetch(`${BASE_URL}/channel`).then(response => {
  //   return Promise.resolve(response.json());
  // });
  return Promise.resolve({
    "channel": {
      "id": "UCcBPAtdWxzHC_iRIyajuoFw",
      "title": "Salis The Creator",
      "description": "",
      "thumbnail": {
        "url": "https://yt3.ggpht.com/a/AGF-l7_mZf2y9BwnJPwb3PJLDqX1lMCJOOQsATfBoQ=s800-c-k-c0xffffffff-no-rj-mo",
        "width": 800,
        "height": 800
      },
      "uploads": "UUcBPAtdWxzHC_iRIyajuoFw"
    },
    "playlists": [
      {
        "id": "PLte7NF_95S6dNkstb8zbQCuSr_17bbMEz",
        "title": "Ranked Sets Vol. 2",
        "description": "More ranked sets from MK11",
        "thumbnail": {
          "url": "https://i.ytimg.com/vi/oGhCTiRPdMg/sddefault.jpg",
          "width": 640,
          "height": 480
        }
      },
      {
        "id": "PLte7NF_95S6cB07TRRwe5Yyd_Q99Tz61H",
        "title": "Ranked Sets Vol. 1",
        "description": "Ranked sets against some pretty good players in Mortal Kombat 11",
        "thumbnail": {
          "url": "https://i.ytimg.com/vi/ed3dw4Ii-0I/sddefault.jpg",
          "width": 640,
          "height": 480
        }
      },
      {
        "id": "PLte7NF_95S6d8phAxes5sTPehxOqnSUSY",
        "title": "Borderlands 2",
        "description": "",
        "thumbnail": {
          "url": "https://i.ytimg.com/vi/7InLSre-X7A/sddefault.jpg",
          "width": 640,
          "height": 480
        }
      },
      {
        "id": "PLte7NF_95S6cJqDzMHUYRcftbl2Yrf6nw",
        "title": "Devil May Cry 5",
        "description": "",
        "thumbnail": {
          "url": "https://i.ytimg.com/vi/fPmjnRt0jBo/sddefault.jpg",
          "width": 640,
          "height": 480
        }
      },
      {
        "id": "PLte7NF_95S6ce0y_KY4FHKZcHKeDWBdYd",
        "title": "Mortal Kombat",
        "description": "",
        "thumbnail": {
          "url": "https://i.ytimg.com/vi/sN79PyDjEbY/sddefault.jpg",
          "width": 640,
          "height": 480
        }
      }
    ]
  });
}


export function playlist(id){
  return fetch(`${BASE_URL}/playlists/${id}`).then(response => {
    return Promise.resolve(response.json());
  });
}