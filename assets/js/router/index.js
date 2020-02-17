const routeParameterPattern = /:[^\s/]+/g;
const defaultDataResolver = () => {}; 
export default class Router{
  constructor(anchorNode, routeConfig){
    this.currentPath = '';
    this.anchorNode = anchorNode;
    this.routeConfig = routeConfig;
    this.routePaths = Object.keys(this.routeConfig);
  }

  navigate(location){
    const matchedRoute = this.detectRoute(location.pathname);
    const routeConfig = this.routeConfig[matchedRoute.key];
    const dataResolver = routeConfig.dataResolver || defaultDataResolver;
    Promise.resolve(dataResolver(matchedRoute.parameters))
    .then(templateData => {
      this.anchorNode.innerHTML = routeConfig.template(templateData)
      routeConfig.onload(matchedRoute.parameters);
    });
  }

  detectRoute(location){
    const matchedRoute = {
      key: null,
      parameters: null
    };

    for(let i = 0; i < this.routePaths.length; i++){
      const route = this.routePaths[i].replace(routeParameterPattern, '([\\w-]+)');
      route = route + "$";
      if(location.match(route)){
        matchedRoute.key = this.routePaths[i]
        break;
      }
    }
    if(matchedRoute.key){
      matchedRoute.parameters = 
        this.extractParameters(matchedRoute.key, location);
    }
    
    return matchedRoute;
  }

  extractParameters(routePattern, url){
    const routeSegments = routePattern.split('/');
    const urlSegements = url.split('/');
    const parameters = {};

    routeSegments.forEach( (segment,index) => {
      if(segment.match(routeParameterPattern)){
        parameters[segment.replace(/[\[\]:]/g,'')] = 
          urlSegements[index];
      }
    });

    return parameters;
  }

}
