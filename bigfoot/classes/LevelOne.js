window.LevelOne = function()
{
	var LevelOne = function() //takes in all init parameters here
	{
		//gamestates
		this.STATE_CUTSCENE = 0;
		this.STATE_BUILDING = 1;
		this.STATE_RUNNING = 2;

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
		var spotPos = [{x:550,y:980},{x:750,y:980},{x:950,y:980}];

		this.spotsToDrag = [];

		for (var i = 0; i < 3; i++)
		{
			var pos = spotPos[i];
			this.spotsToDrag.push(new DragSpot(pos.x,pos.y,spotSize.width,spotSize.height));
		}

	}

	var p = LevelOne.prototype;

	p.loadAssets = function()
	{
		var lvl1Size = {width:237,height:114};
		var lvl2Size = {width:230,height:128};
		var lvl3Size = {width:231,height:129};

		var lvl1Pos = {x:880,y:500},
		lvl2Pos = {x:880,y:350},
		lvl3Pos = {x:880,y:200};
		
		//var whaleSize = getCorrectedSize({width:350,height:222});
		var whaleSize = {width:350,height:222};

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

		this.whaleSprite = new SpriteNode("img/lvl1/whale_fly.png",323,2,whaleSize,{x:100,y:400},19,17,true);

		this.whaleSprite.play();

		this.lightbg = new SpriteNode("img/lvl1/bg-light.png",1,-1,{width:1920,height:875},{x:0,y:0},1,1,true);
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

	}

	p.update = function(ctx,frame)
	{
		for (var s in this.houseSprites)
		{
			this.houseSprites[s].isOnScreen = false;
		}
		//if (this.state)
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
					obj.isOnScreen = true;
				}
				else
				{
					this.emptyLevels[i].isOnScreen = true;
				}
			}
			else
			{
				this.emptyLevels[i].isOnScreen = true;
			}
		}

		this.lightbg.draw(ctx);
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

		this.whaleSprite.draw(ctx);
		/*for (var i = this.sprites.length - 1; i >= 0; i--) {
			var s = this.sprites[i]

			s.draw(ctx);
		};*/

		
	}

	return LevelOne;
}();