$(function () {
    if(!window.localStorage.getItem("bookmark")){
        var initDta = [
            {"name":"Google","url":"http://www.google.com"},
            {"name":"Chrome商店","url":"https://chrome.google.com/webstore/category/apps"},
            {"name":"新浪微博","url":"http://weibo.com"},
            {"name":"百度","url":"http://www.baidu.com"},
            {"name":"天猫","url":"https://www.tmall.com"}
        ];
        localStorage.setItem("bookmark",JSON.stringify(initDta));
    }
    if(!window.localStorage.getItem("engine")){
        localStorage.setItem("engine","baidu");
    }
    var storage =window.localStorage.getItem("bookmark");
    var storageJson =JSON.parse(storage);
    var searchInput =  $("#searchInput");

    // 加载默认引擎
    $("#searchengine").attr({
        "now": localStorage.getItem("engine"),
        "class":"searchChoose s-" + localStorage.getItem("engine")
    })
    searchInput.unbind("keydown").bind("keydown",function(e){
        if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
            if (e.keyCode == 13) {
                searchInput.focus();
                $('.suggest').hide();
                setTimeout(function () {
                    search();
                }, 200);
                return false;
            }
            if ($('.suggest').css('display') != 'none') {
                var index = $('.suggest li').get().indexOf($('.suggest li.selected').get(0));
                if (e.keyCode == 38 || e.keyCode == 40) {
                    var nextIndex = 0;
                    if (index == -1) {
                        if (e.keyCode == 38) {
                            nextIndex = $('.suggest li').length - 1;
                        }
                    } else {
                        nextIndex = e.keyCode == 38 ? (index - 1) : (index + 1);
                    }
                    $('.suggest li').removeClass('selected');
                    var nextObj = $('.suggest li')[nextIndex];
                    if (typeof nextObj != 'undefined') {
                        $(nextObj).addClass('selected');
                        searchInput.val($(nextObj).attr('keyword'));
                    }
                }
            }
        }
    });
    var loadSearch = function(){
        var keyword = $("#searchInput").val()||"";
        var self = searchInput;
        if(keyword){
            getBaiduSuggestion(self,keyword);
        }
    };
    searchInput.unbind('keyup').bind('keyup',function(e){
        if(e.keyCode ==  38 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode==27){
            if(e.keyCode==27){
                $('.suggest').hide();
            }
            return false;
        }
        loadSearch();
    });
    searchInput.on('webkitspeechchange',function(){
        loadSearch();
    });
    var bookmark = {
        init: function(){
            this.load();
        },
        load: function(add){
            if(add){
                var mark =this.create(storageJson.length - 1);
                $("#navlist").append(mark);
            }else{
                for(var i=0;i<storageJson.length;i++){
                    var mark = this.create(i);
                    $("#navlist").append(mark);
                }
            }
        },
        create: function (num) {
            var markelment = "<li><a href='"+ storageJson[num].url +"'><i class='icon'><img class='favico' src='chrome://favicon/"+storageJson[num].url +"'></i><span class='name'>"+storageJson[num].name+"</span></a><i class='delete' data-url='"+ storageJson[num].url +"'></i></li>"
            return markelment;
        },
        add:function(){
            var isFill=true;
            if(!$("#markbookName").val()){
                $("#markbookName").addClass("warn");
                isFill = false;
            }
            if(!$("#markbookUrl").val()){
                $("#markbookUrl").addClass("warn");
                isFill = false;
            }
            if(isFill){
                if(storageJson.length<16){
                    var menber = {"name":$("#markbookName").val(),"url":$("#markbookUrl").val()}
                    storageJson[storageJson.length]=menber;
                    window.localStorage.setItem("bookmark",JSON.stringify(storageJson));
                    this.load(1);
                    $(".successtip").removeClass("hidden");
                }else{
                    $(".successtip span").html("<i class='false'></i>保存失败：标签项已达最大!");
                    //$(".successtip span i").className ="false";
                    $(".successtip").removeClass("hidden");
                }

            }
        },
        delete:function(index){
            storageJson.splice(index,1);
            window.localStorage.setItem("bookmark",JSON.stringify(storageJson));
        }
    }

    getBingImage();
    setITabBackgroundImage();
    $("label.onoffswitch").click(function(){
        if($("#myonoffswitch").prop("checked") == true){
            $("#myonoffswitch").prop("checked",false);
        }else{
            $("#myonoffswitch").prop("checked",true);
        }
    });
    $("#searchbtn").click(function(){
        search();
    })
    $(".markbookinfo").focus(function(){
        $(this).removeClass("warn");
    })
    $("#save").click(function(){
        bookmark.add();
    })
    $("#navlist").on("click",".delete",function(){
        var index = $(this).parent().index();
        bookmark.delete(index);
        $(this).parent().remove();
    })
    $(".searchinput").keydown(function(event){
        if (event.keyCode == 13){
            search();
        }
    });
    $(".markbookUrl").keydown(function(event){
        if (event.keyCode == 39&&!$(this).val()){
            $(this).val("http://");
        }
    });
    $("i.close").click(function () {
        $(".addmark").addClass("hidden");
        $(".successtip").addClass("hidden");
        $(".successtip span").html("<i></i>保存成功");
        $(".successtip span i").className ="ok";
        $(".markbookinfo").val("");
    })
    $("li.add").click(function () {
        $(".addmark").removeClass("hidden");
    })
    $(".link a[chrome-href]").click(function(){
        chrome.tabs.create({url: $(this).attr("chrome-href")});
    })
    if($(".searchinput").val()!=""){

    }
    $(".searchinput").change(function(){
        loadsuggest();
    })
    $(document).bind('click',function(){
        $('.suggest').hide();
    });
    $(".searchEngineitem").on("click",function(){
        var engine = $(this).attr("value");
        $("#searchengine").attr({
            "now":engine,
            "class":"searchChoose s-"+engine
        })
        $(".allSearchEngine").hide();
        $(".engineCorner").css("transform","rotate(0deg)");
        window.localStorage.setItem("engine",engine);
    })
    $(".engineCorner").on("click", function () {
        var isShow = $(".allSearchEngine").css("display");
        if( isShow == 'none'){
            $(".allSearchEngine").show();
            $(this).css("transform","rotate(180deg)");
        }else{
            $(".allSearchEngine").hide();
            $(this).css("transform","rotate(0deg)");
        }
    })
    bookmark.init();
})

