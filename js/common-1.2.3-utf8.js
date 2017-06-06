/**
 * 自定义弹窗组件
 * @author : 陈文琦(Barry)
 * @update : 2017/5/2
 * @version : 0.1.2
 * @attribute {Object} cover : 遮罩层ID、背景色、透明度信息
 * @attribute {Bool} fix : 是否fix
 * @attribute {string} closeBtn : 关闭按钮class
 * @attribute {Bool} autoClose : 是否支持点击背景关闭
 */
function Popup(){
	this.cover = {
		id : '#popupMasker',
		bgColor : '#000',
		bgOpacity : 0.6
	};
	this.fix = true;
	this.closeBtn = '.closeBtn';
	this.autoClose = false;
}
Popup.prototype = {
	init : function(o){
		$.extend(this,(typeof(o)==="object")?o:{});
	},
	reset : function(o){
		this.cover = {
			id : '#popupMasker',
			bgColor : '#000',
			bgOpacity : 0.6
		};
		this.fix = true;
		this.closeBtn = '.closeBtn';
		this.autoClose = false;
	},
	show : function(obj){
		var self = this;

		// 为弹出框添加样式
		$(obj).css({
			'position':($.isIE6==true||this.fix==false)?'absolute':'fixed',
			'top':'50%',
			'left':'50%',
			'z-index':9999,
			'margin-left':-($(obj).outerWidth()/2)+'px',
			'margin-top':-($(obj).outerHeight()/2)+'px'
		});

		// 创建遮罩层并添加样式
		var bgObj = ( $(this.cover.id).length == 0 ) ? 
					$('<div></div>').attr('id',this.cover.id.substr(1)) : 
					$(this.cover.id);
		bgObj.css({
			'display':'none',
			'width':'100%',
			'height':$(document).height()+'px',
			'position':'fixed',
			'left':'0',
			'top':'0',
			'z-index':'9998',
			'background':this.cover.bgColor,
			'opacity':this.cover.bgOpacity,
			'-webkit-opacity':this.cover.bgOpacity,
			'-moz-opacity':this.cover.bgOpacity,
			'filter':'alpha(opacity='+(this.cover.bgOpacity*100)+')'
		});
		$('body').append(bgObj);

		// 为关闭按钮绑定关闭事件
		if( self.closeBtn && $(obj).find(self.closeBtn).length >= 0 ){
			$(obj).find(self.closeBtn).click(
				function(){
					self.hide(obj);
				}
			);
		}

		// IE6 hack
		if($.isIE6){
			var sT = $(window).scrollTop();
			if ($('body')[0].scrollHeight > sT) {
				$(obj).css({'margin-top': parseInt( sT - $(obj).outerHeight() / 2) + 'px','top': '50%'});
			};
			$(window).scroll(function(){
				sT = $(window).scrollTop();
				if ($('body')[0].scrollHeight > sT) {
					$(obj).css({'margin-top': parseInt( sT - $(obj).outerHeight() / 2) + 'px','top': '50%'});
				};
			});

			bgObj.css({
				'position':'absolute' ,
				'_top':'(document.compatMode && document.compatMode=="CSS1Compat") ? document.documentElement.scrollTop : document.body.scrollTop'
			});
		}

		// 是否允许点击背景关闭
		if(self.autoClose){
			$(self.cover.id).click(function(){self.hide(obj);});
		}

		// 显示遮罩层以及弹窗
		$(self.cover.id).show();
		$(obj).show();
	},
	// 关闭弹窗
	hide : function(obj){
		$(this.cover.id).remove();
		$(obj).hide();
	}
};
window.popupManager = new Popup();

/**
 * IE8及以下不支持window.console兼容
 * @author : 陈文琦(Barry)
 * @update : 2017/5/5
 * @version : 0.1.1
 */
;(function(){
	window.console = window.console || (function () {
	    var c ={}; 
	　　 c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile= c.clear = c.exception = c.trace = c.assert = function(){};
	    return c;
	})();
})();


