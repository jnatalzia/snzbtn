window.LevelOne = function()
{
	var LevelOne = function() //takes in all init parameters here
	{
		//toolbox vars
		this.debug = false;

		this.previousFrame = null;
		this.paused = false;
		this.pauseOnGesture = false;
		this.browserWidth= 0;
		this.browserHeight=0;
		this.circdi=20;

		this.startDragY = -1;

		this.dragCircle;

		this.STATE_CAN_PINCH = false;
		this.STATE_PINCH = false;
		this.STATE_CAN_ZOOM = false;
		this.STATE_ZOOM = false;
		this.currentMag = 100;

		this.floatingBlocks = [];

		this.STATE_CAN_DRAG = false;
		this.STATE_DRAG = 1;

		//for sin movement;
		this.step = 0;
		//gamestates
		this.toolboxState = 1;

		this.STATE_TOOLBOX_OPEN = 0;
		this.STATE_TOOLBOX_CLOSED= 1;
		this.STATE_TOOLBOX_CLOSING = 2;

		this.gameState = 0;
		this.STATE_WHALE_SCARED = 0;
		this.STATE_BUILDING = 1;
		this.STATE_RUNNING = 2;
		this.STATE_OVER = 3;
		this.WAITING = 4;

		//substates (for helping hands and stuff)
		this.substate = 0;
		this.SUBSTATE_FIRST_OPEN = 1;
		this.SUBSTATE_SECOND_OPEN = 2;
		this.SUBSTATE_BG_TRANSITION = 3;
		this.SUBSTATE_CANT_RUN = 4;
		this.SUBSTATE_FIRST_BLOCK_SELECT = 5;
		this.SUBSTATE_FIRST_BLOCK_SLOT = 6;
		this.SUBSTATE_FIRST_CLOSE = 7;
		this.SUBSTATE_FIRST_LEVEL_SLOTTED = 8;
		this.SUBSTATE_SECOND_LEVEL_SLOTTED = 9;
		this.SUBSTATE_RUN_READY = 10;
		this.SUBSTATE_HOUSE_FALLING = 11;
		this.SUBSTATE_SUCCESS = 12;

		this.PLAY_SONG_PLAYING = false;
		this.BG_SONG_PLAYING = false;


		this.startTimeout = undefined;
		this.resetTimeout = undefined;

		//caption tracker
		this.currentCaption = captions.enemies_coming;

		this.loadAssets();

		//all init logic goes here
		var blockOptions = [
			{
				title:"cancel",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return false;
				}
			},
			{
				title:"glass",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/glassVariable.png';
				}
			},
			{
				title:"metal",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/metalVariable.png';
				}
			},
			{
				title:"wood",
				fillColor:"#000",
				isHighlighted: false,
				onSelect:function()
				{
					//any other stuff
					return 'img/lvl1/woodVariable.png';
				}
			},

		];

		//init variable blocks
		this.blocks = [
			new VariableBlock({x:300,y:200},{width:150,height:150},blockOptions),
			new VariableBlock({x:800,y:200},{width:150,height:150},blockOptions),
			new VariableBlock({x:1300,y:200},{width:150,height:150},blockOptions)
		];

		var spotSize = {width:150,height:150};
		var spotPos = [{x:500,y:980},{x:700,y:980},{x:900,y:980}];

		this.spotsToDrag = [];

		for (var i = 0; i < 3; i++)
		{
			var pos = spotPos[i];
			this.spotsToDrag.push(new DragSpot(pos.x,pos.y,spotSize.width,spotSize.height));
		}

		this.startHitBox = {
			pos:getCorrectedPosition({x:1700,y:890}),
			size:getCorrectedSize({width:175,height:175})
		};
		var bgSong;
		var playSong;
		var beeSfx;
		var zombieSfx;
		var lightningSfx;
	}

	var p = LevelOne.prototype;

	p.loadAssets = function()
	{
		var lvl1Size = {width:490,height:243};
		var lvl2Size = {width:490,height:268};
		var lvl3Size = {width:490,height:267};

		var lvl1Pos = {x:700,y:600},
		lvl2Pos = {x:700,y:350},
		lvl3Pos = {x:700,y:95};
		
		//var whaleSize = getCorrectedSize({width:350,height:222});
		var whaleSize = {width:483,height:313};

		var wood1 = new SpriteNode("img/lvl1/wood_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,true);
		
		var wood2 = new SpriteNode("img/lvl1/wood_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,true);
		
		var wood3 = new SpriteNode("img/lvl1/wood_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,true);

		var metal1 = new SpriteNode("img/lvl1/metal_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,false);
		
		var metal2 = new SpriteNode("img/lvl1/metal_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,false);
		
		var metal3 = new SpriteNode("img/lvl1/metal_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,false);

		var glass1 = new SpriteNode("img/lvl1/glass_LV1.png",1,-1,lvl1Size,lvl1Pos,1,1,false);
		
		var glass2 = new SpriteNode("img/lvl1/glass_LV2.png",1,-1,lvl2Size,lvl2Pos,1,1,false);
		
		var glass3 = new SpriteNode("img/lvl1/glass_LV3.png",1,-1,lvl3Size,lvl3Pos,1,1,false);

		var placeholder1 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl1Size,lvl1Pos,1,1,true),
		placeholder2 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl2Size,lvl2Pos,1,1,true),
		placeholder3 = new SpriteNode('img/lvl1/blank_floor.png',1,-1,lvl3Size,lvl3Pos,1,1,true);

		this.emptyLevels = [placeholder1,placeholder2,placeholder3];

		this.normalWhale = new SpriteNode("img/lvl1/whale_fly.png",162,3,whaleSize,{x:1400,y:400},18,9,true);
		this.talkingWhale = new SpriteNode("img/lvl1/whale_talking.png",161,2,{width:whaleSize.width-1,height:whaleSize.height},{x:1400,y:400},23,7,true);
		this.happyWhale = new SpriteNode("img/lvl1/whale_happy.png",14,2,{width:whaleSize.width-1,height:whaleSize.height-12},{x:1400,y:400},7,2,true);
		this.sadWhale = new SpriteNode("img/lvl1/whale_sad.png",14,2,{width:whaleSize.width,height:whaleSize.height-12},{x:-500,y:400},7,2,true);

		this.whaleSprite = this.normalWhale;

		this.whaleSprite.play();

		this.lightbg = new SpriteNode("img/lvl1/bg-light.png",1,-1,{width:1920,height:875},{x:0,y:0},1,1,true);
		this.darkbg = new SpriteNode("img/lvl1/bg-dark.png",1,-1,{width:1920,height:875},{x:0,y:0},1,1,true);

		//tracks current bg
		this.currentbg = this.lightbg;

		this.houseSprites = {
			bottom_wood:wood1,
			middle_wood:wood2,
			top_wood:wood3,
			bottom_metal:metal1,
			middle_metal:metal2,
			top_metal:metal3,
			bottom_glass:glass1,
			middle_glass:glass2,
			top_glass:glass3,
		};

		//toolbox assets
		this.toolboxTopIMG = new Image();
		this.toolBoxTop = undefined;
		this.toolboxTopIMG.src = "img/toolbox-top.png";

		this.toolboxBottomIMG = new Image();
		this.toolBoxBottom = undefined;
		this.toolboxBottomIMG.src = "img/toolbox-btm.png";

		this.buildBar = new Image();
		this.buildBar.src = "img/wires/buildBar.png";

		this.runBtnActive = new Image();
		this.runBtnActive.src = "img/runBTN_active.png";

		this.runBtnInactive = new Image();
		this.runBtnInactive.src = "img/wires/runBTN_inactive.png";

		this.exitBtn = new Image();
		this.exitBtn.src = "img/wires/exitBTN.png";

		this.arrowIcon = new Image();
		this.arrowIcon.src = "img/wires/arrow.png";

		//text box
		this.textBox = new SpriteNode('img/text-box.png',1,1,{width:1732,height:419},{x:330,y:500},1,1,true,{width:1299,height:314});
		//this.textBox.destSize = {width:1299,height:314};

		//helper grab hand
		this.grabHelper = new SpriteNode('img/lvl1/grab_hand.png',1,1,{width:108,height:102},{x:135,y:920},1,1,true);


		this.bees = [
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-50,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:0,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-30,y:500},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-100,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-50,y:400},49,2,true),
			new SpriteNode('img/lvl1/bee.png',97,1,{width:70,height:95},{x:-80,y:500},49,2,true)
		];
		this.zombies = [
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-125,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:0,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-75,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-225,y:650},32,5,true),
			new SpriteNode('img/lvl1/zombie.png',141,1,{width:124,height:183},{x:-175,y:650},32,5,true)
		];

		var spotPos = [{x:500,y:980},{x:700,y:980},{x:900,y:980}];

		this.emptyBlocks = [
			new SpriteNode('img/lvl1/box1-empty.png',1,1,{width:155,height:155},{x:spotPos[0].x-77,y:spotPos[0].y-77},1,1,true),
			new SpriteNode('img/lvl1/box2-empty.png',1,1,{width:155,height:155},{x:spotPos[1].x-77,y:spotPos[1].y-77},1,1,true),
			new SpriteNode('img/lvl1/box3-empty.png',1,1,{width:155,height:155},{x:spotPos[2].x-77,y:spotPos[2].y-77},1,1,true)
		];

		var numFlames = Math.floor(Math.random()*3) + 4,
		xrange = {start:700,range:330},
		lvl1range = {start:600,range:100},
		lvl2range = {start:350,range:100},
		lvl3range = {start:95,range:100};



		this.lvl1flames = [];
		this.lvl2flames = [];
		this.lvl3flames = [];
		for (var i = 0; i < numFlames;i++)
		{
			var x1 = Math.floor(Math.random()*xrange.range + xrange.start); 
			var x2 = Math.floor(Math.random()*xrange.range + xrange.start); 
			var x3 = Math.floor(Math.random()*xrange.range + xrange.start); 

			var y1 = Math.floor(Math.random()*lvl1range.range + lvl1range.start); 
			var y2 = Math.floor(Math.random()*lvl2range.range + lvl2range.start);
			var y3 = Math.floor(Math.random()*lvl3range.range + lvl3range.start);  

			var ratio = Math.random() * .5 + .5;
			var flameSize1 = {width:140*ratio,height:160*ratio};

			ratio = Math.random() * .5 + .5;
			var flameSize2 = {width:140 * ratio,height:160* ratio};

			ratio = Math.random() * .5 + .5;
			var flameSize3 = {width:140*ratio,height:160*ratio};

			this.lvl1flames.push(new SpriteNode('img/lvl1/fire.png',5,5,{width:140,height:160},{x:x1,y:y1},5,1,true,flameSize1));
			this.lvl2flames.push(new SpriteNode('img/lvl1/fire.png',5,5,{width:140,height:160},{x:x2,y:y2},5,1,true,flameSize2));
			this.lvl3flames.push(new SpriteNode('img/lvl1/fire.png',5,5,{width:140,height:160},{x:x3,y:y3},5,1,true,flameSize3));
		}


		this.ashHouse = new SpriteNode('img/lvl1/ash.png',1,1,{width:490,height:300},{x:700,y:600},1,1,true);
		this.ashHouse.alpha = 0;
