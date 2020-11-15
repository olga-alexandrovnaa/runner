var Entity = {
    move_x: 0,
    move_y: 570,
    extend: function (extendProto) {
        var object = Object.create(this);
        for (var property in extendProto){
            if(this.hasOwnProperty(property) || typeof object[property] === 'undefined'){
                object[property] = extendProto[property];
            }
        }
        return object;
    }
}

var Player = Entity.extend({
    move_x: 50,
    move_y: 570,
    speed: 1,
    direction: 2,
    draw: function(ctx) {
        spriteManager.drawSprite(ctx,"120",this.move_x,this.move_y ,mapManager.view.x,0);
    }
});

var Bad = Entity.extend({
    move_x: 0,
    move_y: 570,
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "122", mapManager.view.x +this.move_x, this.move_y, 0, 0);
    }
});



