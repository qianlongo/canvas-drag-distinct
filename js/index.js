$(function () {
  var app = {
    init: function () {
      this.setCanvas();
    },
    setCanvas: function () {
      var $canvas = $('#canvas');
      var $wrap = $('.wrap');
      var $blurImg = $('#blur-img');
      var canvas = $canvas[0];
      var ctx = canvas.getContext('2d');
      var w = $blurImg.width();
      var h = $blurImg.height();
      var img;
      var $drag = $('.drag');
      var clip = _getRandomCoordinate();

      $canvas.attr({
        width: w,
        height: h
      });

      $wrap.css({
        height: h
      });

      function _setDrag() {
        var n = clip.r * 2;

        $drag.css({
          width: n,
          height: n,
          left: clip.x - clip.r,
          top: clip.y - clip.r
        })
      }
      _setDrag();

      function _drag() {
        var disX,disY;
        var $this;
        var x, y;

        $drag.on('mousedown', function (e) {
          $this = $(this);
          disX = e.pageX - $this.position().left;
          disY = e.pageY - $this.position().top;

          $(document).on('mousemove', function (e) {
            x = e.pageX - disX;
            y = e.pageY - disY;
            clip.x = x + clip.r;
            clip.y = y + clip.r;
            _drawImg(img);

            $this.css({
              left: x,
              top: y
            })
          })
          $(document).on('mouseup', function () {
            $(this).unbind('mousemove');
            $(this).unbind('mouseup');
          })
        })
      }
      _drag();

      function _getRandomCoordinate() {
        var r = Math.floor(Math.random() * 100 + 30) ;
        var x = Math.floor(Math.random() * w);
        var y = Math.floor(Math.random() * h);

        if((x - r) < 0 || (y - r) < 0) {
          x = y = r;
        }

        if(x + r > w) {
          x = w - r;
        }

        if(y + r > h) {
          y = h - r;
        }

        return {
          x: x,
          y: y,
          r: r
        }
      }

      function _draw(img) {
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        _setClip(clip);
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
      }

      function _setClip(clip) {
        ctx.beginPath();
        ctx.arc(clip.x, clip.y, clip.r, 0, Math.PI * 2, true);
        ctx.clip();
      }

      function _show() {
        var timer  = null;
        var iSpeed = Math.floor(Math.random() * 10 + 10);

        $('.show').on('click', function () {
          timer = setInterval(function () {
            if (clip.r >= w){
              clearInterval(timer);
            }else{
              clip.r += iSpeed;
              _draw(img);
            }
          }, 30)
        })
      }
      _show();

      function _reset() {
        $('.reset').on('click', function () {
          clip = _getRandomCoordinate();
          _draw(img);
        })
      }
      _reset();

      function _drawImg() {
        img = new Image();
        img.src = $blurImg.attr('src');

        img.onload = function () {
          _draw(img);
        }
      }
      _drawImg();
    }
  }

  app.init();
})
