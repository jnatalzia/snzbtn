window.LevelSelect = function()
{
	var LevelSelect = function() // init parameters
	{
		this.dragCircle;

		var screenTitle, variables, functions, loops, conditionals, lessonOne, lessonTwo, lessonThree, lessonFour;

		//this.lessonHitBox = {pos:getCorrectedPosition({x: ,y: }),size:getCorrectedSize({x:150,y:150})};

		this.startTimeout = undefined;

		this.loadAssets();
		
	}

	var p = LevelSelect.prototype;

	p.loadAssets = function()
	{
		//pretend i have a 1920x1080 resolution im using to test this

		//change this title to be bigger better becuase it's a little too small atm for the rest of the levels to be able to be clicked comfortably
		this.screenTitle = new SpriteNode("img/levelSelect/title.png",1,-1,{width:1920,height:875},{x:1920/2,y:0},1,1,true);

		this.variables = new SpriteNode("img/levelSelect/variables.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.functions = new SpriteNode("img/levelSelect/functions.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.loops = new SpriteNode("img/levelSelect/loops.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});
		this.conditionals = new SpriteNode("img/levelSelect/conditionals.png",1,-1,{width:200,height:80},{x:0,y:0},1,1,true,{width:300,height:120});

		this.lessonOne = new SpriteNode("img/levelSelect/1.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonTwo = new SpriteNode("img/levelSelect/2.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonThree = new SpriteNode("img/levelSelect/3.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});
		this.lessonFour = new SpriteNode("img/levelSelect/4.png",1,-1,{width:80,height:80},{x:0,y:0},1,1,true,{width:150,height:150});

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
		this.nextLevel(frame,ctx);
	}
	p.drawFingers = function(frame,ctx)
	{
			
	}
	p.nextLevel = function(frame,ctx)
	{
		//console.log(this.tempHand);
		if(frame.hands[0])
		{
			var hand = frame.hands[0];
			var x = hand.palmPosition[0];
			var y = hand.palmPosition[1];

			var handX = map(x,-150,150,0,browserWidth);
			var handY = map(y,100,300,browserHeight,0);

			
			//console.log(handX);
			//console.log(handY);

			if(hand.fingers.length == 1)
			{
				//console.log(hand.fingers.length);

				var f = hand.palmPosition;
				var fpos = f;

				var x = fpos[0];
				var y = fpos[1];
				//console.log(hand);

				var fx = map(x,-150,150,0,browserWidth) - 15;
				var fy = map(y,100,300,browserHeight,0) - 45;

				var lhb = this.lessonHitBox; // lessonHitBox still needs to be defined as an object
				// this object should reflect the lesson level

				if(fx > lhb.pos.x && fx < lhb.pos.x + lhb.size.width &&
					fy > lhb.pos.y && fy < lhb.pos.y + lhb.size.height)
				{
					//still need timeout and interaction here
				}

			}
		}
	}
	p.drawUI = function(frame,ctx)
	{
		//arrays of the topics and lessons for drawing the menu
		var topics = [this.variables,this.functions,this.loops,this.conditionals]; 
		var lessons = [this.lessonOne,this.lessonTwo,this.lessonThree,this.lessonFour];
		
		//set variable zeros ------ set for the correct screen resolution  currently 1920x1080
		var tpx = 192; //sets zero for the starting topic x value 1920/2 = 192 ...not sure how to responsively scale this yet
		var tpy = 0;
		var lpx = 0;
		var lpy = 0;

		for(var i in topics)
		{

			tpx = tpx + 300;
			tpy = 200;

			var topicsPos = getCorrectedPosition({x:tpx,y:tpy});

			topics[i].pos = topicsPos;
			topics[i].draw(ctx);
			
			for(var k in lessons)
			{
				lpy = lpy + tpy + 160;
				lpx = tpx + 80;

				var lessonsPos = getCorrectedPosition({x:lpx,y:lpy});
				
				lessons[k].pos = lessonsPos; 
				lessons[k].draw(ctx);
			
				tpy = 0;
			}

			lpy = 0; //reset the start point of the y value for the lessons lists
		}
		//draw hands and screen title
		this.screenTitle.draw(ctx);
		this.tempHand.draw(frame,ctx);

	}
	return LevelSelect;
}();