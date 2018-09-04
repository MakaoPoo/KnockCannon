let LT = new LoadingText();
let imageSource = {
  ball: "resource/ball.png",
  cannon: "resource/cannon.png",
  leg: "resource/leg.png",
  player: "resource/player.png",
};
var images = {};

$(window).on('load', function() {
  $(window).trigger('resize');
  loadGraph();


  LT.LoadingStart(function() {
    for(let name in imageSource) {
      if(images[name] == null) {
        return false;
      }
    }

    return true;
  });



});

$(window).on('resize', function() {

});

function loadGraph() {
  for(let name in imageSource) {
    let image = new Image();
    image.src = imageSource[name];
    image.onload = function() {
      images[name] = image;
    }
  }
}
