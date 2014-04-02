app.template = function(a, b, c){
  var ctrl, attrs, content;

  if(arguments.length === 2){
    ctrl = arguments[0];
    content = arguments[1];
    attrs = {class: ""};
  } else if (arguments.length === 3){
    ctrl = arguments[0];
    attrs = arguments[1];
    content = arguments[2];
  }

  return m("html", [
    m("head", [
      m("link[href='styles/css/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, [common.navBar(ctrl)].concat(content))
  ])
}