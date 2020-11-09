! function () {
    var Circle = function (x, y) {
        //创建对象
        //以一个圆为对象
        //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
        //this.r是创建圆的半径，参数越大半径越大
        //this._mx,this._my是移动的距离，参数越大移动
        this.x = x;
        this.y = y;
        this.r = Math.random() * 10;
        this._mx = (Math.random() > 0.5) ? Math.random() : -Math.random();
        this._my = (Math.random() > 0.5) ? Math.random() : -Math.random();

    }
    Circle.prototype = {
        constructor: Circle,
        //canvas 画圆和画直线
        //画圆就是正常的用canvas画一个圆
        //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
        drawCircle: function (ctx) {
            ctx.beginPath();
            //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
            ctx.arc(this.x, this.y, this.r, 0, 360)
            ctx.closePath();
            ctx.fillStyle = 'rgba(160, 160, 160, 0.2)';
            ctx.fill();
        },

        drawLine: function (ctx, _circle) {
            let dx = this.x - _circle.x;
            let dy = this.y - _circle.y;
            let d = Math.sqrt(dx * dx + dy * dy)
            if (d < 150) {
                ctx.beginPath();
                //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
                ctx.moveTo(this.x, this.y);   //起始点
                ctx.lineTo(_circle.x, _circle.y);   //终点
                ctx.closePath();
                ctx.strokeStyle = 'rgba(160, 160, 160, 0.2)';
                ctx.stroke();
            }
        },

        // 圆圈移动
        // 圆圈移动的距离必须在屏幕范围内
        move: function (w, h) {
            this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
            this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
            this.x += this._mx / 2;
            this.y += this._my / 2;
        }
    }
    //鼠标点画圆闪烁变动
    var currentCirle = function (x, y) {
        new Circle(x, y);
    }

    currentCirle.prototype = new Circle
    currentCirle.prototype.drawCircle = function (ctx) {
        ctx.beginPath();
        //注释内容为鼠标焦点的地方圆圈半径变化
        //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
        this.r = 8;
        ctx.arc(this.x, this.y, this.r, 0, 360);
        ctx.closePath();
        //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')';
        ctx.fillStyle = 'rgba(255, 77, 54, 0.6)';
        ctx.fill();

    }

    //封装方法，压缩之后减少文件大小
    function get_by_tagname(name) {
        return document.getElementsByTagName(name);
    }
    //设置canvas的高宽
    function set_canvas_size() {
        w = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            h = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        circles = [];
        var num = w * h / 20000;
        for (var i = 0; i < num; i++) {
            circles.push(new Circle(Math.random() * w, Math.random() * h));
        }
    }

    //更新页面用requestAnimationFrame替代setTimeout
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    let draw = function () {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < circles.length; i++) {
            circles[i].move(w, h);
            circles[i].drawCircle(ctx);
            for (var j = i + 1; j < circles.length; j++) {
                circles[i].drawLine(ctx, circles[j])
            }
        }
        if (current_circle.x) {
            current_circle.drawCircle(ctx);
            for (var k = 1; k < circles.length; k++) {
                current_circle.drawLine(ctx, circles[k])
            }
        }
        requestAnimationFrame(draw);
    };

    //创建画布，并添加到body中
    var the_canvas = document.createElement("canvas"); //画布
    let ctx = the_canvas.getContext('2d');
    let w = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let h = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let circles = [];
    let current_circle = new currentCirle(0, 0);
    the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:-1";
    get_by_tagname("body")[0].appendChild(the_canvas);

    //初始化画布大小
    set_canvas_size();
    window.addEventListener("resize", set_canvas_size);
    //当时鼠标位置存储，离开的时候，释放当前位置信息
    window.addEventListener("mousemove", function (e) {
        e = e || window.event;
        current_circle.x = e.clientX;
        current_circle.y = e.clientY;
    });
    window.addEventListener("mouseout", function () {
        current_circle.x = null;
        current_circle.y = null;
    });
    window.addEventListener("touchend", function () {
        current_circle.x = null;
        current_circle.y = null;
    });
    var num = w * h / 20000;
    for (var i = 0; i < num; i++) {
        circles.push(new Circle(Math.random() * w, Math.random() * h));
    }
    draw();
}();