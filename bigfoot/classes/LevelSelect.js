window.LevelSelect = function()
{
	var LevelSelect = function() // init parameters
	{
		this.dragCircle;

		/* MENU ITEMS
			Title 
			Variable 1-4
			Functions 1-4
			Loops 1-4
			Conditionals 1-4
		*/
		
	}

	var p = LevelSelect.prototype;

	p.loadAssets = function()
	{
		//eventually assets will take the place of rects and circs
	}
	p.onloaded = function()
	{
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;
	}
	p.update = function(ctx,frame)
	{
		this.drawUI(frame,ctx);
	}
	p.drawFingers = function(frame,ctx)
	{
		for (var i in frame.hands)
			for (var k in frame.hands[i].fingers)
			{
				var finger = frame.hands[i].fingers[k];
				var pos = finger.stabilizedTipPosition;

				var fx = pos[0];
				var fy = pos[1];
				var fz = pos[2];
						
						
					//draw the finger on screen
				fx = map(fx,-150,150,0,browserWidth);
				fy = map(fy,100,300,0,browserHeight);

				fy = browserHeight - fy;
				ctx.fillStyle = "#E04C4C";
				ctx.beginPath();
				ctx.arc(fx,fy,10,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
			}
			
	}
	p.drawUI = function(frame,ctx)
	{
		//console.log('Im getting called');
		var topics = [1,2,3,4,5];

		console.log(topics.length);
		
		var tpx = 0;
		var tpy = 0;
		for(var i in this.topics)
		{
			console.log('loop function');
			tpx = tpx + 100;
			tpy = 100;
			ctx.fillStyle = "#E04C4C"
			ctx.beginPath();
			ctx.rect(tpx,tpy,100,50);
			ctx.fill();
			ctx.closePath();
			if(i < 4)
			{
				console.log('need to break');
			}
			else
			{
				console.log('keep going');
			}
		}
	}
	return LevelSelect;
}();