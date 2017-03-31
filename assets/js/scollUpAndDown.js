/**
 * Created by Mealie on 2017/3/24.
 */
var div2Height = Number($('.div2').offsetTop);
    var clientHeight = Number($(document).clientHeight);
    var totalHeight = div2Height - clientHeight;
    var objOffset = $('.div2').offset().top;
    var objOffsetLf = $().offset().left;
    $(document).ready(function(){
        $(window).scroll(function(){
            var scrollTop= $(window).scrollTop();
            //$(window).scrollTop()这个方法是当前滚动条滚动的距离
            //$(window).height()获取当前窗体的高度
            //$(document).scrollTop()获取当前文档的高度
            var objHeight = objOffset - scrollTop;
            console.log(scrollTop);
            if(scrollTop>=0) {
                $('.div2').css({'left': objOffsetLf, 'top': objHeight, 'position': 'absolute', 'margin-top': '0px'});
            }else{
                $('.div2').css({'position':'static','margin-top':'500px'});
            }
        });
    });