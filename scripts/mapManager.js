
var mapManager = {
    mapData: null,
    map_w: 1280,
    tLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 32,y: 32},
    mapSize: {x: 32,y: 32},
    tilesets: [],
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: {x:0, y:0, w: 800, h: 700},


    loadMap(path) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200){
                mapManager.parseMap(request.responseText)
            }
        };
        request.open("GET",path,true);
        request.send()

    },

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth ;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x ;
        this.mapSize.y = this.yCount * this.tSize.y ;

        if (this.mapSize.x > this.view.w || this.mapSize.y > this.view.h) this.moving_map = true;

        for (let i =0; i < this.mapData.tilesets.length; i++){
            var img = new Image();
            img.onload = function () {
                mapManager.imgLoadCount++;
                if( mapManager.imgLoadCount === mapManager.mapData.tilesets.length){
                    mapManager.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth/ mapManager.tSize.x),
                yCount: Math.floor(t.imageheight/ mapManager.tSize.y),
            };
            this.tilesets.push(ts)
        }
        this.jsonLoaded = true;


    },

    draw(ctx){
        //ctx.rect(this.view.x, this.view.y, this.view.w, this.view.h);
        //ctx.fillStyle = "rgba(0,0,0,0.63)";
        //ctx.fill();
        ctx.clearRect(0, 0, mapManager.view.w, mapManager.view.h);

        if(!mapManager.imgLoaded || !mapManager.jsonLoaded){
          setTimeout(function () {
            mapManager.draw(ctx);
          }, 100)
      }else {
          if (this.tLayer === null)
              for (let id = 0; id < this.mapData.layers.length; id ++){
                  var layer = this.mapData.layers[id];
                  if (layer.type === "tilelayer") {
                      this.tLayer = layer; break;
                  }
              }
            if(this.view.x === 1280){
                this.view.x = 0;
            }
          for (let i=0; i < this.tLayer.data.length; i++){
              if(this.tLayer.data[i] !== 0){
                  let tile = this.getTile(this.tLayer.data[i]);
                  let pX = (i % this.xCount) * this.tSize.x ;
                  let pY = Math.floor(i / this.xCount) * this.tSize.y ;
                  if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                      continue;
                  pX -= this.view.x;
                  ctx.drawImage(tile.img, tile.px , tile.py,this.tSize.x,this.tSize.y,pX,pY,this.tSize.x ,this.tSize.y );
              }
          }
          if(this.view.x>480 && this.view.x<1280){
              for (let i=0; i < this.tLayer.data.length; i++){
                  if(this.tLayer.data[i] !== 0){
                      let tile = this.getTile(this.tLayer.data[i]);
                      let dX = (i % this.xCount) * this.tSize.x +  (this.map_w - this.view.x);
                      let pY = Math.floor(i / this.xCount) * this.tSize.y ;
                      ctx.drawImage(tile.img, tile.px , tile.py,this.tSize.x,this.tSize.y,dX,pY,this.tSize.x ,this.tSize.y );
                  }
              }
          }

      }
    },

    getTile(tileIndex){
        var tile= {
            img: null,
            px: 0,
            py: 0
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    getTileset(tileIndex){
        for (var i = mapManager.tilesets.length - 1; i >=0;i--)
            if(mapManager.tilesets[i].firstgid <= tileIndex){
                return mapManager.tilesets[i];
            }
        return null;
    },

    isVisible(x,y,width,height){
        if (x + width < this.view.x || y + height  < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    },

    parseEntities(){
        if(!mapManager.imgLoaded ||!mapManager.jsonLoaded){
            setTimeout(function () {
                mapManager.parseEntities();
            },100)
        }else
            for (let j = 0; j< this.mapData.layers.length; j++)
                if(this.mapData.layers[j].type === 'objectgroup'){
                    var entities = this.mapData.layers[j];
                    for(let i = 0; i < entities.objects.length; i++){
                        let o = entities.objects[i];
                        try{
                            if (o.type === "hero"){
                                let obj = Object.create(gameManager.factory[o.type]);
                                obj.name = o.name;
                                obj.pos_x = o.x;
                                obj.pos_y = o.y;
                                obj.size_x = o.width;
                                obj.size_y = o.height;
                                gameManager.initPlayer(obj);
                            }else{

                            }
                        }catch (ex) {
                            console.log("Ошибка создания " + o.name);
                        }
                    }
                }
    },

    reset(){
        this.mapData = null;
        this.map_w = 1280;
        this.tLayer = null;
        this.xCount= 0;
        this.yCount= 0;
        this.tSize= {x: 64,y: 64};
        this.mapSize= {x: 64,y: 64};
        this.tilesets= [];
        this.imgLoadCount= 0;
        this.imgLoaded= false;
        this.jsonLoaded= false;
        this.view = {x:0, y:0, w: 800, h: 700};
    }

};
