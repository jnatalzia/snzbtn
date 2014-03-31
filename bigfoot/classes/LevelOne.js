window.LevelOne = function()
{
	var LevelOne = function() //takes in all init parameters here
	{
		//all init logic goes here
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

		var whale = new SpriteNode("img/lvl1/whale_fly.png",323,2,whaleSize,{x:100,y:400},19,17,true);

		whale.play();

		this.lightbg = new SpriteNode("img/lvl1/bg-light.png",1,-1,{width:1880,height:750},{x:20,y:20},1,1,true);

		//array of sprites to use
		this.sprites = [wood1,wood2,wood3,metal1,metal2,metal3,glass1,glass2,glass3,whale];

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
		var spotPos = [{x:550,y:900},{x:750,y:900},{x:950,y:900}];

		/*this.spotsToDrag = [
			{
				x:spotPosOne.x,
				y:spotPosOne.y,
				width:spotSize.width,
				height:spotSize.height,
				slottedBlock:undefined
			},
			{
				x:spotPosTwo.x,
				y:spotPosTwo.y,
				width:spotSize.width,
				height:spotSize.height,
				slottedBlock:undefined
			},
			{
				x:spotPosThree.x,
				y:spotPosThree.y,
				width:spotSize.width,
				height:spotSize.height,
				slottedBlock:undefined
			}
		];*/
		this.spotsToDrag = [];

		for (var i = 0; i < 3; i++)
		{
			var pos = spotPos[i];
			this.spotsToDrag.push(new DragSpot(pos.x,pos.y,spotSize.width,spotSize.height));
		}

	}

	var p = LevelOne.prototype;

	p.update = function(ctx,frame)
	{
		this.lightbg.draw(ctx);
		//all drawing and update logic goes here

		for (var i = this.sprites.length - 1; i >= 0; i--) {
			var s = this.sprites[i]

			s.draw(ctx);
		};

		
	}

	return LevelOne;
}();