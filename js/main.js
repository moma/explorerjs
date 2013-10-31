listGexfs();

if(typeof(getUrlParam.file)!=="undefined"){
    $.doTimeout(30,function (){
        parse(getUrlParam.file);
        nb_cats = scanCategories();  
        pr("nb_cats: "+nb_cats);
        listGexfs();
        
        if(nb_cats==1) startOnePartite(getUrlParam.file); 
        else if(nb_cats==2) startBipartite(getUrlParam.file);
        
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

function startOnePartite(pathfile) {
    bipartite=false;
    $("#labelchange").hide();
    $("#availableView").hide(); 
    $("#category-B").hide();
    $("#images").hide();
    
    pr("in one partite net");    
    pr("pathfile: "+pathfile);
    partialGraph = sigma.init(document.getElementById('sigma-example'))
    .drawingProperties(sigmaJsDrawingProperties)
    .graphProperties(sigmaJsGraphProperties)
    .mouseProperties(sigmaJsMouseProperties);
    
    partialGraph.ctxMini = document.getElementById('overview').getContext('2d'); 
    partialGraph.ctxMini.clearRect(0, 0, overviewWidth, overviewHeight);
    partialGraph.totalScroll=0;    
    partialGraph.centreX = partialGraph._core.width/2;
    partialGraph.centreY = partialGraph._core.heigth/2;
       
    $('#sigma-example').css('background-color','white');
    
    console.log("parsing...");        
    parse(pathfile);
    onepartiteExtract();    
    updateEdgeFilter("social");
    updateNodeFilter("social");
    console.log("Parsing complete.");
    
    /*======= Show some labels at the beginning =======*/
//    minIn=50,
//    maxIn=0,
//    minOut=50,
//    maxOut=0;        
//    partialGraph.iterNodes(function(n){
//        if(parseInt(n.inDegree) < minIn) minIn= n.inDegree;
//        if(parseInt(n.inDegree) > maxIn) maxIn= n.inDegree;
//        if(parseInt(n.outDegree) < minOut) minOut= n.outDegree;
//        if(parseInt(n.outDegree) > maxOut) maxOut= n.outDegree;
//    });
//    partialGraph.iterNodes(function(n){
//        if(n.inDegree==minIn) n.forceLabel=true;
//        if(n.inDegree==maxIn) n.forceLabel=true;
//        if(n.outDegree==minOut) n.forceLabel=true;
//        if(n.outDegree==maxOut) n.forceLabel=true;
//    });
    /*======= Show some labels at the beginning =======*/
    
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8).draw();
    initializeMap();
    updateMap();
    updateDownNodeEvent(false);
        /* Initial Effect (Add: unchecked) HIDE */
    partialGraph.bind('overnodes',function(event){ 
        var nodes = event.content;
        var neighbors = {};
        var nrEdges = 0;
        var e = partialGraph._core.graph.edges;
        for(i=0;i<e.length;i++){
            if(nodes.indexOf(e[i].source.id)>=0 || nodes.indexOf(e[i].target.id)>=0){
                neighbors[e[i].source.id] = 1;
                neighbors[e[i].target.id] = 1;
                nrEdges++;//github.com/jacomyal/sigma.js/issues/62
            }
        }
        //partialGraph.draw(2,1,2);
        partialGraph.iterNodes(function(n){
            if(nrEdges>0) {
                if(!neighbors[n.id]){
                    n.hidden = 1;
                }else{
                    n.hidden = 0;
                }
            }
        }).draw(2,1,2);
    });
  
    partialGraph.bind('outnodes',function(){
        var e = partialGraph._core.graph.edges;
        for(i=0;i<e.length;i++){
            e[i].hidden = 0;
        }
        partialGraph.draw(2,1,2);
            
        partialGraph.iterNodes(function(n){
            n.hidden = 0;
        }).draw(2,1,2);
    });
    /* Initial Effect (Add: unchecked) HIDE */
    
    partialGraph.startForceAtlas2();
    
    $("#aUnfold").click(function() {
        var _cG = $("#leftcolumn");
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
        pr("item-desc: "+item.desc);
        pr("searchVal: "+searchVal);
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
    $("#searchinput").keyup(function (e) {
        if (e.keyCode == 13 && $("input#searchinput").data('is_open') !== true) {
            var s = $("#searchinput").val();
            search(s);
            $("#searchinput").val(strSearchBar);
        }         
    });
    
    
    $("#searchinput").keydown(function (e) {
        if (e.keyCode == 13 && $("input#searchinput").data('is_open') === true) {            
            if(!is_empty(matches)) {
                checkBox=true;
                for(j=0;j<matches.length;j++){
                    nodeFound=searchLabel(matches[j].label);
                    getOpossitesNodes(nodeFound,true); 
                }
            }
        }
        if(categoriesIndex.length==1) updateLeftPanel_uni();
        if(categoriesIndex.length==2) updateLeftPanel();
        
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
    });
    
    $("#searchsubmit").click(function () {
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
        
        cancelSelection();    
        /***** The animation *****/
        _cG = $("#leftcolumn");    
        _cG.animate({
            "left" : "-" + _cG.width() + "px"
        }, function() {
            $("#aUnfold").attr("class","rightarrow");
            $("#zonecentre").css({
                left: "0"
            });
        });
    /***** The animation *****/
    });
    
    $("#overview")
    //    .mousemove(onOverviewMove)
    //    .mousedown(startMove)
    //    .mouseup(endMove)
    //    .mouseout(endMove)
    .mousewheel(onGraphScroll);
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
            $.doTimeout(300,function (){
                partialGraph.iterNodes(function (n) {
                    //if(n.id.charAt(0)=="D") {
                        n.size = parseFloat(Nodes[n.id].size) + parseFloat((ui.value-1))*0.3;
                    //}
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
            if(cursor_size==0) updateDownNodeEvent(false);
            else updateDownNodeEvent(true); 
        //return callSlider("#sliderSelectionZone", "selectionRadius");
        }
    });
    camaraButton();
}

function startBipartite(pathfile) {
    bipartite=true;
    //currentUrl=window.location.href;
    pr("pathfile: "+pathfile);
    partialGraph = sigma.init(document.getElementById('sigma-example'))
    .drawingProperties(sigmaJsDrawingProperties)
    .graphProperties(sigmaJsGraphProperties)
    .mouseProperties(sigmaJsMouseProperties);
    partialGraph.type="social";
    
    startMiniMap();
    
    console.log("parsing...");       
    parse(pathfile);
    fullExtract(); 
    updateEdgeFilter("social");
    updateNodeFilter("social");
    pushSWClick("social");
    cancelSelection(false);
    console.log("Parsing complete.");     
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8).draw(2,2,2);
    partialGraph.startForceAtlas2();   

    startEnviroment(); 
    camaraButton();
}
