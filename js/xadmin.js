commonFun(); //执行这个函数
function commonFun() {
	//加载弹出层
	layui.use(['form', 'element'],
		function() {
			layer = layui.layer;
			element = layui.element;
		});

	//触发事件
	var tab = {
		tabAdd: function(title, url, id) {
			//新增一个Tab项
			element.tabAdd('xbs_tab', {
				title: title,
				content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="x-iframe"></iframe>',
				id: id
			})
		},
		tabDelete: function(othis) {
			//删除指定Tab项
			element.tabDelete('xbs_tab', '44'); //删除：“商品管理”

			othis.addClass('layui-btn-disabled');
		},
		tabChange: function(id) {
			//切换到指定Tab项
			element.tabChange('xbs_tab', id); //切换到：用户管理
		}
	};

	tableCheck = {
		init: function() {
			$(".layui-form-checkbox").click(function(event) {
				if($(this).hasClass('layui-form-checked')) {
					$(this).removeClass('layui-form-checked');
					if($(this).hasClass('header')) {
						$(".layui-form-checkbox").removeClass('layui-form-checked');
					}
				} else {
					$(this).addClass('layui-form-checked');
					if($(this).hasClass('header')) {
						$(".layui-form-checkbox").addClass('layui-form-checked');
					}
				}

			});
		},
		getData: function() {
			var obj = $(".layui-form-checked").not('.header');
			var arr = [];
			obj.each(function(index, el) {
				arr.push(obj.eq(index).attr('data-id'));
			});
			return arr;
		}
	}

	/*开启表格多选*/
	//tableCheck.init(); 暂时不要开启这个函数

	/*系统左侧导航栏折叠与展开*/
	$('.container .left_open i').click(function(event) {
		if($('.left-nav').css('left') == '0px') {
			$('.left-nav').animate({
				left: '-221px'
			}, 100);
			$('.page-content').animate({
				left: '0px'
			}, 100);
			$('.page-content-bg').hide();
		} else {
			$('.left-nav').animate({
				left: '0px'
			}, 100);
			$('.page-content').animate({
				left: '221px'
			}, 100);
			if($(window).width() < 768) {
				$('.page-content-bg').show();
			}
		}

	});

	$('.page-content-bg').click(function(event) {
		$('.left-nav').animate({
			left: '-221px'
		}, 100);
		$('.page-content').animate({
			left: '0px'
		}, 100);
		$(this).hide();
	});

	$('.layui-tab-close').click(function(event) {
		$('.layui-tab-title li').eq(0).find('i').remove();
	});

	/*左侧导航菜单效果*/
	/*用on绑定未来元素事件 */
	$(document).on("click", "#nav li", function(event) {
		$('#nav li cite').css("color", '#FFF')
		if($(this).children('.sub-menu').length) {
			if($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).find('.nav_right').html('&#xe697;');
				$(this).children('.sub-menu').stop().slideUp();
				$(this).siblings().children('.sub-menu').slideUp();
			} else {
				$(this).addClass('open');
				$(this).children('a').find('.nav_right').html('&#xe6a6;');
				$(this).children('.sub-menu').stop().slideDown();
				$(this).siblings().children('.sub-menu').stop().slideUp();
				$(this).siblings().find('.nav_right').html('&#xe697;');
				$(this).siblings().removeClass('open');
			}
		} else {
			var url = $(this).children('a').attr('_href');
			var title = $(this).find('cite').html();
			$(this).children("a").children("cite").css("color", '#faa732');
			var index = $('.left-nav #nav li').index($(this));
			for(var i = 0; i < $('.x-iframe').length; i++) {
				if($('.x-iframe').eq(i).attr('tab-id') == index + 1) {
					tab.tabChange(index + 1);
					event.stopPropagation();
					return;
				}
			};
			tab.tabAdd(title, url, index + 1);
			tab.tabChange(index + 1);
		}
		event.stopPropagation();
	});
};

