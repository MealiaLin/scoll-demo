/*渲染字体的效果修改*/
Cufon.replace('h1',{ textShadow: '1px 1px #000'});
Cufon.replace('h2',{ textShadow: '1px 1px #000'});
Cufon.replace('.footer',{ textShadow: '1px 1px #000'});
Cufon.replace('.page_loading',{ textShadow: '1px 1px #000'});


(function($) {
	$.fn.parallaxSlider = function(options) {
		var opts = $.extend({}, $.fn.parallaxSlider.defaults, options);
		return this.each(function() {
			var $page_container 	= $(this),
			o 				= $.meta ? $.extend({}, opts, $page_container.data()) : opts;
			
			//the main slider
			//主滑块
			var $page_slider		= $('.page_slider',$page_container),
			//the elements in the slider
			//滑块中的元素
			$elems			= $page_slider.children(),
			//total number of elements
			//元素总数
			total_elems		= $elems.length,
			//the navigation buttons
			//导航按钮
			$page_next		= $('.page_next',$page_container),
			$page_prev		= $('.page_prev',$page_container),
			//the bg images
			//背景图片
			$page_bg1		= $('.page_bg1',$page_container),
			$page_bg2		= $('.page_bg2',$page_container),
			$page_bg3		= $('.page_bg3',$page_container),
			//current image
			//当前图片
			current			= 0,
			//the thumbs container
			//缩略图容器
			$page_thumbnails = $('.page_thumbnails',$page_container),
			//the thumbs
			//缩略图
			$thumbs			= $page_thumbnails.children(),
			//the interval for the autoplay mode
			//
			slideshow,
			//the loading image
			//加载图片
			$page_loading	= $('.page_loading',$page_container),
			//滑动图片区容器
			$page_slider_wrapper = $('.page_slider_wrapper',$page_container);
				
			//first preload all the images
			//首先预加载所有的图片
			var loaded		= 0,
			$images		= $page_slider_wrapper.find('img');
				
			$images.each(function(){
				var $img	= $(this);
				$('<img/>').load(function(){
					++loaded;
					if(loaded	== total_elems*2){
						$page_loading.hide();
						$page_slider_wrapper.show();
							
						//one images width (assuming all images have the same sizes)
						/*一张图片的宽度，假设所有的图片的尺寸一样，所以直接获取第一张图片的宽度来代表所有图片的宽度*/
						var one_image_w		= $page_slider.find('img:first').width();
				
						/*
						need to set width of the slider,
						of each one of its elements, and of the
						navigation buttons
						 */
						 /*需要设置每一个元素和每一个导航按钮滑块的宽度*/
						setWidths($page_slider,
						$elems,//滑块中的元素
						total_elems,
						$page_bg1,
						$page_bg2,
						$page_bg3,
						one_image_w,
						$page_next,
						$page_prev);
				
						/*
							set the width of the thumbs
							and spread them evenly
						 */
						 /*设置缩略图的宽度并均匀分布*/
						$page_thumbnails.css({
							'width'			: one_image_w + 'px',
							'margin-left' 	: -one_image_w/2 + 'px'
						});
						var spaces	= one_image_w/(total_elems+1);
						$thumbs.each(function(i){
							var $this 	= $(this);
							var left	= spaces*(i+1) - $this.width()/2;
							$this.css('left',left+'px');
								
							if(o.thumbRotation){
								var angle 	= Math.floor(Math.random()*41)-20;
								$this.css({
									'-moz-transform'	: 'rotate('+ angle +'deg)',
									'-webkit-transform'	: 'rotate('+ angle +'deg)',
									'transform'			: 'rotate('+ angle +'deg)'
								});
							}
							//hovering the thumbs animates them up and down
							$this.bind('mouseenter',function(){
								$(this).stop().animate({top:'-10px'},100);
							}).bind('mouseleave',function(){
								$(this).stop().animate({top:'0px'},100);
							});
						});
							
						//make the first thumb be selected
						highlight($thumbs.eq(0));
							
						//slide when clicking the navigation buttons
						$page_next.bind('click',function(){
							++current;
							if(current >= total_elems)
								if(o.circular)
									current = 0;
							else{
								--current;
								return false;
							}
							highlight($thumbs.eq(current));
							slide(current,
							$page_slider,
							$page_bg3,
							$page_bg2,
							$page_bg1,
							o.speed,
							o.easing,
							o.easingBg);
						});
						$page_prev.bind('click',function(){
							--current;
							if(current < 0)
								if(o.circular)
									current = total_elems - 1;
							else{
								++current;
								return false;
							}
							highlight($thumbs.eq(current));
							slide(current,
							$page_slider,
							$page_bg3,
							$page_bg2,
							$page_bg1,
							o.speed,
							o.easing,
							o.easingBg);
						});
				
						/*
						clicking a thumb will slide to the respective image
						 */
						$thumbs.bind('click',function(){
							var $thumb	= $(this);
							highlight($thumb);
							//if autoplay interrupt when user clicks
							if(o.auto)
								clearInterval(slideshow);
							current 	= $thumb.index();
							slide(current,
							$page_slider,
							$page_bg3,
							$page_bg2,
							$page_bg1,
							o.speed,
							o.easing,
							o.easingBg);
						});
				
					
				
						/*
						activate the autoplay mode if
						that option was specified
						 */
						if(o.auto != 0){
							o.circular	= true;
							slideshow	= setInterval(function(){
								$page_next.trigger('click');
							},o.auto);
						}
				
						/*
						when resizing the window,
						we need to recalculate the widths of the
						slider elements, based on the new windows width.
						we need to slide again to the current one,
						since the left of the slider is no longer correct
						 */
						$(window).resize(function(){
							w_w	= $(window).width();
							setWidths($page_slider,$elems,total_elems,$page_bg1,$page_bg2,$page_bg3,one_image_w,$page_next,$page_prev);
							slide(current,
							$page_slider,
							$page_bg3,
							$page_bg2,
							$page_bg1,
							1,
							o.easing,
							o.easingBg);
						});

					}
				}).error(function(){
					alert('here')
				}).attr('src',$img.attr('src'));
			});
				
				
				
		});
	};
	
	//the current windows width
	var w_w				= $(window).width();
	
	var slide			= function(current,
	$page_slider,
	$page_bg3,
	$page_bg2,
	$page_bg1,
	speed,
	easing,
	easingBg){
		var slide_to	= parseInt(-w_w * current);
		$page_slider.stop().animate({
			left	: slide_to + 'px'
		},speed, easing);
		$page_bg3.stop().animate({
			left	: slide_to/2 + 'px'
		},speed, easingBg);
		$page_bg2.stop().animate({
			left	: slide_to/4 + 'px'
		},speed, easingBg);
		$page_bg1.stop().animate({
			left	: slide_to/8 + 'px'
		},speed, easingBg);
	}
	
	var highlight		= function($elem){
		$elem.siblings().removeClass('selected');
		$elem.addClass('selected');
	}
	
	var setWidths		= function($page_slider,
	$elems,
	total_elems,
	$page_bg1,
	$page_bg2,
	$page_bg3,
	one_image_w,
	$page_next,
	$page_prev){
		/*
		the width of the slider is the windows width
		times the total number of elements in the slider
		 */
		var page_slider_w	= w_w * total_elems;
		$page_slider.width(page_slider_w + 'px');
		//each element will have a width = windows width
		$elems.width(w_w + 'px');
		/*
		we also set the width of each bg image div.
		The value is the same calculated for the page_slider
		 */
		$page_bg1.width(page_slider_w + 'px');
		$page_bg2.width(page_slider_w + 'px');
		$page_bg3.width(page_slider_w + 'px');
		
		/*
		both the right and left of the
		navigation next and previous buttons will be:
		windowWidth/2 - imgWidth/2 + some margin (not to touch the image borders)
		 */
		var position_nav	= w_w/2 - one_image_w/2 + 3;
		$page_next.css('right', position_nav + 'px');
		$page_prev.css('left', position_nav + 'px');
	}
	
	$.fn.parallaxSlider.defaults = {
		auto			: 0,	//定期滑动内容多少秒。
								//如果设置为0，则自动播放关闭.
		speed			: 1000,//每张幻灯片动画的速度
		easing			: 'jswing',//简单幻灯片动画效果
		easingBg		: 'jswing',//背景动画的缓和效果
		circular		: true,//圆形滑块
		thumbRotation	: true//缩略图将随机旋转
	};
	//easeInOutExpo,easeInBack
})(jQuery);


$(function() {
	var $page_container	= $('#page_container');
	$page_container.parallaxSlider();
});