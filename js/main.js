listGexfs();

if(typeof(getUrlParam.file)!=="undefined"){
    $.doTimeout(30,function (){
        parse(getUrlParam.file);
        nb_cats = scanCategories();  
        pr("nb_cats: "+nb_cats);
        listGexfs();
        
        if(nb_cats==1) bringTheNoise(getUrlParam.file,"mono");
        else if(nb_cats==2) bringTheNoise(getUrlParam.file,"bi")
        
        $.doTimeout(30,function (){
            $("#currentGraph").html(getUrlParam.file);
        });            
    });
} else {
    window.location.href=window.location.origin+window.location.pathname+"?file="+mainfile;
}


function listGexfs(){
    $.ajax({
        type: 'GET',
        url: 'php/listFiles.php',
        data: "url=nothing",
        //contentType: "application/json",
        //dataType: 'json',
        success : function(data){ 
            $("#gexfs").html(data);
        },
        error: function(){ 
            console.log("Page Not found.");
        }
    });    
}

function bringTheNoise(pathfile,type){
    pr("I'm in the new function");
    partialGraph = sigma.init(document.getElementById('sigma-example'))
    .drawingProperties(sigmaJsDrawingProperties)
    .graphProperties(sigmaJsGraphProperties)
    .mouseProperties(sigmaJsMouseProperties);
    
    startMiniMap();
    
    console.log("parsing...");       
    parse(pathfile);
    
    if(type=="mono") {
        onepartiteExtract(); 
        $("#left").hide();
    }
    else if(type=="bi") {
        fullExtract(); 
    }
    
    updateEdgeFilter("social");
    updateNodeFilter("social");
    pushSWClick("social");
    cancelSelection(false);
    console.log("Parsing complete.");     
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8).draw(2,2,2);
    partialGraph.startForceAtlas2();   
    
    $("#tips").html(getTips());
    $('#sigma-example').css('background-color','white');
    $("#category-B").hide();
    $("#labelchange").hide();
    $("#availableView").hide();  
    /*======= Show some labels at the beginning =======*/
    minIn=50,
    maxIn=0,
    minOut=50,
    maxOut=0;        
    partialGraph.iterNodes(function(n){
        if(n.hidden==false){
            if(parseInt(n.inDegree) < minIn) minIn= n.inDegree;
            if(parseInt(n.inDegree) > maxIn) maxIn= n.inDegree;
            if(parseInt(n.outDegree) < minOut) minOut= n.outDegree;
            if(parseInt(n.outDegree) > maxOut) maxOut= n.outDegree;
        }
    });
    counter=0;
    n = partialGraph._core.graph.nodes;
    for(i=0;i<n.length;i++) {
        if(n[i].hidden==false){
            if(n[i].inDegree==minIn && n[i].forceLabel==false) {
                n[i].forceLabel=true;
                counter++;
            }
            if(n[i].inDegree==maxIn && n[i].forceLabel==false) {
                n[i].forceLabel=true;
                counter++;
            }
            if(n[i].outDegree==minOut && n[i].forceLabel==false) {
                n[i].forceLabel=true;
                counter++;
            }
            if(n[i].outDegree==maxOut && n[i].forceLabel==false) {
                n[i].forceLabel=true;
                counter++;
            }
            if(counter==6) break;
        }
    }
    /*======= Show some labels at the beginning =======*/
    initializeMap();
    updateMap();
    
    updateDownNodeEvent(false);    
    
    
    
    
    
    $("#loading").remove();
    $("#saveAs").click(function() {
        saveGEXF();
    });
    $("#aUnfold").click(function() {
        _cG = $("#leftcolumn");
        if (_cG.offset().left < 0) {
            _cG.animate({
                "left" : "0px"
            }, function() {
                $("#aUnfold").attr("class","leftarrow");
                $("#zonecentre").css({
                    left: _cG.width() + "px"
                });
            }); 
        } else {
            _cG.animate({
                "left" : "-" + _cG.width() + "px"
            }, function() {
                $("#aUnfold").attr("class","rightarrow");
                $("#zonecentre").css({
                    left: "0"
                });
            });
        }
        return false;
    });
    
    
    /******************* /SEARCH ***********************/
    $.ui.autocomplete.prototype._renderItem = function(ul, item) {
        var searchVal = $("#searchinput").val();
        var desc = extractContext(item.desc, searchVal);
        return $('<li onclick=\'var s = "'+item.label+'"; search(s);$("#searchinput").val(strSearchBar);\'></li>')
        .data('item.autocomplete', item)
        .append("<a><span class=\"labelresult\">" + item.label + "</span><br ><small>" + desc + "<small></a>" )
        .appendTo(ul);
    };

    $('input#searchinput').autocomplete({
        source: function(request, response) {
            matches = [];
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            var results = $.grep(labels, function(e) {
                return matcher.test(e.label) || matcher.test(e.desc);
            });
            
            if (!results.length) {
                $("#noresults").text("Pas de résultats");
            } else {
                $("#noresults").empty();
            }
            matches = results.slice(0, maxSearchResults);
            response(matches);
            
        },
        minLength: minLengthAutoComplete
    }); 
   
    $('#searchinput').bind('autocompleteopen', function(event, ui) {
        $(this).data('is_open',true);
    });
    $('#searchinput').bind('autocompleteclose', function(event, ui) {
        $(this).data('is_open',false);
    });
    $("#searchinput").focus(function () {
        if ($(this).val() == strSearchBar) {
            $(this).val('');
        }
    });
    $("#searchinput").blur(function () {
        if ($(this).val() == '') {
            $(this).val(strSearchBar);
        }
    });
    
    
    $("#searchinput").keydown(function (e) {
        if (e.keyCode == 13 && $("input#searchinput").data('is_open') === true) {
            if(!is_empty(matches)) {
                pr("im here");
                checkBox=true;
                for(j=0;j<matches.length;j++){
                    nodeFound=searchLabel(matches[j].label);
                    getOpossitesNodes(nodeFound,true); 
                }

                if(is_empty(selections)==true){  
                    $("#names").html("");
                    $("#opossiteNodes").html("");
                    $("#information").html("");
                    changeButton("unselectNodes");
                }
                else {
                    greyEverything();
                    for(var i in selections){
                        markAsSelected(i,true);
                    }
                    changeButton("selectNode");
                    partialGraph.draw();
                }
                checkBox=false;
                $("input#searchinput").val("");
                $("input#searchinput").autocomplete( "close" );
                //$("input#searchinput").trigger('autocompleteclose');
            }
        }
    });
    
    
    $("#searchinput").keyup(function (e) {
        if (e.keyCode == 13 && $("input#searchinput").data('is_open') !== true) {
            var s = $("#searchinput").val();
            $("#searchinput").val(strSearchBar);
            if(categoriesIndex.length==1) updateLeftPanel_uni();
            if(categoriesIndex.length==2) updateLeftPanel();            
        }
    });
    
    $("#searchsubmit").click(function () {
        pr("in searchsubmit()");
        var s = $("#searchinput").val();
        search(s);
        $("#searchinput").val(strSearchBar);
    });
    /******************* /SEARCH ***********************/

    
    $("#lensButton").click(function () {
        partialGraph.position(0,0,1);
        partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
        partialGraph.refresh();
        partialGraph.startForceAtlas2();
    });
    
    $('#sigma-example').dblclick(function(event) {
        pr("monograph: in the double click event");
        targeted = partialGraph._core.graph.nodes.filter(function(n) {
                return !!n['hover'];
            }).map(function(n) {
                return n.id;
            });
            
        if(!is_empty(targeted)){
            changeHoverActive(document.getElementById("switch"));
        }
        else {
            if(!is_empty(selections)){
                cancelSelection(false);
            }
        }
    });
    
    
    $("#overview")
    //    .mousemove(onOverviewMove)
    //    .mousedown(startMove)
    //    .mouseup(endMove)
    //    .mouseout(endMove)
    .mousewheel(onGraphScroll);
    
    //$("sigma-example")
    //    .mousemove(onOverviewMove)
    //    .mousedown(startMove)
    //    .mouseup(endMove)
    //    .mouseout(endMove)
    //    .mousewheel(onGraphScroll); -> it doesn't answer!
    
    
    $("#zoomPlusButton").click(function () {
        partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, partialGraph._core.mousecaptor.ratio * 1.5);
        $("#zoomSlider").slider("value",partialGraph.position().ratio);
        return false;
    });
    $("#zoomMinusButton").click(function () {
        partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, partialGraph._core.mousecaptor.ratio * 0.5);
        $("#zoomSlider").slider("value",partialGraph.position().ratio);
        return false;
    });
    
    $("#edgesButton").click(function () {
        if(edgesTF==false){
            partialGraph.stopForceAtlas2();
            partialGraph.draw();
            edgesTF=true;
        }
        else {
            partialGraph.startForceAtlas2();
            edgesTF=false;
        }
    });
   
    $("#sliderANodeSize").slider({
        value: 1,
        min: 1,
        max: 25,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(100,function (){
                partialGraph.iterNodes(function (n) {
                    pr();
                    if(Nodes[n.id].type==catSoc) {
                        n.size = parseFloat(Nodes[n.id].size) + parseFloat((ui.value-1))*0.3;
                    }
                });
                partialGraph.draw();
            });
        }
    });
    $("#sliderBNodeSize").slider({
        value: 1,
        min: 1,
        max: 25,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(100,function (){
                partialGraph.iterNodes(function (n) {
                    if(Nodes[n.id].type==catSem) {
                        n.size = parseFloat(Nodes[n.id].size) + parseFloat((ui.value-1))*0.3;
                    }
                });
                partialGraph.draw();
            });
        }
    });
    $("#sliderSelectionZone").slider({
        value: cursor_size * 5.0,
        min: 0.0,
        max: 150.0,
        animate: true,
        change: function(event, ui) {
            cursor_size= ui.value;
            //if(cursor_size==0) updateDownNodeEvent(false);
            //else updateDownNodeEvent(true); 
        //return callSlider("#sliderSelectionZone", "selectionRadius");
        }
    });
}