/*弹出层*/
/*
    参数解释：
    title   标题
    url     请求的url
    id      需要操作的数据id
    w       弹出层宽度（缺省调默认值）
    h       弹出层高度（缺省调默认值）
*/
function x_admin_show(title, url, w, h) {
	if(title == null || title == '') {
		title = false;
	};
	if(url == null || url == '') {
		url = "404.html";
	};
	if(w == null || w == '') {
		w = ($(window).width() * 0.98);
	};
	if(h == null || h == '') {
		h = ($(window).height() - 50);
	};
	layer.open({
		type: 2,
		area: [w + 'px', h + 'px'],
		fix: false, //不固定
		maxmin: false, //禁止最大化操作
		shadeClose: true,
		shade: 0.4,
		title: title,
		content: url
	});
}

/*关闭弹出框口*/
function x_admin_close() {
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}

/*关闭弹出框口*/
function x_admin_close() {
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}

$(document).ready(function() {
	//刷新当前
	//此处添加禁止连续点击刷新一是为了降低服务器压力，另外一个就是为了防止超快点击造成chrome本身的一些js文件的报错(不过貌似这个问题还是存在，不过概率小了很多)
	$(".refresh").on("click", function() {
		if($(this).hasClass("refreshThis")) {
			$(this).removeClass("refreshThis");
			$(".layui-tab-content .layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload(true);
			setTimeout(function() {
				$(".refresh").addClass("refreshThis");
			}, 2000)
		} else {
			layer.msg("您点击的速度超过了服务器的响应速度，还是等两秒再刷新吧！");
		}
	});

	//关闭全部
	$(".closePageAll").on("click", function() {
		if($("#top_tabs li").length > 1) {
			$("#top_tabs li").each(function() {
				if($(this).attr("lay-id") != '') {
					element.tabDelete("xbs_tab", $(this).attr("lay-id")).init();
					window.sessionStorage.removeItem("menu");
					menu = [];
					window.sessionStorage.removeItem("curmenu");
				}
			})
		} else {
			layer.msg("没有可以关闭的窗口了@_@");
		}
		//渲染顶部窗口
		tab.tabMove();
	});
});

/*单击数据表格行任意位置勾选checkbox事件*/
/*$(document).on("click", ".layui-table-body table.layui-table tbody tr", function() {
	var index = $(this).attr('data-index');
	var tableBox = $(this).parents('.layui-table-box');
	//存在固定列
	if(tableBox.find(".layui-table-fixed.layui-table-fixed-l").length > 0) {
		tableDiv = tableBox.find(".layui-table-fixed.layui-table-fixed-l");
	} else {
		tableDiv = tableBox.find(".layui-table-body.layui-table-main");
	}
	var checkCell = tableDiv.find("tr[data-index=" + index + "]").find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
	if(checkCell.length > 0) {
		checkCell.click();
	}
});



$(document).on("click", "td div.laytable-cell-checkbox div.layui-form-checkbox", function(e) {
	e.stopPropagation();
});*/

/*
 * 禁用浏览器的放大缩小的快捷键  chrome 浏览器直接加上下面这个样式就行了，但是ff不识别
 */
$('body').css('zoom', 'reset');
$(document).keydown(function(event) {
	//event.metaKey mac的command键
	if((event.ctrlKey === true || event.metaKey === true) && (event.which === 61 || event.which === 107 || event.which === 173 || event.which === 109 || event.which === 187 || event.which === 189)) {
		event.preventDefault();
	}
});
$(window).bind('mousewheel DOMMouseScroll', function(event) {
	if(event.ctrlKey === true || event.metaKey) {
		event.preventDefault();
	}
});

/*
 * 封装layUI数据表格时间列格式化
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
 */
function FormatDate(datetime, fmt) {

	if(parseInt(datetime) == datetime) {
		if(datetime.length == 10) {
			datetime = parseInt(datetime) * 1000;
		} else if(datetime.length == 13) {
			datetime = parseInt(datetime);
		}
	}
	datetime = new Date(datetime);
	var o = {
		"M+": datetime.getMonth() + 1, //月份   
		"d+": datetime.getDate(), //日   
		"h+": datetime.getHours(), //小时   
		"m+": datetime.getMinutes(), //分   
		"s+": datetime.getSeconds(), //秒   
		"q+": Math.floor((datetime.getMonth() + 3) / 3), //季度   
		"S": datetime.getMilliseconds() //毫秒   
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};