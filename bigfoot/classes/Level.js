window.LevelOne = function()
{
	var LevelOne = function() //takes in all init parameters here
	{
		//all init logic goes here

		var wood1 = new Image();
		wood1.src = "img/lvl1/wood_LV1.png";
		var wood2 = new Image();
		wood2.src = "img/lvl1/wood_LV2.png";
		var wood3 = new Image();
		wood3.src = "img/lvl1/wood_LV3.png";

		var metal1 = new Image();
		metal1.src = "img/lvl1/metal_LV1.png";
		var metal2 = new Image();
		metal2.src = "img/lvl1/metal_LV2.png";
		var metal3 = new Image();
		metal3.src = "img/lvl1/metal_LV3.png";

		var glass1 = new Image();
		glass1.src = "img/lvl1/glass_LV1.png";
		var glass2 = new Image();
		glass2.src = "img/lvl1/glass_LV2.png";
		var glass3 = new Image();
		glass3.src = "img/lvl1/glass_LV3.png";

		//array of sprites to use
		this.sprites = [wood1,wood2,wood3,metal1,metal2,metal3,glass1,glass2,glass3];

	}

	var p = LevelOne.prototype;

	p.update = function(ctx)
	{
		//all drawing and update logic goes here

		for (var i = this.sprites.length - 1; i >= 0; i--) {
			var s = this.sprites[i]

			if (s = true)
			{
				ctx.drawImage(s,i+100,500);
			} 
		};
	}

	return LevelOne;
}();