/**
 * 浏览器信息获取
 * @author : 陈文琦(Barry)
 * @update : 2017/5/4
 * @version : 0.1.1
 */
;(function(){
	var sys = {},
		ua = navigator.userAgent.toLowerCase(),
		s;
	(s=ua.match(/rv:([\d.]+)\) like gecko/))?sys={'name':'ie','ver':parseFloat(s[1])}:
	(s=ua.match(/msie ([\d.]+)/))?sys={'name':'ie','ver':parseFloat(s[1])}:
	(s=ua.match(/firefox\/([\d.]+)/))?sys={'name':'firefox','ver':parseFloat(s[1])}:
	(s=ua.match(/chrome\/([\d.]+)/))?sys={'name':'chrome','ver':parseFloat(s[1])}:
	(s=ua.match(/opera.([\d.]+)/))?sys={'name':'opera','ver':parseFloat(s[1])}:
	(s=ua.match(/version\/([\d.]+).*safari/))?sys={'name':'safari','ver':parseFloat(s[1])}:
	sys={'name':'unknow','ver':0};
	
	// 写入全局变量
	BROWSER_INFO = sys;
	ISIE6 = (!-[1,]&&!window.XMLHttpRequest);
	if(ISIE6){ alert("您的浏览器版本过低,为体验更好效果,请升级您的浏览器！"); }
})();


/**
 * 修复IE8及以下不支持placeholder属性
 * @author : 陈文琦(Barry)
 * @update : 2017/5/4
 * @version : 0.1.1
 */
;(function(){
	if( !('placeholder' in document.createElement('input')) ){
		// 匹配 除type=password以外所有input、textarea
		$('input[placeholder][type!=password],textarea[placeholder]').each(function(){   
			var self = $(this),   
			text= self.attr('placeholder');
			// 如果内容为空，则写入
			if(self.val()===""){ 
				self.val(text).addClass('placeholder');
			}

			// 控件激活，清空placeholder
			self.focus(function(){
				if(self.val()===text){
					self.val("").removeClass('placeholder');
				}
			// 控件失去焦点，清空placeholder
			}).blur(function(){
				if(self.val()===""){
					self.val(text).addClass('placeholder');
				}
			});			
		});   
	}
})();


