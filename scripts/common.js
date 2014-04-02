var common = {};

common.banner = function(text){
  return m("section.banner", [
    m("div", {class:"row"}, [
      // 
      m("div", {class: "columns medium-12"}, [
        m("h1", text)
      ])
    ])
  ]);
}

common.formSection = function(icon, content, help, i){
  var alternate = function(i){
    if(i % 2 == 1){
      return "alt";
    } else {
      return "";
    }
  }
  return m("section", {"class": alternate(i)}, [
    m("div.row", [
      m("div.columns.medium-2", [
        m("i.fa.fa-5x.fa-fw", {"class": icon})
      ]),
      m("div.columns.medium-7", content),
      m("div.columns.medium-3", [m("p", help)])
    ])
  ])
}

common.tabs = function(arr){
  return m("dl.tabs[data-tab]", [
    arr.map(function(item, i){
      var setActive = function(i){
        if(i == 0){
          return "active";
        } else {
          return "";
        }
      };
      return m("dd", {class: setActive(i)}, [
        m("a", item.label)
      ]);
    })
  ])
}

common.renderString = function(str){
  if(str){
    return m("span", str);
  } else {
    return m("span.label.alert", "Missing Data");
  }
}

common.renderObj = function(obj){
  if(_.isEmpty(obj)){
    return m("span.label.alert", "Missing Data");
  } else {
    return _.chain(obj)
      .pairs()
      .filter(function(entry){
        return entry[1];
      })
      .map(function(entry){
        return m("div", [m("h5", entry[0]), m("p", entry[1])]);
      })
      .value();
  }
}