//this.ashHouse = 'img/lvl1/ash.png';

		this.successScreen = new SpriteNode('img/lvl1/success.png',1,1,{width:1920,height:1080},{x:0,y:0},1,1,true);
		this.successScreen.alpha = 0;
		

		bgSong = new Audio('cyclone');
		playSong = new Audio('abbey');
		beeSfx = new Audio('bees');
		zombieSfx = new Audio('zombies');
	}
	p.onloaded = function()
	{
		this.browserWidth = window.innerWidth;
		this.browserHeight = window.innerHeight;

  		this.dragCircle = {};
  		this.dragCircle.x = browserWidth/10 - 5;

  		this.dragCircle.y = browserHeight - 50;
  		this.dragCircle.radius = 50;

  		this.tempHand = new Hand();
  		bgSong.loop();
  		this.BG_SONG_PLAYING = true;
  		console.log(this.BG_SONG_PLAYING);
  		if(this.PLAY_SONG_PLAYING == true)
  		{
  			playSong.stop();
  			this.PLAY_SONG_PLAYING = false;
  			console.log(this.PLAY_SONG_PLAYING);
  		}
  		
	}

	p.update = function(ctx,frame)
	{

		if (this.gameState === this.STATE_WHALE_SCARED)
		{
			//move the whale
			var speed = 10;
			var destination = getCorrectedPosition({x:1400,y:400});
			this.whaleSprite = this.sadWhale;


			if (isCloseToDestination(this.whaleSprite.pos,destination))
			{
				var self = this;
				this.gameState = this.WAITING;

				setTimeout(function()
				{
					self.gameState = self.STATE_BUILDING;
					//console.log('working');	
					self.substate = self.SUBSTATE_FIRST_OPEN;

					self.currentCaption = captions.first_open;

					self.whaleSprite = self.talkingWhale;
					self.whaleSprite.play();
				},4000);

				
			}
			else
			{
				var idealVec = getSubtractedVector(this.whaleSprite.pos,destination);
				//arbitrary block speed
				idealVec = getNormalizedVector(idealVec);
				idealVec = getScaledVector(idealVec,speed);

				this.whaleSprite.pos.x += idealVec.x;
				this.whaleSprite.pos.y += idealVec.y;	

			}
		}

		for (var s in this.houseSprites)
		{
			this.houseSprites[s].isOnScreen = false;
		}
		for (var i = 0; i < this.spotsToDrag.length;i++)
		{
			var spot = this.spotsToDrag[i];
			if (spot.slottedBlock != undefined)
			{
				var block = spot.slottedBlock;
				if (block.value != '')
				{
					var level = '';
					switch(i)
					{
						case 0:
							level = 'bottom';
						break;
						case 1:
							level = 'middle';
						break;
						case 2:
							level = 'top';
						break;
					}

					var obj = this.houseSprites[level+'_'+block.value];

					this.emptyLevels[i].isOnScreen = false;
					this.emptyBlocks[i].isOnScreen = false;
					obj.isOnScreen = true;
				}
				else
				{
					this.emptyLevels[i].isOnScreen = true;
					//draw thing on ground
					this.emptyBlocks[i].isOnScreen = true;

				}
			}
			else
			{
				this.emptyLevels[i].isOnScreen = true;
				this.emptyBlocks[i].isOnScreen = true;
			}
		}
		if (this.substate === this.SUBSTATE_BG_TRANSITION)
		{
			if (this.gameState == this.STATE_RUNNING)
			{
				this.darkbg.alpha += .025;
				this.currentbg = this.darkbg;

				//console.log(this.darkbg.alpha);

				if (this.darkbg.alpha >= 1)
				{	
					
					this.substate = -1;
				}

				this.lightbg.draw(ctx);
			}
			else
			{
				this.lightbg.alpha += .025;
				this.currentbg = this.lightbg;

				this.ashHouse.alpha -= .025;

				for (var s in this.houseSprites)
				{
					var obj = this.houseSprites[s];

					obj.alpha += .025;
				}

				if (this.lightbg.alpha >= 1)
				{
					this.substate = -1;

					this.whaleSprite = this.normalWhale;
					this.whaleSprite.alpha = 1;

				}

				
				this.whaleSprite.alpha = 1;

				this.darkbg.draw(ctx);
			}
			
		}
		else if (this.substate === this.SUBSTATE_HOUSE_FALLING)
		{
			var over = false;
			for (var s in this.houseSprites)
			{
				var obj = this.houseSprites[s];
				obj.alpha -=.025;
				if (obj.alpha <= 0) 
					{
						over = true;
						obj.alpha = 0;
					}
				
			}

			this.ashHouse.alpha += .025;

			if (this.ashHouse.alpha >= 1) this.ashHouse.alpha = 1;

			//
			if (over)
			{
				var self = this;
				if (this.resetTimeout == undefined) this.resetTimeout = setTimeout(function(){
					self.substate = self.SUBSTATE_BG_TRANSITION;
					self.lightbg.alpha = 0;
					clearTimeout(self.resetTimeout);
					self.resetTimeout  =undefined;
				},3000);
			}
			
			
		}
		this.currentbg.draw(ctx);
		//all drawing and update logic goes here

		for (var s in this.houseSprites)
		{
			var obj = this.houseSprites[s];

			obj.draw(ctx);
		}
		for (var s in this.emptyLevels)
		{
			this.emptyLevels[s].draw(ctx);
		}
		for (var s in this.emptyBlocks)
		{
			this.emptyBlocks[s].draw(ctx);
		}

		this.ashHouse.draw(ctx);

		if (this.debug) this.drawFingers(frame,ctx);
		this.drawUI(frame,ctx);

		//make whale float
		this.step+=0.04;
        this.whaleSprite.pos.y = this.whaleSprite.initialPos.y +( 5*(Math.sin(this.step)));

		this.whaleSprite.draw(ctx);

		//caption drawing
		if (this.currentCaption != undefined)
		{
			//console.log('running');

			var lines = this.currentCaption.split("\n");
			//console.log(lines);
			var textPos = getCorrectedPosition({x:400,y:600});
			var lineHeight = 30;

			this.textBox.draw(ctx);

			for (var i = 0; i < lines.length;i++)
			{
				ctx.fillStyle = "#FFF";
				ctx.font="30px GothamMedium";
				ctx.textAlign = 'left';

				ctx.fillText(lines[i],textPos.x,textPos.y+(lineHeight*i));
			}
		}
		this.tempHand.draw(frame,ctx);

		this.previousFrame = frame;

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
		//DRAW COMMON UI ELEMENTS
		if (this.startDragY != -1)
		{
			var toolboxTopPos = getCorrectedPosition({x:75,y:10});
			toolboxTopPos.y=this.dragCircle.y;
		}
		else
		{
			var toolboxTopPos = getCorrectedPosition({x:75,y:890});
		}
		
		var toolboxTopSize = getCorrectedSize({width:this.toolboxTopIMG.width,height:this.toolboxTopIMG.height});


		var toolboxBottomPos = getCorrectedPosition({x:75,y:950});

		ctx.fillStyle = "#919191";


		ctx.drawImage(this.toolboxBottomIMG,toolboxBottomPos.x,toolboxBottomPos.y, toolboxTopSize.width, toolboxTopSize.height);
		ctx.drawImage(this.toolboxTopIMG,toolboxTopPos.x,toolboxTopPos.y, toolboxTopSize.width, toolboxTopSize.height);
		


		var stagePos = getCorrectedPosition({x:0,y:0}),
		stageSize = getCorrectedSize({width:1920, height:875});
		ctx.strokeStyle = "#000";
		ctx.strokeRect( stagePos.x,stagePos.y,stageSize.width,stageSize.height);

		var runPos = getCorrectedPosition({x:1700,y:890}),
		runSize = getCorrectedSize({width:175,height:175});

		ctx.drawImage(this.runBtnActive,runPos.x,runPos.y, runSize.width, runSize.height);
		//placeholder toolbar
		//ctx.strokeRect(browserWidth /10 + 100, browserHeight - 150, browserWidth/3*2, 100);

		//actual toolbar
		var buildSize = getCorrectedSize({width:this.buildBar.width,height:this.buildBar.height});
		var buildPos = getCorrectedPosition({x:350, y:880});
		ctx.drawImage(this.buildBar,buildPos.x,buildPos.y,buildSize.width,buildSize.height);

		if (this.debug) ctx.strokeRect(this.startHitBox.pos.x,this.startHitBox.pos.y,this.startHitBox.size.width,this.startHitBox.size.height);


		//draw current blocks
		for (var i in this.spotsToDrag)
		{
			var s = this.spotsToDrag[i];
			var b = s.slottedBlock;

			if (b != undefined)
			{
				/*ctx.fillStyle = "#000";
				ctx.fillRect(s.x-.width/2,s.y-s.height/2,s.width,s.height);*/
				ctx.drawImage(b.image,b.position.x,b.position.y,b.size.width,b.size.height);
			}
		}

		//set dragcircleSize to toolbox size
		this.dragCircle.width = toolboxTopSize.width*2;
		this.dragCircle.height = toolboxTopSize.height*2;

		if (this.gameState === this.STATE_BUILDING)
		{
		//ui
			this.updateToolbox(frame,ctx);
			if (this.substate === this.SUBSTATE_FIRST_OPEN)
			{
				//this.whaleSprite = this.talkingWhale;

				var start_pos = getCorrectedPosition({x:135,y:920});
				var destination = getCorrectedPosition({x:135,y:800});
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
		}
		else if (this.gameState == this.STATE_RUNNING)
		{
			//check for flames
			var draw1 = false,
			draw2 = false,
			draw3 = false;

			var failed = false;

			var done_running = true;

			//move all the bad things
			var zombiespeed = 1.5,
			beespeed = 3;

			var destination = getCorrectedPosition({x:700,y:0});

			for (var i in this.bees)
			{
				var bee = this.bees[i];
				
				if (bee.pos.x >= destination.x - 20)
				{
					//start flames if wrong
					if (this.spotsToDrag[1].slottedBlock.value != "glass")
					{
						draw2 = true;
						failed = true;
					}

				}
				else
				{
					var idealVec = getSubtractedVector(bee.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,beespeed);

					bee.pos.x += idealVec.x;
					//bee.pos.y += idealVec.y;

					//return true;	
					done_running = false;
				}

				bee.draw(ctx);
			}
			for (var i in this.zombies)
			{
				var zombie = this.zombies[i];

				if (zombie.pos.x >= destination.x - 50)
				{
					//start flames if wrong
					if (this.spotsToDrag[0].slottedBlock.value != "wood")
					{
						draw1 = true;
						failed = true;
					}
				}
				else
				{
					var idealVec = getSubtractedVector(zombie.pos,destination);
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,zombiespeed);

					zombie.pos.x += idealVec.x; 
					done_running = false;
				}

				zombie.draw(ctx);
			}
			if (this.spotsToDrag[2].slottedBlock.value != "metal")
			{
				draw3 = true;
				failed = true;
			}

			for (var i = 0; i < this.lvl1flames.length;i++)
			{
				if (draw1) 
					{
						if (this.lvl1flames[i].alpha < 1)
							this.lvl1flames[i].alpha += .1;
						this.lvl1flames[i].draw(ctx);
					}
				if (draw2) 
					{
						if (this.lvl2flames[i].alpha < 1)
							this.lvl2flames[i].alpha += .1;
						this.lvl2flames[i].draw(ctx);
					}
				if (draw3)
					{
						if (this.lvl3flames[i].alpha < 1)
							this.lvl3flames[i].alpha += .1;
						this.lvl3flames[i].draw(ctx);
					}
			}

			if (done_running)
			{
				var self = this;

				if (failed)
				{
					//console.log('fail!');

					self.currentCaption = captions.failure;

					setTimeout(function()
					{
						self.currentCaption = undefined;
						self.whaleSprite = self.normalWhale;
					},4000);

					self.reset();
				}
				else
				{
					this.substate = this.SUBSTATE_SUCCESS;
				}

				
			}

			if (this.substate == this.SUBSTATE_SUCCESS && done_running)
			{
				this.whaleSprite = this.happyWhale;
				if (this.successScreen.alpha < 1)
				{
					this.successScreen.alpha += .0145;
				}
				else
				{
					this.gameState = this.STATE_OVER;
					setTimeout(function()
					{
						//opens up the survey
						window.open("http://google.com",'_blank');
					},5000);
				}
				this.successScreen.draw(ctx);
			}
		}
		else if (this.gameState === this.STATE_OVER)
		{
			this.successScreen.draw(ctx);
		}
		
		/*pinch(frame);
		zoom(frame);*/
	}
	p.reset = function()
	{
		this.substate = this.SUBSTATE_HOUSE_FALLING;
		this.gameState = this.STATE_BUILDING;
		this.whaleSprite.alpha = 1;
	}

	p.updateToolbox = function(frame,ctx)
	{
		if (this.toolboxState === this.STATE_TOOLBOX_CLOSED)
			{
				if (frame.hands[0])
				{
					var hand = frame.hands[0];
					var x = hand.palmPosition[0];
					var y = hand.palmPosition[1];
					//console.log(hand);

					var handX = map(x,-150,150,0,browserWidth);
					var handY = map(y,100,300,browserHeight,0);

					//console.log(handX+", "+handY);

					ctx.fillStyle = "#4CE083";
					ctx.beginPath();
					ctx.arc(handX,handY,20,0,2*Math.PI);
					ctx.fill();
					ctx.closePath();
					//check for placement over pullup
					var c1 = {};
					c1.x = handX;
					c1.y = handY;
					c1.radius = 20;
					if (hand.fingers.length > 0)
					{
						this.startDragY = -1;
						this.dragCircle.y = this.browserHeight - 50;
					}
					if (circlesIntersect(c1,this.dragCircle) && hand.fingers.length <= 0 && this.startDragY == -1)
					{
						console.log("PALM");
						this.startDragY = c1.y;
					}
					if (this.startDragY != -1)
					{
						this.dragCircle.y = c1.y;
						if (this.startDragY - c1.y > 100)
						{
							//console.log("UITHINGSHAPPEN");
							this.openToolbox();
						}
					}

					//test for intersection between one finger and startbtn
					if (hand.fingers.length == 1)
					{
						var f = hand.palmPosition;
						var fpos = f;

						var x = fpos[0];
						var y = fpos[1];
						//console.log(hand);

						var fx = map(x,-150,150,0,browserWidth) - 15;
						var fy = map(y,100,300,browserHeight,0) - 45;

						ctx.fillStyle = "#000";
						ctx.fillRect(fx,fy,10,10);

						var shb = this.startHitBox;


						if (fx > shb.pos.x &&
							fx < shb.pos.x + shb.size.width &&
							fy > shb.pos.y &&
							fy < shb.pos.y + shb.size.height
							)
						{
							//console.log("hover");
							if (this.startTimeout == undefined)
							{
								var self = this;
								this.startTimeout = setTimeout(function()
									{
										self.runCode();
									},2500);
							}
						}
						else
						{
							//cut the timer out
							clearTimeout(this.startTimeout);
							this.startTimeout = undefined;
						}
					}
					else
					{
						clearTimeout(this.startTimeout);
						this.startTimeout = undefined;
					}
					
				}

				if (this.substate == this.SUBSTATE_CANT_RUN)
				{
					//play sound file of whale telling person to slot all three
					//console.log('SLOT ALL THREE DUDE');

				}

				//test
			}
			else if (this.toolboxState === this.STATE_TOOLBOX_OPEN)
			{
				if (this.substate == this.SUBSTATE_FIRST_OPEN)
				{
					this.substate = this.SUBSTATE_FIRST_BLOCK_SELECT;
					this.currentCaption = captions.point_instruction;
				}

				ctx.globalAlpha = .75;
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,this.browserWidth,this.browserHeight);
				ctx.globalAlpha = 1;

				//draw spots to drag

				if (this.floatingBlocks.length == 0)
				{
					this.floatingBlocks = this.blocks;
					//console.log("running");
				}

				for (var i in this.floatingBlocks)
				{
					var b = this.floatingBlocks[i];

					if (this.substate == this.SUBSTATE_FIRST_BLOCK_SELECT)
					{
						//
						if (b.value != '')
						{
							//console.log('b.value');
							this.substate = this.SUBSTATE_FIRST_BLOCK_SLOT;
							//change caption to
							this.currentCaption = captions.drag_instruction;
						}
					}

					if (isCloseToDestination(b.position,b.destination))
					{
						b.isMoving = false;
					}
					else
					{
						b.isMoving = true;
					}
					if (b.isMoving && !b.isSlotted)
					{

						var idealVec = getSubtractedVector(b.position,b.destination);
						//arbitrary block speed
						idealVec = getNormalizedVector(idealVec);
						idealVec = getScaledVector(idealVec,12);

						b.position.x += idealVec.x;
						b.position.y += idealVec.y;
						
					}
					else
					{
						//perlin noise it around;

					}
					//draw it
					b.draw(globalFrame,ctx);
				}

				if (this.previousFrame.fingers.length == 5)
				{
					//retract blocks
					var gestureRecognized = false;
					for (var i in frame.gestures)
					{
						var g = frame.gestures[i];
						if(g.type == "swipe" && !this.gestureRecognized)
						{
							if (g.direction[1] < -.75 && this.substate != this.SUBSTATE_FIRST_BLOCK_SELECT && this.substate != this.SUBSTATE_FIRST_BLOCK_SLOT)
							{
								console.log("CLOSE");
								this.gestureRecognized = true;
								for (var i in this.floatingBlocks)
								{
									var b = this.floatingBlocks[i];
									b.isMoving = true;
									b.destination = b.initialPosition;
									this.toolboxState = this.STATE_TOOLBOX_CLOSING;
								}
							}
							//console.log(g.direction[1]);
						}
					}
					//console.log(frame.gestures);
				}

							//temp array of center locations
				var spotsToDrag = this.spotsToDrag;

				for (var i = spotsToDrag.length - 1; i >= 0; i--) {
					var s = spotsToDrag[i];

					ctx.strokeStyle = "#ff0000";
					ctx.lineWidth = 4;
					ctx.strokeRect(s.position.x - 50,s.position.y - 50,s.size.width,s.size.height);
				};

				//console.log(spotsToDrag);
				this.gestureRecognized = false;
				this.drag(globalFrame,spotsToDrag);

				if (this.substate == this.SUBSTATE_FIRST_BLOCK_SLOT)
				{
					//console.log('running');
					for (var k in spotsToDrag)
					{
						var s = spotsToDrag[k];
						if (s.slottedBlock != undefined)
						{
							this.substate = this.SUBSTATE_FIRST_CLOSE;
							this.currentCaption = captions.close_instruction;
							break;
						}
					}
				}
				//drawFingers(frame);
			}
			//fix this to implement in the STATE_TOOLBOX OPEN
			else if (this.toolboxState == this.STATE_TOOLBOX_CLOSING){
				//console.log('closing');

				ctx.globalAlpha = .75;
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,this.browserWidth,this.browserHeight);
				ctx.globalAlpha = 1;

				this.toolboxState = this.STATE_TOOLBOX_CLOSED;
				//drawFingers(frame);
				var spotsToDrag = this.spotsToDrag;
				if (this.substate == this.SUBSTATE_FIRST_CLOSE)
				{
					this.substate = this.SUBSTATE_FIRST_LEVEL_SLOTTED;
					this.currentCaption = captions.first_slotted;
					this.whaleSprite = this.happyWhale;
					this.whaleSprite.play();

					var self = this;

					setTimeout(function()
					{
						self.currentCaption = captions.bees_coming;
						self.whaleSprite = self.sadWhale;
						self.whaleSprite.play();
					},5000);
				}
				
				
				else if (this.substate == this.SUBSTATE_FIRST_LEVEL_SLOTTED)
				{
					var count = 0;
					for (var k in spotsToDrag)
					{
						var s = spotsToDrag[k];
						if (s.slottedBlock != undefined)
						{
							count++;
						}
					}
					if (count >= 2)
					{
						this.substate = this.SUBSTATE_SECOND_LEVEL_SLOTTED;
						this.currentCaption = captions.second_slotted;
					}
					console.log(count);
				}
				else if (this.substate == this.SUBSTATE_SECOND_LEVEL_SLOTTED)
				{
					var count = 0;
					for (var k in spotsToDrag)
					{
						var s = spotsToDrag[k];
						if (s.slottedBlock != undefined)
						{
							count++;
						}
					}
					if (count >= 3)
					{
						this.substate = this.SUBSTATE_RUN_READY;
						this.currentCaption = captions.run_ready;
						this.whaleSprite = this.happyWhale;
					}
				}

			}
	}
	p.drag = function(frame, spotsToDrag){
		if(frame.hands.length == 1)
		{
			var grab = frame.hands[0];
			//check for a fist or grab
			if(grab.fingers.length == 0)
			{
				var one_finger = true;
				//find the position of the fist
				var grab_position;
				grab_position = grab.palmPosition;

				var grab_positionX = map(grab_position[0], -150, 150,0,browserWidth);
				var grab_positionY = map(grab_position[1], 100, 300, browserHeight,0);

				//test if spot can be filled 
				var spotEmpty = [];
				for (var k = 0; k < spotsToDrag.length; k++)
				{
					var s = spotsToDrag[k];

					if (s.slottedBlock == undefined)
					{
						spotEmpty[k] = true;
					}
					else
						spotEmpty[k] = false;

				}

				for(var i in this.floatingBlocks)
				{
					var b = this.floatingBlocks[i];
					var bx = b.position.x;
					var by = b.position.y;

					if(b.isBeingDragged)
						{	
							b.position.x = grab_positionX - b.size.width/2;
							b.position.y = grab_positionY - b.size.height/2;

							//check for collision with spots to drag
							var distSub = getSubtractedVector(b.position,spotsToDrag[0]);
							var dist = getMagnitude(distSub);

							if (b.value != '')
							{

								var touchingSpots = [];
								for (var k=0; k < spotsToDrag.length;k++)
								{
									var s = spotsToDrag[k];

									var spotSize = s.size;
									var sPos = s.position;
									var sOrigin = {x:sPos.x-spotSize.width/2,y:sPos.y-spotSize.height/2};

									//debugger;

									if(!(b.position.y+b.size.height < sOrigin.y ||
									   b.position.y > sOrigin.y+spotSize.height ||
									   b.position.x > sOrigin.x+spotSize.width ||
									   b.position.x+b.size.width < sOrigin.x
									   ) && (spotEmpty[k] || s.slottedBlock == b))
									{
										//debugger;
										touchingSpots.push(s);
										
									}

								}
								if (touchingSpots.length == 1)
								{
									var spot = touchingSpots[0];
									b.destination = {x:spot.position.x-spot.size.width/2,y:spot.position.y-spot.size.height/2};
									b.position = {x:spot.position.x-spot.size.width/2,y:spot.position.y-spot.size.height/2};
									
									spot.slottedBlock = b;
									//console.log(spot.slottedBlock);
									b.isSlotted = true;
									b.slot = spot;

									//console.log('touching spots = 1');
								}
								else
								{
									//console.log('touchingSpots = 0');
									b.destination = b.initialPosition;
									//console.log('called');
									b.isSlotted = false;
									if (b.slot) b.slot.slottedBlock = undefined;
									//console.log('called');
									b.slot = undefined;
								}
								//console.log(spotsToDrag[k].slottedBlock);
								if (dist > 400)
								{
									b.destination = b.initialPosition;
									//console.log('called');
									b.isSlotted = false;
									if (b.slot)	b.slot.slottedBlock = undefined;
									b.slot = undefined;
								}
							}
					}
					else if(grab_positionX <= bx + 100 && grab_positionX >= bx - 100 && grab_positionY <= by + 100 && grab_positionY >= by - 100)
					{
							//console.log(b);
							var canDrag = true;
							for (var k in this.floatingBlocks)
							{
								var b2 = this.floatingBlocks[k];
								if (b2.isBeingDragged)
								{
									canDrag = false;
								}
							}
							if (canDrag)
								b.isBeingDragged  = true;
					}
						
					
				}
				
			}
			else
			{
				for(var i in this.floatingBlocks)
				{
					if (this.floatingBlocks[i].isBeingDragged)
					{
						var f = this.floatingBlocks[i];
						f.isBeingDragged = false;
						f.isMoving = true;
					}
				}
			}
			
		}
	}

	p.openToolbox = function()
	{
		//console.log(toolboxIMG);

		this.toolboxState = this.STATE_TOOLBOX_OPEN;
	}
	p.runCode = function()
	{
		//check if the program can run
		var canRun = true;

		for (var i in this.spotsToDrag)
		{
			if (this.spotsToDrag[i].slottedBlock == undefined)
			{
				canRun = false;
			}
			else if (this.spotsToDrag[i].slottedBlock.value == "")
			{
				canRun = false;
			}
		}

		if (canRun)
		{

			this.currentCaption = captions.running;

			var self = this;
			setTimeout(function()
			{
				self.currentCaption = undefined;
			},3000);
			this.whaleSprite = this.sadWhale;
			//this.whaleSprite = this.scaredWhale;

			this.gameState = this.STATE_RUNNING;
			this.substate = this.SUBSTATE_BG_TRANSITION;
			this.darkbg.alpha = 0;

			bgSong.stop();
			BG_SONG_PLAYING = false;
			playSong.loop();
			PLAY_SONG_PLAYING = true;

			for (var i = 0; i < this.lvl1flames.length;i++)
			{
				this.lvl1flames[i].alpha = 0;
				this.lvl2flames[i].alpha = 0;
				this.lvl3flames[i].alpha = 0;
			}

			//console.log(this.gameState);
			for (var i in this.bees)
			{
				this.bees[i].play();
				this.bees[i].pos = {x:this.bees[i].initialPos.x,y:this.bees[i].initialPos.y};
				this.bees[i].alpha = 1;
				this.bees[i].frameNumber = Math.floor(Math.random()*97);
				beeSfx.loop();
			}
			for (var i in this.zombies)
			{
				this.zombies[i].play();
				this.zombies[i].pos = {x:this.zombies[i].initialPos.x,y:this.zombies[i].initialPos.y};
				this.zombies[i].alpha = 1;
				this.zombies[i].frameNumber = Math.floor(Math.random()*141);
				zombieSfx.loop()
			}
		}
		else
		{
			this.substate = this.SUBSTATE_CANT_RUN;
			this.currentCaption = captions.run_not_ready;
		}
	}
	/*p.pinch = function(frame){
		STATE_CAN_PINCH = false;
		if(frame.hands.length == 2)
		{
			var h1 = frame.hands[0];
			var h2 = frame.hands[1];

			if(h1.fingers.length == 1 && h2.fingers.length == 1)
			{
				STATE_CAN_PINCH = true;
				gameState = STATE_CAN_PINCH;
				var f1 = frame.fingers[0];
				var f2 = frame.fingers[1];
				f1.x = f1.tipPosition[0];
				f1.y = f1.tipPosition[1];
				f2.x = f2.tipPosition[0];
				f2.y = f2.tipPosition[1];
				var sub = getSubtractedVector(f1,f2);
				var mag = getMagnitude(sub);
				//console.log('Magnitude: '+mag);
				
				if (mag < 100)
				{
					if(currentMag-mag > 0)
					{
						//console.log('pinching');
						STATE_CAN_PINCH = false;
						STATE_PINCH = true;
						gameState = STATE_PINCH;
						currentMag = mag;
						//console.log('currentMag: '+currentMag);
						if (mag < 30)
						{
							//console.log("touching");
							STATE_PINCH = false;
						}
					}
				}
			}
		}
	}
	p.zoom = function(frame){
		if(frame.hands.length == 2)
		{
			var h1 = frame.hands[0];
			var h2 = frame.hands[1];

			if(h1.fingers.length == 1 && h2.fingers.length == 1)
			{
				STATE_CAN_ZOOM = true;
				gameState = STATE_CAN_ZOOM;
				var f1 = frame.fingers[0];
				var f2 = frame.fingers[1];
				f1.x = f1.tipPosition[0];
				f1.y = f1.tipPosition[1];
				f2.x = f2.tipPosition[0];
				f2.y = f2.tipPosition[1];
				var sub = getSubtractedVector(f1,f2);
				var mag = getMagnitude(sub);
				
				if (mag > 30)
				{
					if(currentMag-mag < 0)
					{
						//console.log('zooming');
						STATE_CAN_ZOOM = false;
						STATE_ZOOM = true;
						gameState = STATE_ZOOM;
						currentMag = mag;
						//console.log('currentMag: '+currentMag);
						if (mag > 100)
						{
							//console.log("zoomed");
							STATE_ZOOM = false;
						}
					}
				}
				
				
			}
		}
	}*/

	return LevelOne;
}();