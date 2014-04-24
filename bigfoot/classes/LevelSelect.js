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
		var screenTitle = new Image(); // title for levelSelect
		screenTitle.src = "";
		var variables = new Image(); // variables topic
		variables .src = "";
		var functions = new Image(); // funcitons topic
		functions.src = "";
		var loops = new Image(); // loops topic
		loops.src = "";
		var conditionals = new Image(); // conditionals topic
		conditionals.src = "";
		var lessonOne = new Image(); // lesson one
		lessonOne.src = "";
		var lessonTwo = new Image(); // lesson two
		lessonTwo.src = "";
		var lessonThree = new Image(); // lesson three
		lessonThree.src = "";
		var lessonFour = new Image(); // lesson four
		lessonFour.src = "";
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
		var topics = [1,2,3,4]; // change to hold the topic images for the menu 
		var lessons = [1,2,3,4]; // change to hold the lesson images for the menu

		console.log(topics.length);

		var tpx = 0;
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;


		for(var i in topics)
		{
			//console.log('loop function');
			tpx = tpx + 200;
			tpy = 100;

			//replace this with drawing the topic images
			ctx.fillStyle = "#E04C4C"
			ctx.beginPath();
			ctx.rect(tpx,tpy,70,50);
			ctx.fill();
			ctx.closePath();
			
			for(var k in lessons)
			{
				lpy = lpy + tpy + 100;
				lpx = tpx + 35;
				//replace this with drawing the lesson images
				ctx.fillStyle = "#E04C4C"
				ctx.beginPath();
				ctx.arc(lpx,lpy,10,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();

				tpy = 0;
			}

			lpy = 0;
			
		}
	}
	return LevelSelect;
}();