function enterSearch(event){
    var keyCode = event.keyCode?event.keyCode:event.which?event.which:event.charCode;
    if (keyCode ==13){
        search();
    }
}

function search(){
    var searchtool = $("#searchengine").attr("now");
    // var value = spacereg($(".searchinput").val());
    var value = $(".searchinput").val();
    var searchEngine=[
        {"engine":"google","search":"https://www.google.com/search?q="},
        {"engine":"bing","search":"https://www.bing.com/search?q="},
        {"engine":"baidu","search":"https://www.baidu.com/s?wd="}
    ];
    if(value){
        for(var i=0;i<searchEngine.length;i++){
            if(searchtool==searchEngine[i].engine){
                location.href =searchEngine[i].search+encodeURIComponent(value);
            }
        }
    }
}

function spacereg(value){
    var arr = new Array();
    arr= value.split(" ");
    if(arr.length>=2){
        var newValue=arr[0];
        for(var i=1;i<arr.length;i++){
            newValue +="%20"+arr[i];
        }
        value =newValue;
    }
    return value;
};


function getSuggestion(self,keyword){
    $.getJSON("https://www.google.com.hk/complete/search?client=hp&hl=zh-CN&gs_nf=3&cp=7&gs_id=qv&q=" + encodeURIComponent(keyword) + "&xhr=t",function(data) {
        if(keyword!=self.val()){
            $('.suggest').hide();
            return;
        }
        if(data){
            try{
                if(data[1].length > 0){
                    var suggestContent = '<ul>';
                    $.each(data[1], function(i,n){
                        suggestContent += '<li keyword="' + n[0] + '">' + n[0].replace(keyword,'<label>' + keyword + '</label>') + '</li>';
                    });
                    suggestContent += '</ul>';
                    if($('.suggest').css('display') == 'none'){
                        $('.suggest').show();
                    }
                    $('.suggest').html(suggestContent);
                    $('.suggest li').unbind('click').bind('click',function(){
                        self.val($(this).attr('keyword'));
                        self.focus();
                        $('.suggest').hide();
                        setTimeout(function(){
                            search();
                        },200);
                    }).unbind('mouseover').bind('mouseover',function(){
                        $('.suggest li').removeClass('selected');
                        $(this).addClass('selected');
                    });
                }else{
                    $('.suggest').hide();
                }
            }catch(err){
                $('.suggest').hide();
            }
        }else{
            $('.suggest').hide();
        }
    }).error(function() { $('.suggest').hide(); });
}

