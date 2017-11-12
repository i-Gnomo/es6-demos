/**
 * 引入头部底部广告
 * 2017-07-28-1130
 */
window.AdRes = (function(){
	function AdRes(config){
		//定义需要的变量以及要触发的函数
		this.keyId = config.keyId;
		this.adUrl_top;
		this.adUrl_bottom;
		this.defaultUrl;
		this.init(config);
		this.setSrc();
	}
	AdRes.prototype = {
		constructor: AdRes,
		init: function(config){
			var _this = this;
			//根据config参数修改变量
			_this.keyId = _this.keyId?_this.keyId:'';
			_this.adUrl_top = config.adUrl_top?config.adUrl_top:'';
			_this.adUrl_bottom = config.adUrl_bottom?config.adUrl_bottom:'';
			_this.defaultUrl = config.defaultUrl?config.defaultUrl:'';
			_this.renderTypes = _this.renderTypes;
			
			if(_this.urlNone(_this.adUrl_top)){
				//获取头部广告
				_this.getUrlData(_this.adUrl_top, _this.adRender);
			}
			if(_this.urlNone(_this.adUrl_bottom)){
				//获取底部广告
				_this.getUrlData(_this.adUrl_bottom, _this.adRender);
			}
			if(!_this.urlNone(_this.adUrl_top) || !_this.urlNone(_this.adUrl_bottom)){
				if(_this.urlNone(_this.defaultUrl)){
					//获取缺省广告
					_this.getUrlData(_this.defaultUrl,_this.adRender,1);
				}
			}			
		},
		ajaxCount: 0,
		setCount: function(){
			this.ajaxCount++;
			return this.ajaxCount;
		},
		urlNone:function(_url){
			//判断广告路径是否存在
			if(_url && _url!='' && _url!=null && typeof _url!='undefined'){
				return true;
			}
			return false;
		},
		adDataArray: [[1,'','',true],[2,'','',true]],
		setadDataArray: function(pos,_style,_html,isdefault){
			for(var i=1;i<3;i++){
				if(pos && (i === parseInt(pos))){
					if(this.adDataArray[i-1][3] == true){
						var _tmp = new Array();
							_tmp[0] = pos;
							_tmp[1] = _style;
							_tmp[2] = _html;
							_tmp[3] = isdefault;
						this.adDataArray[i-1] = _tmp;
					}
				}
			}
			return this.adDataArray;
		},
		getUrlData: function(_adUrl,callBackFun,d){
			this.setCount();
			
			var _this = this;
			var _url = _adUrl;
			var _keyid = _this.keyId;
			$.ajax({
				url: _url,
				data: '',
				success: function(result){
					if(result){
						if(d && d=='1'){
							$.each(result,function(index,item){
								var _t_html = _this.getHtmlTemp(_this.renderTypes,result[index]);
								callBackFun(_this.ajaxCount, _this.setadDataArray(result[index]['position'],result[index]['mstyle'], _t_html, true));
							})
						}else{
							var _t_nhtml = _this.getHtmlTemp(_this.renderTypes,result,_keyid);
							callBackFun(_this.ajaxCount, _this.setadDataArray(result.position,result.mstyle, _t_nhtml, false));
						}
					}	
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(textStatus == 'error'){
						//console.log(XMLHttpRequest.status);
						// console.log(XMLHttpRequest.readyState);
						// console.log(textStatus);
						if(!d || typeof d === 'undefined'){
							if(_this.urlNone(_this.defaultUrl)){
								_this.getUrlData(_this.defaultUrl,_this.adRender,1);
							}
						}
					}
				}
			})
		},
		getHtmlTemp: function(rArr,data,_keyid){
			var _mArr = new Array();
			$.each(rArr,function(index,item){
				_mArr.push(index);
			})
			var _aeach = data;//广告
			var _adStyle = _aeach.mstyle;
			var adHtml = '';
			//判断类型 获取广告模板
			for(var i in _mArr){
				if(_adStyle == _mArr[i]){
					if(_keyid){
						adHtml = rArr[_adStyle](_aeach,_keyid);
					}else{
						adHtml = rArr[_adStyle](_aeach);
					}
				}
			}
			return adHtml;
		},
		adRender: function(counter,adHtmlArr){
			if(window.adResCount){
				window.adResCount += 1;
			}else{
				window.adResCount = 1;
			}
			if(window.adResCount >= counter){
				//根据位置插入广告
				var _ad_section = $('body').find('section[ad-position]');
				for(var j=0;j<_ad_section.length;j++){
					var _s = _ad_section.eq(j);
					var _adstyle = _s.attr("ad-style");
					var _position = _s.attr('ad-position');
						for(var k=0;k<adHtmlArr.length;k++){
							if(_position == adHtmlArr[k][0]){
								_s.attr("ad-style",adHtmlArr[k][1]);
								_s.html(adHtmlArr[k][2]);
								if(_position == '2'){
									$("body").addClass("has_b_ad");
								}
							}
						}
				}
				$('body').trigger('getImgSrc');
			}
		},
		renderTypes: {
			'img': function(data,_keyid){
				//通栏广告
				var str = '';
					if(_keyid){
						str +='<a href="/index/hits/index/id/'+_keyid+'/mpos/'+data.position+'" target="_blank">';
					}else{
						str +='<a href="'+data.link+'" target="_blank">';
					}
					if(data.setting["image"]!=''){
						str +='<div class="ic"><img data-src="'+data.setting["image"]+'" /><i class="ic_ad"></i></div>';
					}
					str +='</a>';
				return str;
			},
			'images': function(data,_keyid){
				//多图广告
				var imgLength = data.setting["image"].length;
				var str = '';
					if(_keyid){
						str +='<a href="/index/hits/index/id/'+_keyid+'/mpos/'+data.position+'" target="_blank">';
					}else{
						str +='<a href="'+data.link+'" target="_blank">';
					}
					if(imgLength>0){
						for(var i=0;i<imgLength;i++){
							str +='<div class="ic"><img data-src="'+data.setting["image"][i]+'" /><i class="ic_ad"></i></div>';
						}
					}
					str +='</a>';
				return str;
			},
			'imgtext': function(data,_keyid){
				//图文广告
				var str = '';
					if(_keyid){
						str +='<a href="/index/hits/index/id/'+_keyid+'/mpos/'+data.position+'" target="_blank">';
					}else{
						str +='<a href="'+data.link+'" target="_blank">';
					}
					if(data.setting["image"]!=''){
						str +='<div class="ic"><img data-src="'+data.setting["image"]+'" /><i class="ic_ad"></i></div>';
					}
					str +='<div class="font">';
					if(data.setting["adtitle"]!=''){
						str +='<h4>'+data.setting["adtitle"]+'</h4>';
					}
					if(data.setting["addesc"]!=''){
						str +='<p>'+data.setting["addesc"]+'</p>';
					}
					str +='</div>';
					str +='</a>';
				return str;
			}
		},
		setSrc: function(){
			var _body = $('body');
			var _window = $(window);
			var _h = _window.height();
			function scrollWorking(_doms){
				for(var i=0;i<_doms.length;i++){
					var _lsrc = $(_doms[i]).attr('data-src');
					if(_lsrc && typeof _lsrc!='undefined'){
						var _top = $(_doms[i]).offset().top;
						if(_window.scrollTop()+_h>_top){
							var _load_dom = $(_doms[i]);
							_load_dom.attr("src",_lsrc);
							_load_dom.removeAttr("data-src");
							if(!_load_dom.parent().is(".ic") && _load_dom.css("visibility") == 'visible' && _load_dom.css("width") == '0px'){
								_load_dom.css({
									"width":"100% !important",
									"height":"auto !important",
								})
							}
						}
					}
				}
			}
			_body.on('getImgSrc',function(){
				var _aDoms = _body.find("img[data-src]");
				if(_aDoms.length>0){
					scrollWorking(_aDoms);
					_window.on("scroll",function(){
						scrollWorking(_aDoms);
					})
				}
			})
		}
	}
	return AdRes;
})();