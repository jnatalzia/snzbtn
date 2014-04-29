window.Intro = function()
{
	var Intro = function()
	{
		var openingVideo;
		this.loadAssets();
	}
	var p = Intro.prototype;
	p.loadAssets = function()
	{	
		openingVideo = new Video(canvas,ctx,'opening'); //load the opening video

		var whaleSize = {width:483,height:313};
		this.normalWhale = new SpriteNode("img/lvl1/whale_fly.png",162,3,whaleSize,{x:30,y:720},18,9,true);
		this.happyWhale = new SpriteNode("img/lvl1/whale_happy.png",14,2,{width:whaleSize.width-1,height:whaleSize.height-12},{x:30,y:720},7,2,true);
		this.sadWhale = new SpriteNode("img/lvl1/whale_sad.png",14,2,{width:whaleSize.width,height:whaleSize.height-12},{x:30,y:720},7,2,true);
		this.talkingWhale = new SpriteNode("img/lvl1/whale_talking.png",161,2,{width:whaleSize.width-1,height:whaleSize.height},{x:30,y:720},23,7,true);
		this.whaleSprite = this.normalWhale;

		this.whaleSprite.play();

		this.textBox = new SpriteNode('img/text-box.png',1,1,{width:1732,height:419},{x:565,y:725},1,1,true,{width:1299,height:314});

		this.grabHelper = new SpriteNode('img/lvl1/grab_hand.png',1,1,{width:108,height:102},{x:window.innerWidth/2,y:350},1,1,true);




		this.toolboxTopIMG = new Image();
		this.toolBoxTop = undefined;
		this.toolboxTopIMG.src = "img/toolbox-top.png";

		this.toolboxBottomIMG = new Image();
		this.toolBoxBottom = undefined;
		this.toolboxBottomIMG.src = "img/toolbox-btm.png";
		// block info ----------------------------------------------
		var spotPos = [{x:500,y:980},{x:700,y:980},{x:900,y:980}];
		new SpriteNode('img/lvl1/box1-empty.png',1,1,{width:155,height:155},{x:spotPos[0].x-77,y:spotPos[0].y-77},1,1,true);
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

		/*openingVideo.play();
		openingVideo.addEventListener('ended',function(){
			return('hi');
		});*/
	}
	p.drawUI = function(ctx,frame)
	{
		//draw whale
		this.whaleSprite.draw(ctx);
		
		//draw textbox
		this.textBox.draw(ctx);

		//draw hands
		this.tempHand.draw(frame,ctx);

		//draw helper hand
		if (this.substate === this.SUBSTATE_FIRST_OPEN)
			{
				//this.whaleSprite = this.talkingWhale;

				var start_pos = getCorrectedPosition({x:window.innerWidth/2,y:350});
				var destination = getCorrectedPosition({x:window.innerWidth/2,y:450});
				var speed = 1;
				
				if (isCloseToDestination(this.grabHelper.pos,destination))
				{
					this.grabHelper.alpha -= .05;
					if (this.grabHelper.alpha <= -5)
					{
						this.grabHelper.pos = start_pos;
						this.grabHelper.alpha = 1;
					}
				}
				else
				{
					var idealVec = getSubtractedVector(this.grabHelper.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,speed);

					this.grabHelper.pos.x += idealVec.x;
					this.grabHelper.pos.y += idealVec.y;	
				}

				this.grabHelper.draw(ctx);
			}
	

	//draw the toolbox
	//DRAW COMMON UI ELEMENTS
		var toolboxTopPos = getCorrectedPosition({x:75,y:860});

		//insert toolbox draw code here
		
		
		var toolboxTopSize = getCorrectedSize({width:this.toolboxTopIMG.width,height:this.toolboxTopIMG.height});


		var toolboxBottomPos = getCorrectedPosition({x:75,y:950});

		ctx.fillStyle = "#919191";
		ctx.drawImage(this.toolboxBottomIMG,toolboxBottomPos.x,toolboxBottomPos.y, toolboxTopSize.width, toolboxTopSize.height);
		ctx.drawImage(this.toolboxTopIMG,toolboxTopPos.x,toolboxTopPos.y, toolboxTopSize.width, toolboxTopSize.height);
	}

	p.update = function(ctx,frame)
	{
		this.drawUI(ctx,frame);
	}
	
	return Intro;
}();