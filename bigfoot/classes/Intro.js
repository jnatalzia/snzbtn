window.Intro = function()
{
	var Intro = function()
	{
		var openingVideo;
		this.loadAssets()
	}
	var p = LevelOne.prototype;
	p.loadAssets = function()
	{
		openingVideo = new Video(canvas,ctx,'opening');
	}
	p.onloaded = function()
	{
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;
		openingVideo.play();
		if(openingVideo.ended)
		{
			currLevel = new LevelOne();
		}
	}
	p.update = function(ctx,frame)
	{

	}
}