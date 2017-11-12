#### ad-res.js广告模版渲染 ####

---

为文章页面增加顶部以及底部广告

1.在页面放广告的地方先放上广告占位元素
比如
头部广告`<section class="ad_top" ad-position="1"></section>`
底部广告`<div class="ad_box"><div class="ad_title"><h4>广告</h4></div><section class="ad_bottom" ad-position="2"></section></div>`

2.页面上引入广告方式
```
var ad_res = new AdRes({
	keyId: "3571", //temp id
	adUrl_top: "/m/1/224.json", //top ad
	adUrl_bottom: "/m/1/216.json", //bottom ad
	defaultUrl: '/m/media.json' //default ad
})
```

3.ajax获取广告json数据，根据数据中广告类型，获得广告模版，
当头部或者底部广告内容无法获取时，使用默认的缺省广告代替，
ajax异步时获取广告的顺序可能发生变化，要注意不要使缺省广告把用户adURL设置的广告覆盖掉，
所以在`window.AdRes.setadDataArray`加入了isdefault的判断，
当广告都获取完后执行插入广告并使用懒加载。


---