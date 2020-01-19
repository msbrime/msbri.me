export default {
  '/': defaultHandler
}

function defaultHandler(){
  fetch('/assets/html/pages/youtube').then(response => {
    console.log(Promise.resolve(response.json()));
  })
}