/**
* jQuery自定义扩展组件
* @author : 陈文琦
* @update : 2017/5/9
* @version : 1.2.3
**/
;(function($){
	$.fn.extend({
		/**
		 * 监控鼠标进入、离开对象的方向
		 * @param {Function} callback : 回调(进入/离开，方向(0,1,2,3))
		 */
		moveDirection:function(callback){
			var w = $(this).outerWidth(),h = $(this).outerHeight(),
					x,y,dir;				
			$(this).bind("mouseenter",function(e){
				x = (e.pageX - $(this)[0].offsetLeft - (w / 2))*((w>h)?(h/w):1);
				y = (e.pageY - $(this)[0].offsetTop - (h / 2))*((h>w)?(w/h):1);
				dir = Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90+3)%4;
				if($.isFunction(callback)) callback("in",dir);
			});	
			$(this).bind("mouseleave",function(e){
				x = (e.pageX - $(this)[0].offsetLeft - (w / 2))*((w>h)?(h/w):1);
				y = (e.pageY - $(this)[0].offsetTop - (h / 2))*((h>w)?(w/h):1);
				dir = Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90+3)%4;
				if($.isFunction(callback)) callback("out",dir);
			});			
		},

		/**
		 * 广告轮播
		 * @param {String} dir : 移动方向(0,1,2,3->上右下左，默认3)
		 * @param {int} step : 每次移动多少单元格
		 * @param {int} speed : 移动速度
		 * @param {Bool} numBtns : 是否显示分页按钮 
		 * @param {Bool} toggleBtn : 是否显示左右切换按钮
		 * @param {Bool} auto : 是否自动轮播 
		 * @param {int} wait : 轮播间隔时间 
		 * @param {String} mode : 切换方式(slide:滑动显示 fade:渐隐渐显)
		 * @param {String} easing : 缓动函数 
		 * @param {Function} callBack : 切换完成回调(curIdx,total)
		 */
		runHorse:function(params){
			var o = $.extend({
				dir:"left", 
				speed:1000,
				numBtns:true,
				toggleBtn:true,
				auto:true,
				wait:2000,	
				mode:"slide",
				easing:"swing",
				callBack:null
 			},(typeof params === "object")?params:{});

			var self = $(this),
				units = ( self.children()[0].tagName == "UL" ) ? self.children().children() : self.children('a'),
				unitLen = units.length,
				currentIndex = 0,
				dir = o.dir,
				prevBtn = null,
				nextBtn = null,
				navBtnList = [],
				navSelectClass = "on",
				_speed = o.speed,
				_mode = o.mode,
				_ease = o.easing,
				_timer = null,
				isMoving = false;

			// 分页切换
			var jump = function(newIdx,oldIdx,isNavClick){
				if( newIdx == oldIdx ) return;
				
				if( _mode == "fade"){
					isMoving = true;
					units.eq(newIdx)
						.fadeIn(_speed,function(){isMoving = false;})
						.siblings().fadeOut(_speed);
				}else{
					isMoving = true;
					var p1 = {},
						p2 = {},
						p3 = {'left' : 0, 'top' : 0};
						// old < new
					if( ( oldIdx < newIdx ) ||
						// new = 0 && old = last && auto
						( newIdx == 0 && oldIdx == unitLen - 1 && !isNavClick) ||
						// old = 0 && new = last && click navBtn
						( oldIdx == 0 && newIdx == unitLen - 1 && isNavClick) ){
						p1 = { 'left' : ( dir == 3 ) ? '100%' :
										( dir == 1 ) ? '-100%' :0,
								'top' : ( dir == 0 ) ? '100%' : 
										( dir == 2 ) ? '-100%' : 0 };
						p2 = { 'left' : ( dir == 3 ) ? '-100%' :
										( dir == 1 ) ? '100%' :0,
								'top' : ( dir == 0 ) ? '-100%' : 
										( dir == 2 ) ? '100%' : 0 };
					}else{
						p1 = { 'left' : ( dir == 3 ) ? '-100%' :
										( dir == 1 ) ? '100%' :0,
								'top' : ( dir == 0 ) ? '-100%' : 
										( dir == 2 ) ? '100%' : 0 };
						p2 = { 'left' : ( dir == 3 ) ? '100%' :
										( dir == 1 ) ? '-100%' :0,
								'top' : ( dir == 0 ) ? '100%' : 
										( dir == 2 ) ? '-100%' : 0 };
					}
					// 初始化 new 的位置
					units.eq(newIdx).css(p1);
					// 执行 old 动画
					units.eq(oldIdx).animate(p2,_speed,_ease);
					// 执行 new 动画
					units.eq(newIdx).animate(p3,_speed,_ease,function(){isMoving=false;});
				}
				if( o.numBtns ){
					navBtnList.eq(newIdx).addClass(navSelectClass).siblings().removeClass(navSelectClass);
				} 	
				if( $.isFunction( o.callBack ) ){
					o.callBack(newIdx,unitLen);							
				}
			}

			// 对象悬浮停止自动轮播
			var stopAuto = function(obj){
				obj.hover(function(){
					clearInterval(_timer);
				},function(){
					_timer = setInterval(autoJump, o.wait);
				});
			}

			// 自动轮播函数
			var autoJump = function(){ 
				if(!isMoving){ 
					var _cur = currentIndex;
					currentIndex = ( ++currentIndex + unitLen ) % unitLen;
					jump(currentIndex,_cur);
				}
			}

			// 启动
			;(function(){
				// 添加左右按钮
				if( o.toggleBtn ){
					prevBtn = $('<a>').attr({'href':'javascript:;','class':'prev'}).html('<');
					nextBtn = $('<a>').attr({'href':'javascript:;','class':'next'}).html('>');
					self.after(prevBtn).after(nextBtn);
					prevBtn.click(function(){ 
						if( !isMoving ){ 
							var oldIndex = currentIndex; 
							currentIndex = ( --currentIndex + unitLen ) % unitLen;
							jump( currentIndex, oldIndex );
						}
					});
					nextBtn.click(function(){ 
						if( !isMoving ){ 
							var oldIndex = currentIndex; 
							currentIndex=( ++currentIndex + unitLen ) % unitLen;
							jump( currentIndex, oldIndex );
						}
					});
				}
				// 添加分页按钮
				if( o.numBtns ){
					var $navBox = $('<div>').addClass("runNum"),
						i = 1, j = 0,
						$a = null;
					for(;i <= unitLen ; i++){
						$a = $('<a>').attr('href','javascript:;').html(i)
						$navBox.append( $a );
						
					}
					self.after($navBox);
					navBtnList = $navBox.children();
					navBtnList.each(function(i){
						$(this).click(function(){
							if( !isMoving ){
								var oldIndex = currentIndex;
								currentIndex = i;
								jump(currentIndex,oldIndex,true);
							}
						});
					});					
				}

				// 初始显示第一项
				if(_mode == "fade") {
					units.css({'position':'absolute','left':'0','top':'0'}).eq(0).show().siblings().hide();
				}else { 
					self.css('position','relative');
					units.each(function(i,e){
						if(i==0) $(this).css({'position':'absolute','left':'0','top':'0'});
						else {
							switch(dir){
								case 0 : 
									$(e).css({'position':'absolute','top':'100%','left':'0'});
									break;
								case 1 : 
									$(e).css({'position':'absolute','left':'-100%','top':'0'});
									break;
								case 2 : 
									$(e).css({'position':'absolute','top':'-100%','left':'0'});
									break;
								default : 
									$(e).css({'position':'absolute','left':'100%','top':'0'});
							}
						}
					});
				}

				// 初始高亮分页第一项
				if( o.numBtns ){
					navBtnList.eq(0).addClass(navSelectClass);
				}

				// 启动自动轮播
				if(o.auto){
					_timer = setInterval(autoJump, o.wait);

					if(o.toggleBtn){
						stopAuto(prevBtn);
						stopAuto(nextBtn);
					}
					if(o.numBtns){
						stopAuto(navBtnList);
					}
					stopAuto(units);
				}
			})();
		},

		/**
		 * 导航自动切换
		 * @param {String} selClass : 选中项高亮样式
		 * @param {int} diff : 监控元素离浏览器顶部高度差(用于在页面滚动条移动时触发切换)
		 * @param {int} marginTop : 顶部预留高度(留出白头高度)
		 * @param {int} show : 滚动到指定高度显示导航。默认值0，始终显示
		 */
		highlightNav:function(options){
			var o = $.extend({
				selClass:"on",
				diff:400,
				mTop:40,
				show:0
			},(typeof options === "object")?options:{});

			var self = $(this),
			    $topBtn = null,
				allUnit = [];

			// 选取导航原件 <a>
			self.children().each(function(i){
				var _unit = null;
				if( this.tagName == "LI" ){
					_unit = $(this).children();						
				}else if( this.tagName == "A" ){
					_unit = $(this);
				}

				if( _unit && $.trim( _unit.data('anchor') ).toUpperCase() == 'TOP'){
					$topBtn = _unit;
				}else if( _unit && $.trim( _unit.data('anchor') ) != ''){
					allUnit.push(_unit);
				}
			});

			if( allUnit.length == 0) {
				console.warn('导航菜单未找到，请检查页面结构！');
				return;
			}

			// 为top按钮绑定事件
			if($topBtn){
				$topBtn.click(function(){
					$('body,html').animate({scrollTop: 0}, 500);
				});
			}
			
			// 为每个跳转按钮绑定事件
			$.each(allUnit,function(){
				$(this).click(function(){
					$('body,html').animate({scrollTop: $('#'+$(this).data("anchor")).offset().top-o.mTop}, 500);
				});
			});

			// 显示/隐藏导航
			if( o.show ) {
				var showHideNav = function(){
					if( $(window).scrollTop() >= o.show ){
						$(".nav1").fadeIn();
					}else{
						$(".nav1").fadeOut();
					}
				};
				showHideNav();
				$(window).scroll(function(){
					showHideNav();
				});
			}else{
				$(".nav1").show();
			}
			
			// 根据滚动高度自动自动高亮导航
			var isBottom = function(){
				return $(document).scrollTop() >= $(document).height()-$(window).height() ? true : false
			}
			// 为选中项添加高亮样式
			var pickNav = function(obj){
				obj.addClass(o.selClass).siblings().removeClass(o.selClass);
			}
			function changeNav(){
				var $unit = null,
					flag = 0;
				if( isBottom() ) {
					$unit = ( allUnit[0].parent()[0].tagName == "LI" ) ? allUnit[ allUnit.length - 1 ].parent() : allUnit[ allUnit.length - 1 ];
					pickNav($unit);
					flag++;
				}else{
					$.each(allUnit,function(i,e){
						var idx = allUnit.length-1-i,
							anchor = allUnit[ idx ].data('anchor'),
							_t = $("#"+anchor)[0].getBoundingClientRect().top;
						if(_t <= o.diff){
							$unit = ( allUnit[i].parent()[0].tagName == "LI" ) ? allUnit[ idx ].parent() : allUnit[ idx ];
							pickNav($unit);
							flag++;
							return false;
						}						
					});
				}
				if(flag == 0) {
					pickNav( ( allUnit[0].parent()[0].tagName == "LI" ) ? 
											allUnit[ 0 ].parent() : 
											allUnit[ 0 ] );
				}
			}

			changeNav();
			$(window).scroll(function(){
				changeNav();
			});	
		},

		/**
		 * 百叶窗切换
		 * @param {String} btn : 点击区域（选择器）
		 * @param {String} btnClass : 选中DL样式
		 * @param {int} dir : 内容相对按钮的位置 0:上,1:右,2:下,3:左
		 * @param {int} zIndex : z-index,默认根据dl数量自动生成
		 * @param {String} easing : 缓动函数,默认linear
		 * @param {int} speed : 动画执行时间
		 */
		shutter:function(o){
			var opts = $.extend({ 
				btn:'',
				btnClass:'on',
				dir:3,
				zIndex:null,
				easing:'linear',
				speed:500},(typeof o === "object")?o:{});
			var $dl = $(this).children(),
				dlWidth = $dl.outerWidth(),
				dlHeight = $dl.outerHeight(),				
				dlLen = $dl.length,
				$dt = $(this).find(opts.btn),
				dtWidth = $dt.outerWidth(),
				dtHeight = $dt.outerHeight(),
				dtActiveClass = opts.btnClass || 'on',
				zIdx = opts.zIndex || dlLen,
				curIdx = 0,
				dir = opts.dir,
				_speed = opts.speed,
				_ease = opts.easing;

			// 初始化样式
			$(this).css( 'position' , 'relative' );
			$dt.css('cursor' , 'pointer' );
			$dl.each(function(i){
				$(this).css({
					"position" : "absolute",
					"top" : ( dir == 1 || dir == 3 ) ? 0 : dtHeight * i,
					"left" : ( dir == 0 || dir == 2 ) ? 0 : dtWidth * i,
					"z-index" : ( dir == 0 || dir == 3) ? ( zIdx - i ) : ( i + 1)		
				});
			});
			if(dtActiveClass) {
				if( dir == 0 || dir == 3){
					$dl.eq(0).addClass(dtActiveClass).siblings().removeClass(dtActiveClass);
				}else{
					$dl.eq(dlLen-1).addClass(dtActiveClass).siblings().removeClass(dtActiveClass);
				}
			}

			// 绑定按钮事件
			$dt.each(function(pickIdx) {
				$(this).click(function() {
					// 点击当前项不触发 or 动画执行过程中不触发 (防止连点)
					if( pickIdx == curIdx || $dl.is(":animated") ) {
						return;
					}

					$.each($dl,function(i,$$dl){
						if( dir == 1 ) {
							//	按钮在左
							$dl.eq(i).stop().animate({ 'left' : ( i <= pickIdx ) ? ( dtWidth * i) : 
																( dlWidth + dtWidth * ( i - 1 ) )
								}, { queue : false, duration : _speed, easing : _ease}
							);
						}else if( dir == 3 ) {
							//	按钮在右
							$dl.eq(i).stop().animate({ 'left' : ( i < pickIdx ) ? -( dlWidth - dtWidth * ( i + 1 ) ) : 
																( dtWidth * i )
								}, { queue : false, duration : _speed, easing : _ease}
							);
						}else if( dir == 0 ) {
							//	按钮在下
							$dl.eq(i).stop().animate({ 'top' : ( i < pickIdx ) ? -( dlHeight - dtHeight * ( i + 1 ) ) : 
																( dtHeight * i )
								}, { queue : false, duration : _speed, easing : _ease}
							);
						}else if( dir == 2 ) {
							//	按钮在上
							$dl.eq(i).stop().animate({ 'top' : ( i <= pickIdx ) ? ( dtHeight * i) : 
																( dlHeight + dtHeight * ( i - 1 ) )
								}, { queue : false, duration : _speed, easing : _ease}
							);
						}
					});

					// 为当前选中DL添加选中样式
					if(dtActiveClass) $(this).parent().addClass(dtActiveClass).siblings().removeClass(dtActiveClass);

					// 更新当前项index
					curIdx = pickIdx;
				});
			});
		},

		/**
		 * 图片预加载
		 * @param {Function} callback1 : 每个图片加载完成后回调
		 * @param {Function} callback2 : 全部加载完成后回调
		 */
		imgPreLoader : function(callback1, callback2){
	        var imgPreOptions = [],
	            imgList = [],
	            errorList = [],
	            currentNum = 0,
	            onChange = ( $.isFunction(callback1) ) ? callback1 : '',
	            onComplete = ( $.isFunction(callback2) ) ? callback2 : '',
	            self = this;

	        var getImages = function(element){
	            if($(element).find('*:not(script)').length > 0){
	                $(element).find('*:not(script)').each(function(){
	                    var url = "";
	                    if( $(this).css('background-image') && $(this).css('background-image').indexOf('none') == -1 ) {
	                        url = $(this).css('background-image');

	                        if(url.indexOf('url') != -1) {
	                            var temp = url.match(/url\((.*?)\)/);
	                            url = temp[1].replace(/\"/g, '');
	                        }
	                    } else if ( $(this).get(0).nodeName.toLowerCase() == 'img' && typeof( $(this).attr('src') ) != 'undefined') {
	                        url = $(this).attr('src');
	                    }

	                    if (url.length > 0) {
	                        imgList.push(url);
	                    }
	                });
	            }else if($(element).get(0).nodeName.toLowerCase() == 'img' && typeof($(element).attr('src')) != 'undefined'){
	                imgList.push($(element).attr('src'));
	            }

	            loadImgList();            
	        }

	        var loadImgList= function(){
	            for (var i = 0; i < imgList.length; i++) {
	                loadImg(imgList[i]);
	            }
	        }

	        var loadImg = function(url){
	            var img = new Image();
	            $(img)
	            .load(function(){
	                completeLoading();
	            })
	            .error(function(){
	                errorList.push($(this).attr('src'));
	                completeLoading();
	            })
	            .attr('src',url);
	        }

	        var completeLoading = function(){
	            currentNum++;
	            var per = Math.round((currentNum / imgList.length) * 100);        
	            if(onChange) onChange(per);
	            if(currentNum >= imgList.length && onComplete) {
	               onComplete();
	            }
	        }

	        getImages(this);

	        return this;
	    }
	});

	$.extend({
		/**
		 * 显示自定义对话框
		 * @param {dom} o : 对话框对象
		 */
		showDialog:function(o){
			if(typeof(popupManager) == "undefined"){
				popupManager = new Popup();
			}
			if($(o).length>0){
				popupManager.show(o);
			}else{
				console.warn("'"+o+"'不存在！");
			}
		},

		/**
		 * 隐藏自定义对话框
		 * @param {dom} o : 对话框对象
		 */
		hideDialog:function(o){
			if($(o).length>0){
				popupManager.hide(o);
			}
		},

		/**
		 * 动态添加JS,CSS
		 * @param {Array} urls : 链接地址
		 * @param {String} urlPath : 链接目录地址
		 * @param {Function} callback : 加载完成回调(文件地址, 状态,文件内容)（仅对JS有效）
		 */
		addLink:function(urls,urlPath,callback){
			var argNum = arguments.length,
				$container = $('head'),
				fileType,fileUrl,$obj;
			// 异常数据时返回
			if( argNum == 0 || urls.length == 0){
				return;
			}

			_urls = arguments[0];
			// 初始化目录地址以及回调函数
			_urlPath = ( arguments[1] && ( typeof arguments[1] === "string" ) ) ? arguments[1] : '';
			_callback = arguments[2] ? arguments[2] : 
					( arguments[1] && ( typeof arguments[1] === "function" ) ) ? arguments[1] : {};

			$.each(_urls,function( i, data ){
				fileUrl = data.split('.'),fileType = fileUrl[fileUrl.length-1].toLowerCase();
				if( fileType == 'css' ){
					$obj = $('<link>').attr({
						'href':_urlPath+data,'type':'text/css','rel':'stylesheet'});
				}else{
					$obj = $('<script>').attr({'src':_urlPath+data,'type':'text/javascript'});
				}
				$container.append($obj);
				if( fileType == 'js' ){
					$.getScript( _urlPath + data )
					  .done(function( script, textStatus ) {
					    _callback(data,textStatus,script);
					  })
					  .fail(function( jqxhr, settings, exception ) {
					    console.warn( '无法获取加载资源：'+data );
					});
				}
			});			
		},

		/**
		 * 获取时间差
		 * @param {Date} sDate : 起始时间
		 * @param {Date} eDate : 结束时间
		 * @param {Function} callback : 返回时间差(天,小时,分钟,秒)
		 */
		diffDate:function(sDate,eDate,callback){
			var d1 = sDate.getTime(),d2 = eDate.getTime(),_d,_h,_m,_s,_diff;
			if(d1<d2){
				var differ = (d2-d1)/1000;
				_d = Math.floor(differ/60/60/24);
				_h = Math.floor(differ/60/60)-(_d*24);
				_m = Math.floor(differ/60)-(_h*60)-(_d*24*60);
				_s = Math.floor(differ%60%60);
				callback(_d,_h,_m,_s);
			}else{
				if($.isFunction(callback)){
					callback(-1);
				}
			}			
		},

		/**
		 * 背景音乐播放器
		 * @param {String} id : 背景音乐控件ID
		 * @param {String} src : 背景音乐文件路径
		 * @param {Bool} loop : 是否循环，默认true
		 * @param {Float} volume : 音量
		 * @param {String} pauseBtn : 暂停按钮ID or CLASS
		 * @param {Function} pauseCallBack : 暂停按钮回调函数
		 */
		audioPlayer:function(o){
			var opts = $.extend({ 
				id:'', 
				src:'', 
				loop:true, 
				volume:1, 
				pauseBtn:'', 
				pauseCallBack:'',
				state:1
			},(typeof o ==="object")?o:{});	 

			if(opts.src!=""){ 
				if(BROWSER_INFO.name == 'ie' && ( BROWSER_INFO.ver - 9 ) < 0){	
					// IE8及以下hack   
					var player = $('<bgsound></bgsound>');
					player[0].id = opts.id;
					player[0].src = opts.src;
					player[0].autostart = true;
					player[0].loop = (opts.loop) ? 'infinite' : 1;
					player[0].volume = -2000 * (1 - opts.volume);
					$('body').append(player.append(src));
					$(opts.pauseBtn).click(function(){
						if($('#'+opts.id).attr('src') == ''){
							opts.state = 1;
							$('#'+opts.id).attr('src',opts.src);
						}else{
							opts.state = 0;
							$('#'+opts.id).attr('src','');
						}
						if($.isFunction(opts.pauseCallBack)) opts.pauseCallBack(opts.state);
					});
				}else{
					// IE9及以上高级浏览器
					var player = $('<audio></audio>').attr({
						id : opts.id,
						autoplay : 'autoplay',
						loop : (opts.loop) ? 'loop' : 1
					});
					player[0].volume = 1 * opts.volume;
					var fileSp = opts.src.split('.'),
						fileType = fileSp[fileSp.length-1];
					var src = $('<source>').attr({
						src : opts.src,
						type :  ( fileType == "ogg" ) ? 'audio/ogg' : 'audio/mpeg'
					}); 
					$('body').append(player.append(src));
					$(opts.pauseBtn).click(function(){
						if(!$('#'+opts.id)[0].paused){
							opts.state = 0;
							$('#'+opts.id)[0].pause();
						}else{
							opts.state = 1;
							$('#'+opts.id)[0].play();
						}
						if($.isFunction(opts.pauseCallBack)) opts.pauseCallBack(opts.state);
					});
				} 
			}
		},

		/**
		 * 加入收藏夹
		 * @param {String} url : 收藏地址
		 * @param {String} name : 收藏标题
		 */
		addFavorite:function(url,name) {
			if(window.sidebar){
				// firefox
				window.sidebar.addPanel(name,url,'');
			}else if(BROWSER_INFO.name=='ie'){
				// IE
				window.external.addFavorite(url, name);
			}else{
				alert("请使用Ctrl+D将本页加入收藏夹！");
			}
		},

		/**
		 * 获取URL传参
		 * @param {String} name : 参数名称
		 */
		getUrlParam : function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) return unescape(r[2]); return null;
		},

		/**
		 * 跟随鼠标晃动
		 * @param {String} data-slide-mode : 模式 1:横竖一起动 2:只横向移动 3:只垂直移动
		 * @param {String} data-slide-speed : 移动速度 
		 * @param {String} data-slide-step : 移动距离 建议10-50
		 */
		moveSlide:function(){
			var objs = $('[data-slide-mode]');
			$.each(objs,function(i,e){
				var $this = $(e),
					_left = $this.position().left,
					_top = $this.position().top,
					$window = $(window),
					winWidth = $window.width() / 2,
					winHeight = $window.height() / 2;
				$(document).mousemove(function(e) {
					var diffX = winWidth - e.pageX,
						diffY = winHeight - e.pageY,
						mode = $this.data("slide-mode") || 0,
						step = $this.data("slide-step") || 50,
						speed = $this.data("slide-speed") || 50;
					switch(mode) {
						case 2 : 
							$this.stop().animate({
								'left': _left + diffX / step + 'px'
							}, speed,'swing');																
							break;
						case 3 : 
							$this.stop().animate({
								'top':_top + diffY / step + 'px'
							}, speed,'swing');								
							break;
						default :
							$this.stop().animate({
								'left': _left + diffX / step + 'px',
								'top':_top + diffY / step + 'px'
							}, speed,'swing');
					}
				});
			});
		}
	});
})(jQuery);
