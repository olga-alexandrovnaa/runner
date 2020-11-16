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
    protection: false,
    draw: function(ctx) {
        spriteManager.drawSprite(ctx,"120",this.move_x,this.move_y ,mapManager.view.x,0, 1.5);
    }
});

var Bad = Entity.extend({
    move_x: 0,
    move_y: 570,
    symb: "122",
    getBad: function (){
        let arr = ["119","121","122","123","145","150","156","116","118"];
        return arr[Math.floor(Math.random() * (arr.length - 1))];
    },
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.symb, mapManager.view.x +this.move_x, this.move_y, 0, 0, 1.5);
    }
});

var Bonus = Entity.extend({
    move_x: 0,
    move_y: 470,
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "168", mapManager.view.x +this.move_x, this.move_y, 0, 0, 0.8);
    }
});



