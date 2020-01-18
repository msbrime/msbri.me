((window,document) => {
  window.onload = function(){
    document.querySelector("#toggle")
    .addEventListener("change",function(){
        document.querySelector("body").classList.toggle("light");
    });
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", () => {
      console.log(oReq.response);
    });
    oReq.open("GET", "/api/youtube/channel");
    oReq.send();
  }
})(window,document);