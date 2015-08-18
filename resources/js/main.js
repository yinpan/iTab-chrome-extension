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
    var storage =window.localStorage.getItem("bookmark");
    var storageJson =JSON.parse(storage);
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
    var setBG= function () {
        var deadline = localStorage.getItem("loadtime");
        if(localStorage.getItem("imgUrl")&&deadline&&Date.now()-deadline<1800000){
            $(".bgimg").css({
                "background-image":"url("+ localStorage.getItem("imgUrl")+")"
            });
        }else{
            var randomNum = parseInt(Math.random()*100)+1;
            var imgUrl = "http://7xl5i2.com1.z0.glb.clouddn.com/img_"+randomNum+".jpg";
            $(".bgimg").css({
                "background-image":"url("+ imgUrl+")"
            });
            localStorage.setItem("imgUrl",imgUrl);
            localStorage.setItem("loadtime",Date.now());
        }
    }
    setBG();
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
        var index = $(this).index();
        bookmark.delete(index - 1);
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
    var value = spacereg($(".searchinput").val());
    var searchEngine=[
        {"engine":"google","search":"https://www.google.com/?gws_rd=ssl#q="},
        {"engine":"bing","search":"https://www.bing.com/search?q="},
        {"engine":"haosou","search":"http://www.haosou.com/s?q="},
        {"engine":"baidu","search":"https://www.baidu.com/s?wd="}
    ];
    if(value){
        for(var i=0;i<searchEngine.length;i++){
            if(searchtool==searchEngine[i].engine){
                location.href =searchEngine[i].search+value;
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
            newValue +="+"+arr[i];
        }
        value =newValue;
    }
    return value;
};