function getBaiduSuggestion(self,keyword){
    $.ajax({
        url:"http://suggestion.baidu.com/su?wd=" + encodeURIComponent(keyword) + "&p=3&t=" + new Date().getTime()+"&cb=cbackc",
        dataType:'text',
        error:function() {
            $('.suggest').hide();
        },
        success:function(data){
            if(keyword!=self.val()||!data){
                $('.suggest').hide();
                return;
            }
            try{
                data = data.match(/cbackc\((.*)\);/)[1];
                try {
                    data = window.eval('(' + data + ')');
                } catch (err1) {
                    data = JSON.parse(data);
                }
                if(data.s.length > 0){
                    var suggestContent = '<ul>';
                    $.each(data.s, function(i,n){
                        suggestContent += '<li keyword="' + n + '">' + n.replace(keyword,'<label>' + keyword + '</label>') + '</li>';
                    });
                    suggestContent += '</ul>';
                    if($('.suggest').css('display') == 'none'){
                        $('.suggest').show();
                    }
                    $('.suggest').html(suggestContent);
                    $('.suggest li').unbind('click').bind('click',function(){
                        self.val($(this).attr('keyword'));
                        self.focus();
                        $('.suggest').hide();
                        setTimeout(function(){
                            search();
                        },200);
                    }).unbind('mouseover').bind('mouseover',function(){
                        $('.suggest li').removeClass('selected');
                        $(this).addClass('selected');
                    });
                }else{
                    $('.suggest').hide();
                }
            }catch(err){
                $('.suggest').hide();
            }
        }
    });
 }

 function getBingImage() {

     // BIng (GET http://cn.bing.com/HPImageArchive.aspx)

     $.ajax({
         url: "http://cn.bing.com/HPImageArchive.aspx",
         type: "GET",
         data: {
             "format": "js",
             "idx": "0",
             "n": "1",
         },
     })
         .done(function(data, textStatus, jqXHR) {
             console.log("HTTP Request Succeeded: " + jqXHR.status);
             console.log(data);
             if(data.images){
                 var url = data.images[0].url;
                 if(url) {
                     setBackgroundImage("http://cn.bing.com/" + url);
                 }
             }

         })
         .fail(function(jqXHR, textStatus, errorThrown) {
             console.log("HTTP Request Failed");
         })
         .always(function() {
             /* ... */
         });

 }

function setITabBackgroundImage() {
    var deadline = localStorage.getItem("loadtime");
    if(localStorage.getItem("imgUrl")&&deadline&&Date.now()-deadline<1800000){
        $(".bgimg").css({
            "background-image":"url("+ localStorage.getItem("imgUrl")+")"
        });
    }else{
        getBingImage();
    }
}

function setBackgroundImage(imageUrl) {

    if (!imageUrl){
        var randomNum = parseInt(Math.random()*100)+1;
        imageUrl = "http://7xl5i2.com1.z0.glb.clouddn.com/img_"+randomNum+".jpg";
    }

    $(".bgimg").css({
        "background-image":"url("+ imageUrl+")"
    });
    localStorage.setItem("imgUrl",imageUrl);
    localStorage.setItem("loadtime",Date.now());
}