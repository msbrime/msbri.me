export default class Router{
  constructor(routeConfig){
    this.currentPath = '';
    this.routeConfig = routeConfig;
  }

  navigate(location){
    this.routeConfig[location.pathname]();
  }
}
