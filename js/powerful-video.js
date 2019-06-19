function PowerfulVideo(wrapperId) {
	this.$videowrapper = document.getElementById(wrapperId);
	this.$video = document.createElement("video");
	this.$source = document.createElement("source");
	this.player;
}

// 初始化
PowerfulVideo.prototype.init = function(videoInfo) {
	var width = videoInfo['width'] || '100%';
	var height = videoInfo['height'] || '250px';
	var src = videoInfo['filename'] || '';
	src = this.generateVideoSrcPath(src)

	this.$video.setAttribute("width", width);
	this.$video.setAttribute("height",height);
	this.$video.setAttribute("id","player");
	this.$video.setAttribute("controls", "");
	this.$video.setAttribute("playsinline", "");
	this.$video.setAttribute("poster", "");
	this.$video.setAttribute("data-plyr-config", JSON.stringify({'iconUrl': '/third-party/plyr/plyr.svg'}))
	this.$source.setAttribute("src", src);
	this.$source.setAttribute("type", "video/mp4");

	this.$videowrapper.appendChild(this.$video);
	this.$video.appendChild(this.$source);
	var p = document.createElement('p');
	p.setAttribute('class', 'vjs-no-js');
	p.innerHTML = '不好意思，你的浏览器不支持H5播放器哦，好可惜呀，换更现代的浏览器吧，<a href="https://browsehappy.com/" target="_blank" rel="noopener">点击这里呀</a>'
	this.$video.appendChild(p);
}

// 初始化第三方播放器
PowerfulVideo.prototype.initPlyr = function(playerId) {
	// 初始化
	this.player = new Plyr(playerId);
	// 在播放器div容器之前添加一个标注tag
	var $anchor = document.createElement('div');
	$anchor.setAttribute('id', 'video_anchor');
	this.$videowrapper.parentNode.insertBefore($anchor, this.$videowrapper);	

	// 为全屏按钮添加监听事件，因为之前全屏总是会出现问题
	var a = document.getElementsByClassName('plyr__control');
	var fullbtn;
	for (var i = 0; i < a.length; i++){
		if (a[i].getAttribute('data-plyr') === 'fullscreen'){
			fullbtn = a[i]
		}
	}
	
	fullbtn.onclick = function() {
		var $bgan = document.getElementsByClassName('cb-slideshow')[0];
		var $vw = document.getElementById('video_wrapper');
		var $mainc = document.getElementById('container');

		if (this.player.fullscreen.active) {
			this.player.fullscreen.exit()
			$bgan.style.position = "fixed";
			$mainc.setAttribute("style", "");
			document.body.removeChild($vw);
			$anchor.parentNode.insertBefore($vw, $anchor.nextSibling);
		} else {
			$bgan.style.position = "";
			$mainc.style.display = "none";
			document.body.appendChild($vw);
			this.player.fullscreen.enter();
		}
	}.bind(this);

	// 处理全屏按esc退出的事件
	this.player.on('exitfullscreen', function(event) {
		var $bgan = document.getElementsByClassName('cb-slideshow')[0];
		var $vw = document.getElementById('video_wrapper');
		var $mainc = document.getElementById('container');
		console.log('capture');
		$bgan.style.position = "fixed";
		$mainc.setAttribute("style", "");
		if ($anchor.nextSibling !== $vw) {
			document.body.removeChild($vw);
			$anchor.parentNode.insertBefore($vw, $anchor.nextSibling);
		}
	}.bind(this));
}

// 根据文件名拼接视频的路径
PowerfulVideo.prototype.generateVideoSrcPath = function(filename) {

  var cur_url = window.location.href;
  var idx = cur_url.lastIndexOf('/');
  return cur_url.slice(0, idx+1)+ filename;
}

// 全屏出现问题时的提示语句
PowerfulVideo.prototype.badFullView = function() {
	this.$video.addEventListener('webkitfullscreenchange', onFullScreen)
  this.$video.addEventListener('mozfullscreenchange', onFullScreen)
  this.$video.addEventListener('fullscreenchange', onFullScreen)

  function onFullScreen(e) {
    var isFullscreenNow;
    if (document.webkitFullscreenElement !== null) {
      isFullscreenNow = document.webkitFullscreenElement
    } else if (document.mozFullScreenElement !== null) {
      isFullscreenNow = document.mozFullScreenElement
    } else if (document.fullscreenElement !== null){
      isFullscreenNow = document.fullscreenElement;
    } else {
      isFullscreenNow = document.msFullscreenElement;
    }   
    if (isFullscreenNow) {
      alert('非常抱歉目前播放器全屏有点问题 = =')
    }
  }
}
