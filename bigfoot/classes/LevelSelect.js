window.LevelSelect = function()
{
	var LevelSelect = function() // init parameters
	{
		this.dragCircle;

		var screenTitle, variables, functions, loops, conditionals, lessonOne, lessonTwo, lessonThree, lessonFour;


		this.loadAssets();
		
	}

	var p = LevelSelect.prototype;

	p.loadAssets = function()
	{

		this.screenTitle = new SpriteNode("img/levelSelect/title.png",1,-1,{width:1920,height:875},{x:browserWidth/2,y:0},1,1,true);
		this.variables = new SpriteNode("img/levelSelect/variables.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true);
		this.functions = new SpriteNode("img/levelSelect/functions.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true);
		this.loops = new SpriteNode("img/levelSelect/loops.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true);
		this.conditionals = new SpriteNode("img/levelSelect/conditionals.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true);
		this.lessonOne = new SpriteNode("img/levelSelect/1.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true);
		this.lessonTwo = new SpriteNode("img/levelSelect/2.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true);
		this.lessonThree = new SpriteNode("img/levelSelect/3.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true);
		this.lessonFour = new SpriteNode("img/levelSelect/4.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true);

	}
	p.onloaded = function()
	{
		this.tempHand = new Hand();
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
		//arrays of the topics and lessons for drawing the menu
		var topics = [this.variables,this.functions,this.loops,this.conditionals]; 
		var lessons = [this.lessonOne,this.lessonTwo,this.lessonThree,this.lessonFour];
		
		//set variable zeros 
		var tpx = 0;
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;

		for(var i in topics)
		{

			tpx = tpx + 200;
			tpy = 200;

			var topicsPos = getCorrectedPosition({x:tpx,y:tpy});

			topics[i].pos = topicsPos;
			topics[i].draw(ctx);
			
			for(var k in lessons)
			{
				lpy = lpy + tpy + 100;
				lpx = tpx + 55;

				var lessonsPos = getCorrectedPosition({x:lpx,y:lpy});
				
				lessons[k].pos = lessonsPos; 
				lessons[k].draw(ctx);
			
				tpy = 0;
			}

			lpy = 0; //reset the start point of the y value for the lessons 
		}
		//draw hands
		this.screenTitle.draw(ctx);
		this.tempHand.draw(frame,ctx);
	}
	return LevelSelect;
}();