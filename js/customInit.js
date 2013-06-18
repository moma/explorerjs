
function pr(msg) {
    console.log(msg);
}
var oposMAX;
function ArraySortByValue(array, sortFunc){
    var tmp = [];
    oposMAX=0;
    for (var k in array) {
        if (array.hasOwnProperty(k)) {
            tmp.push({
                key: k, 
                value:  array[k]
            });
            if((array[k]) > oposMAX) oposMAX= array[k];
        }
    }

    tmp.sort(function(o1, o2) {
        return sortFunc(o1.value, o2.value);
    });   
    return tmp;      
}

function ArraySortByKey(array, sortFunc){
    var tmp = [];
    for (var k in array) {
        if (array.hasOwnProperty(k)) {
            tmp.push({
                key: k, 
                value:  array[k]
            });
        }
    }

    tmp.sort(function(o1, o2) {
        return sortFunc(o1.key, o2.key);
    });   
    return tmp;      
}
    
function extractContext(string, context) {
    var matched = string.toLowerCase().indexOf(context.toLowerCase());

    if (matched == -1) 
        return string.slice(0, 20) + '...';

    var begin_pts = '...', end_pts = '...';

    if (matched - 20 > 0) {
        var begin = matched - 20;
    } else {
        var begin = 0;
        begin_pts = '';
    }

    if (matched + context.length + 20 < string.length) {
        var end = matched + context.length + 20;
    } else {
        var end = string.length;
        end_pts = '';
    }

    str = string.slice(begin, end);

    if (str.indexOf(" ") != Math.max(str.lastIndexOf(" "), str.lastIndexOf(".")))
        str = str.slice(str.indexOf(" "), Math.max(str.lastIndexOf(" "), str.lastIndexOf(".")));

    return begin_pts + str + end_pts;
}
  
function cancelSelection () {
    pr("\tin cancelSelection");
    highlightSelectedNodes(false); //Unselect the selected ones :D
    opossites = [];
    selections = [];
    partialGraph.refresh();
    
    $("#names").html(""); 
    $("#opossiteNodes").html("");
    $("#information").html("");
    
    //Nodes colors go back to normal
    overNodes=false;
    var e = partialGraph._core.graph.edges;
    for(i=0;i<e.length;i++){
        e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
        e[i].attr['grey'] = 0;
    }
    partialGraph.draw(2,1,2);
                
    partialGraph.iterNodes(function(n){
        n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
        n.attr['grey'] = 0;
    }).draw(2,1,2);
    //Nodes colors go back to normal
    changeButton("unselectNodes");
    $("#aUnfold").click();
}

function returnBaseUrl(){
    origin = window.location.origin;
    nameOfHtml=window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
    pathname = window.location.pathname.replace(nameOfHtml,"");
    return origin+pathname;
}

function highlightSelectedNodes(flag){  
    if(!is_empty(selections)){            
        fullurl = returnBaseUrl()+"img/trans/";                
        for(var i in selections) {
            if(i.charAt(0)=="D" && document.getElementById("socio").src==fullurl+"active_scholars.png"){
                node = partialGraph._core.graph.nodesIndex[i];
                node.active = flag;
            }
            else if(i.charAt(0)=="N" && document.getElementById("semantic").src==fullurl+"active_tags.png") {
                node = partialGraph._core.graph.nodesIndex[i];
                node.active = flag;
            }
            else if(document.getElementById("sociosemantic").src==fullurl+"active_sociosem.png") {
                node = partialGraph._core.graph.nodesIndex[i];
                node.active = flag;
            }
            else break;        
        }
        
    }
}

function search(string) {
    var id_node = '';
    partialGraph.iterNodes(function (n) {
        if (n.label == string) {
            id_node = n.id;
            return;
        }                
    });
    getOpossitesNodes(id_node, false);
    updateLeftPanel();
    
    
    var greyColor = '#9b9e9e';/**/
    overNodes=true;
    var nodes = id_node;
    var neighbors = {};
    var e = partialGraph._core.graph.edges; 
    for(i=0;i<e.length;i++){
        if(nodes.indexOf(e[i].source.id)<0 && nodes.indexOf(e[i].target.id)<0){
            if(!e[i].attr['grey']){
                e[i].attr['true_color'] = e[i].color;
                e[i].color = greyColor;
                e[i].attr['grey'] = 1;
            }
        }else{
            e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
            e[i].attr['grey'] = 0;

            neighbors[e[i].source.id] = 1;
            neighbors[e[i].target.id] = 1;
        }
    }
            
    partialGraph.iterNodes(function(n){
        if(!neighbors[n.id]){
            if(!n.attr['grey']){
                n.attr['true_color'] = n.color;
                n.color = greyColor;
                n.attr['grey'] = 1;
            }
        }else{
            n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
            n.attr['grey'] = 0;
        }
    }).draw(2,1,2);
            
    if(is_empty(selections)==true){  
        $("#names").html(""); //Information extracted, just added
        $("#opossiteNodes").html(""); //Information extracted, just added
        $("#information").html("");
        changeButton("unselectNodes");
    }
    else changeButton("selectNode");
}

function pushSWClick(arg){
    swclickPrev = swclickActual;
    swclickActual = arg;
//pr("1. swclickPrev: "+swclickPrev+" - swclickActual: "+swclickActual);
}

function changeButton(buttonClicked) {  
    pr("\tin changeNewButtons");
    fullurl = returnBaseUrl()+"img/trans/";
    hasbeenclicked=false;
    if(buttonClicked=="graph_meso.png"){
        document.getElementById("switch").src=fullurl+"graph_meso.png";
        document.getElementById("viewType").src=fullurl+"status_macro_view.png";
        hasbeenclicked=true;
    }
    if(buttonClicked=="graph_macro.png" && hasbeenclicked==false){
        document.getElementById("switch").src=fullurl+"graph_macro.png";
        document.getElementById("viewType").src=fullurl+"status_meso_view.png";
    }
    
    if(buttonClicked=="active_scholars.png"){
        document.getElementById("socio").src=fullurl+"active_scholars.png";
        document.getElementById("semantic").src=fullurl+"inactive_tags.png";
        document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
        pushSWClick("social"); 
        pr("swclickPrev: "+swclickPrev+" - swclickActual: "+swclickActual);
        $("#category-A").show();
        $("#category-B").hide();
    }  
    if(buttonClicked=="active_tags.png"){
        document.getElementById("socio").src=fullurl+"inactive_scholars.png";
        document.getElementById("semantic").src=fullurl+"active_tags.png";
        document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
        pushSWClick("semantic"); 
        pr("swclickPrev: "+swclickPrev+" - swclickActual: "+swclickActual);     
        $("#category-A").hide();
        $("#category-B").show();
    }
    if(buttonClicked=="active_sociosem.png"){
        document.getElementById("socio").src=fullurl+"inactive_scholars.png";
        document.getElementById("semantic").src=fullurl+"inactive_tags.png";
        document.getElementById("sociosemantic").src=fullurl+"active_sociosem.png";
        pushSWClick("sociosemantic");
        pr("swclickPrev: "+swclickPrev+" - swclickActual: "+swclickActual);
        $("#category-A").show();
        $("#category-B").show();
    }
    if(buttonClicked=="selectNode"){
        if(document.getElementById("switch").src==fullurl+"graph_meso_null.png"){
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                document.getElementById("switch").src=fullurl+"graph_meso.png";
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                document.getElementById("switch").src=fullurl+"graph_macro.png";
            }
        }
    }
    if(buttonClicked=="unselectNodes"){
        document.getElementById("switch").src=fullurl+"graph_meso_null.png";
    }
}

function selection(currentNode){
    pr("\tin selection");
    if(checkBox==false && cursor_size==0) {
        highlightSelectedNodes(false);
        opossites = [];
        selections = [];
        partialGraph.refresh();
    }    
    if(socsemFlag==false){
        if((typeof selections[currentNode.id])=="undefined"){
            selections[currentNode.id] = 1;
            if(currentNode.id.charAt(0)=="D" && (typeof bipartiteD2N[currentNode.id])!="undefined"){
                for(i=0;i<bipartiteD2N[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteD2N[currentNode.id].neighbours[i]])=="undefined"){
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]=1;
                    }
                    else {
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]++;
                    }
                }
            }  
            if(currentNode.id.charAt(0)=="N"){
                for(i=0;i<bipartiteN2D[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteN2D[currentNode.id].neighbours[i]])=="undefined"){
                        opossites[bipartiteN2D[currentNode.id].neighbours[i]]=1;
                    }
                    else opossites[bipartiteN2D[currentNode.id].neighbours[i]]++;
                
                }
            }
            currentNode.active=true; 
        }
        else {
            delete selections[currentNode.id];        
        
            if(currentNode.id.charAt(0)=="D"){
                for(i=0;i<bipartiteD2N[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteD2N[currentNode.id].neighbours[i]])=="undefined") {
                        console.log("lala");
                    }
                    if(opossites[bipartiteD2N[currentNode.id].neighbours[i]]==1){
                        delete opossites[bipartiteD2N[currentNode.id].neighbours[i]];
                    }
                    if(opossites[bipartiteD2N[currentNode.id].neighbours[i]]>1){
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]--;
                    }
                }
            }    
            if(currentNode.id.charAt(0)=="N"){
                for(i=0;i<bipartiteN2D[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteN2D[currentNode.id].neighbours[i]])=="undefined") {
                        console.log("lala");
                    }
                    if(opossites[bipartiteN2D[currentNode.id].neighbours[i]]==1){
                        delete opossites[bipartiteN2D[currentNode.id].neighbours[i]];
                    }
                    if(opossites[bipartiteN2D[currentNode.id].neighbours[i]]>1){
                        opossites[bipartiteN2D[currentNode.id].neighbours[i]]--;
                    }
                }
            }
        
            currentNode.active=false;
        }
    }
    
    /* ============================================================================================== */
    
    else {
        if((typeof selections[currentNode.id])=="undefined"){
            selections[currentNode.id] = 1;
        
            if(currentNode.id.charAt(0)=="D"){
                for(i=0;i<bipartiteD2N[currentNode.id].neighbours.length;i++) {
                    //opossitesbipartiteD2N[currentNode.id].neighbours[i]];
                    if((typeof opossites[bipartiteD2N[currentNode.id].neighbours[i].toString()])=="undefined"){
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]=1;
                    }
                    else {
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]++;
                    }
                }
            }    
            if(currentNode.id.charAt(0)=="N"){
                for(i=0;i<nodes2[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[nodes2[currentNode.id].neighbours[i]])=="undefined"){
                        opossites[nodes2[currentNode.id].neighbours[i]]=1;
                    }
                    else opossites[nodes2[currentNode.id].neighbours[i]]++;
                
                }
            }
        
            currentNode.active=true;
        }
        else {
            delete selections[currentNode.id];        
        
            if(currentNode.id.charAt(0)=="D"){
                for(i=0;i<bipartiteD2N[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteD2N[currentNode.id].neighbours[i]])=="undefined") {
                        console.log("lala");
                    }
                    if(opossites[bipartiteD2N[currentNode.id].neighbours[i]]==1){
                        delete opossites[bipartiteD2N[currentNode.id].neighbours[i]];
                    }
                    if(opossites[bipartiteD2N[currentNode.id].neighbours[i]]>1){
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]--;
                    }
                }
            }    
            if(currentNode.id.charAt(0)=="N"){
                for(i=0;i<nodes2[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[nodes2[currentNode.id].neighbours[i]])=="undefined") {
                        console.log("lala");
                    }
                    if(opossites[nodes2[currentNode.id].neighbours[i]]==1){
                        delete opossites[nodes2[currentNode.id].neighbours[i]];
                    }
                    if(opossites[nodes2[currentNode.id].neighbours[i]]>1){
                        opossites[nodes2[currentNode.id].neighbours[i]]--;
                    }
                }
            }
        
            currentNode.active=false;
        }
    }
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
    partialGraph.refresh();
}

function getOpossitesNodes(node_id, entireNode) {
    pr("\tin getOpossitesNodes");
    var node;    
    if(entireNode==true) node=node_id;
    else node = partialGraph._core.graph.nodesIndex[node_id];
    if(socsemFlag==true) {
        cancelSelection();
        socsemFlag=false;
    }
    
    if (!node) return null;
    selection(node);
    
    if(node.id.charAt(0)=="D"){
        flag=1;
    } else {
        flag=2;
    }
    
    opos = ArraySortByValue(opossites, function(a,b){
        return b-a
    });
//        console.log("WOLOLO WOLOLO WOLOLO WOLOLO");
//        $.ajax({
//            type: 'GET',
//            url: 'http://localhost/getJsonFromUrl/tagcloud.php',
//            data: "url="+JSON.stringify(opos),
//            //contentType: "application/json",
//            //dataType: 'json',
//            success : function(data){ 
//                console.log(data);
//            },
//            error: function(){ 
//                pr("Page Not found.");
//            }
//        });
}
function updateLeftPanel(){
    var names='';
    var opossitesNodes='';
    var information='';
    
    counter=0;
    names += '<h4>';
    for(var i in selections){
        if(counter==4){
            names += '<h4>[...]</h4>';
            break;
        }
        names += Nodes[i].label+', ';
        counter++;
    }
    names += '</h4>';
    
    
    minFont=12;
    //maxFont=(minFont+oposMAX)-1;  
    maxFont=20;
    js2='\');"';
    if(flag==1) {
        opossitesNodes += '<br><h4>Keywords: </h4><div style="margin: 5px 5px;">';
        js1='onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'';
        for(var i in opos){
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            //fontSize=(opos[i].value/maxFont)*(maxFont-minFont)+minFont;
            fontSize=minFont+(opos[i].value-1)*((maxFont-minFont)/(oposMAX-1));
            opossitesNodes += '<span style="font-size:'+fontSize+'px; cursor: pointer;" '
            +js1+opos[i].key+js2+'>' + nodes2[opos[i].key].label+  '</span>,&nbsp;&nbsp;';

        }        
        opossitesNodes += '</div>';
        information += '<br><h4>Information:</h4>';
        information += '<ul>';
            
        for(var i in selections){        
            information += '<li><b>' + Nodes[i].label + '</b></li>';
            information += '<li>' + Nodes[i].attributes[3].val + '</li>';
            information += '</ul><br>';
        }
    }
    
    if(flag==2 && socsemFlag==false) {
        opossitesNodes += '<h4>Scholars: </h4><div style="margin: 5px 5px;">';
        pr("max from opos: ");
        pr(oposMAX);    
        js1='onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'';        
        for(var i in opos){
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            //fontSize=(opos[i].value/maxFont)*(maxFont-minFont)+minFont;
            fontSize=minFont+(opos[i].value-1)*((maxFont-minFont)/(oposMAX-1));
            opossitesNodes += '<span style="font-size:'+fontSize+'px; cursor: pointer;" '
            +js1+opos[i].key+js2+'>' + nodes1[opos[i].key].label+  '</span>,&nbsp;&nbsp;';

        }   
    }
    if(flag==2 && socsemFlag==true) {
        opossitesNodes += '<h4>Neighbours</h4><div style="margin: 5px 5px;">';
        opossitesNodes += 'en construcçao...aaaaaaaa ';
    }
    
    $("#names").html(names); //Information extracted, just added
    $("#opossiteNodes").html(opossitesNodes); //Information extracted, just added
    $("#information").html(information); //Information extracted, just added
        
    /***** The animation *****/
    _cG = $("#leftcolumn");
    _cG.animate({
        "left" : "0px"
    }, function() {
        $("#aUnfold").attr("class","leftarrow");
        $("#zonecentre").css({
            left: _cG.width() + "px"
        });
    });       
}

function pushLabel(node_id,node_label) {
    labels.push({
        'label' : node_label, 
        'desc': Nodes[node_id].attributes[0].val
    });
}

function graphNGrams(node_id){   
    pr("\tin graphNGrams");/**/
    fullurl = returnBaseUrl()+"img/trans/";
    document.getElementById("viewType").src=fullurl+"status_meso_view.png";
    document.getElementById("socio").src=fullurl+"inactive_scholars.png";
    document.getElementById("semantic").src=fullurl+"active_tags.png";
    document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
    document.getElementById("switch").src=fullurl+"graph_macro.png";
    
    
    console.log("in graphNGrams, nodae_id: "+node_id);
    if(node_id.charAt(0)=="N") {
        labels = [];
        partialGraph.emptyGraph(); 
        //partialGraph.stopForceAtlas2();
        
        partialGraph.addNode(node_id,Nodes[node_id]);
        pushLabel(node_id,Nodes[node_id].label);

        for(i=0;i<nodes2[node_id].neighbours.length;i++) {
            partialGraph.addNode(nodes2[node_id].neighbours[i],Nodes[nodes2[node_id].neighbours[i]]);
            pushLabel(nodes2[node_id].neighbours[i],Nodes[nodes2[node_id].neighbours[i]].label);
        }  
        
        /* ALGORITMO ESTRELLA*/
        var existingNodes = partialGraph._core.graph.nodes;
        var edgesFound = [];
        for(i=0; i < existingNodes.length ; i++){
            if(existingNodes[i].id==node_id) i++;
            for(j=0; j < existingNodes.length ; j++){
                
                i1="N"+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+"N"+existingNodes[j].id.substring(3,existingNodes[j].id.length);                    
                i2="N"+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+"N"+existingNodes[i].id.substring(3,existingNodes[i].id.length);                    
                      
                if((typeof Edges[i1])!="undefined" && (typeof Edges[i2])!="undefined"){
                    
                    if(Edges[i1].weight > Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(i2,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }                
            }            
        } 
        var node = partialGraph._core.graph.nodesIndex[node_id];
        selection(node);
        partialGraph.startForceAtlas2();        
        updateEdgeFilter("semantic");
        updateNodeFilter();
        $("#category-A").hide();
        $("#category-B").show();
        changeButton("active_tags.png");
    }
}
        
function graphDocs(node_id){
    pr("\tin graphDocs, node_id: "+node_id);    
    
    fullurl = returnBaseUrl()+"img/trans/";
    document.getElementById("viewType").src=fullurl+"status_meso_view.png";
    document.getElementById("socio").src=fullurl+"active_scholars.png";
    document.getElementById("semantic").src=fullurl+"inactive_tags.png";
    document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
    document.getElementById("switch").src=fullurl+"graph_macro.png";
    
    partialGraph.emptyGraph(); 
    //partialGraph.stopForceAtlas2();
    
    if(node_id.charAt(0)=="D") {
        labels = [];
        partialGraph.emptyGraph(); 
        
        partialGraph.addNode(node_id,Nodes[node_id]);
        pushLabel(node_id,Nodes[node_id].label);
        for(i=0;i<nodes1[node_id].neighbours.length;i++) {
            partialGraph.addNode(nodes1[node_id].neighbours[i],Nodes[nodes1[node_id].neighbours[i]]);
            pushLabel(nodes1[node_id].neighbours[i],Nodes[nodes1[node_id].neighbours[i]].label);
        }  
        
        var existingNodes = partialGraph._core.graph.nodes;
        for(i=0; i < existingNodes.length ; i++){
            if(existingNodes[i].id==node_id) i++;
            for(j=0; j < existingNodes.length ; j++){
                
                i1="D"+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+"D"+existingNodes[j].id.substring(3,existingNodes[j].id.length);                    
                i2="D"+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+"D"+existingNodes[i].id.substring(3,existingNodes[i].id.length);                    
                      
                if((typeof Edges[i1])!="undefined" && (typeof Edges[i2])!="undefined"){
                    
                    if(Edges[i1].weight > Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(i2,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }
            }
        }
        var node = partialGraph._core.graph.nodesIndex[node_id];
        selection(node);
        partialGraph.startForceAtlas2();        
        $("#category-A").show();
        $("#category-B").hide();
        updateEdgeFilter("social");        
        changeButton("active_scholars.png");
    }
}
       
function is_empty(obj) {
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length && obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))    return false;
    }
    return true;
}

function alertCheckBox(eventCheck){
    //pr("\tin alertCheckbox");
    //De-activate previous Binds
    //partialGraph.unbind("overnodes");
    //partialGraph.unbind("outnodes");
    
    if((typeof eventCheck.checked)!="undefined") checkBox=eventCheck.checked;
    
    if(eventCheck.checked==true) {//Fade nodes on Hover  
    // Bind events :
    //        console.log("checkbox true");
    //        var greyColor = '#9b9e9e';
    //        partialGraph.bind('overnodes',function(event){
    //            
    //            overNodes = true;
    //            
    //            var nodes = event.content;
    //            var neighbors = {};
    //            var e = partialGraph._core.graph.edges; 
    //            for(i=0;i<e.length;i++){
    //                if(nodes.indexOf(e[i].source.id)<0 && nodes.indexOf(e[i].target.id)<0){
    //                    if(!e[i].attr['grey']){
    //                        e[i].attr['true_color'] = e[i].color;
    //                        var greyColor
    //                        e[i].color = greyColor;
    //                        e[i].attr['grey'] = 1;
    //                    }
    //                }else{
    //                    e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
    //                    e[i].attr['grey'] = 0;
    //
    //                    neighbors[e[i].source.id] = 1;
    //                    neighbors[e[i].target.id] = 1;
    //                }
    //            }
    //            partialGraph.draw(2,1,2);
    //            
    //            partialGraph.iterNodes(function(n){
    //                if(!neighbors[n.id]){
    //                    if(!n.attr['grey']){
    //                        n.attr['true_color'] = n.color;
    //                        n.color = greyColor;
    //                        n.attr['grey'] = 1;
    //                    }
    //                }else{
    //                    n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
    //                    n.attr['grey'] = 0;
    //                }
    //            }).draw(2,1,2);
    //        });
    //        
    //        partialGraph.bind('outnodes',function(){
    //            overNodes=false;            
    //            var e = partialGraph._core.graph.edges;
    //            for(i=0;i<e.length;i++){
    //                e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
    //                e[i].attr['grey'] = 0;
    //            }
    //            partialGraph.draw(2,1,2);
    //            
    //            partialGraph.iterNodes(function(n){
    //                n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
    //                n.attr['grey'] = 0;
    //            }).draw(2,1,2);
    //        });
    }
    else {//Hide nodes on Hover     
        console.log("checkbox false");   
    //        partialGraph.bind('overnodes',function(event){            
    //            var nodes = event.content;
    //            var neighbors = {};
    //            var e = partialGraph._core.graph.edges;
    //            for(i=0;i<e.length;i++){
    //                if(nodes.indexOf(e[i].source.id)>=0 || nodes.indexOf(e[i].target.id)>=0){
    //                    neighbors[e[i].source.id] = 1;
    //                    neighbors[e[i].target.id] = 1;
    //                }
    //            }
    //            partialGraph.draw(2,1,2);
    //            
    //            partialGraph.iterNodes(function(n){
    //                if(!neighbors[n.id]){
    //                    n.hidden = 1;
    //                }else{
    //                    n.hidden = 0;
    //                }
    //            }).draw(2,1,2);
    //        });
    //  
    //        partialGraph.bind('outnodes',function(){
    //            var e = partialGraph._core.graph.edges;
    //            for(i=0;i<e.length;i++){
    //                e[i].hidden = 0;
    //            }
    //            partialGraph.draw(2,1,2);
    //            
    //            partialGraph.iterNodes(function(n){
    //                n.hidden = 0;
    //            }).draw(2,1,2);
    //        });
    } 
    
}

function updateDownNodeEvent(selectionRadius){
    partialGraph.unbind("downnodes");
    partialGraph.unbind("overnodes");
    partialGraph.unbind("outnodes");
    hoverNodeEffectWhileFA2(selectionRadius);
}

function hoverNodeEffectWhileFA2(selectionRadius) {
    if(selectionRadius==false){
        //If cursor_size=0 -> Normal and single mouse-selection
        alertCheckBox(checkBox);
        partialGraph.bind('downnodes', function (event) {
            getOpossitesNodes(event.content, false);
            updateLeftPanel();
            /****            
                 *This give me the hoverNodes effect when the FA2 is running.
                ****/
            var greyColor = '#9b9e9e';/**/
            overNodes=true;
            var nodes = event.content;
            var neighbors = {};
            var e = partialGraph._core.graph.edges; 
            for(i=0;i<e.length;i++){
                if(nodes.indexOf(e[i].source.id)<0 && nodes.indexOf(e[i].target.id)<0){
                    if(!e[i].attr['grey']){
                        e[i].attr['true_color'] = e[i].color;
                        e[i].color = greyColor;
                        e[i].attr['grey'] = 1;
                    }
                }else{
                    e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
                    e[i].attr['grey'] = 0;

                    neighbors[e[i].source.id] = 1;
                    neighbors[e[i].target.id] = 1;
                }
            }
            
            partialGraph.iterNodes(function(n){
                if(!neighbors[n.id]){
                    if(!n.attr['grey']){
                        n.attr['true_color'] = n.color;
                        n.color = greyColor;
                        n.attr['grey'] = 1;
                    }
                }else{
                    n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                    n.attr['grey'] = 0;
                }
            }).draw(2,1,2);
            
            if(is_empty(selections)==true){  
                $("#names").html(""); //Information extracted, just added
                $("#opossiteNodes").html(""); //Information extracted, just added
                $("#information").html("");
                changeButton("unselectNodes");
            }
            else changeButton("selectNode");
            //overNodes=false;
            });
        }
        else {
        pr("selectionRadius?: "+selectionRadius);
        //If cursor_size>0 -> Multiple mouse-selection
        //Event: I've clicked the canvas (NOT A NODE) when I've a selection radius ON'
        partialGraph.bind('downnodes', function (event) {
            if(checkBox==false) cancelSelection();
            x1 = partialGraph._core.mousecaptor.mouseX;
            y1 = partialGraph._core.mousecaptor.mouseY;
            //dist1(centerClick,selectionRadius)
            partialGraph.iterNodes(function(n){
                distance = Math.sqrt(
                    Math.pow((x1-parseInt(n.displayX)),2) +
                    Math.pow((y1-parseInt(n.displayY)),2)
                    );
                if(parseInt(distance)<=cursor_size) {
                    getOpossitesNodes(n,true);
                }
            });
            updateLeftPanel();
            partialGraph.refresh();
            if(is_empty(selections)==true){  
                $("#names").html(""); //Information extracted, just added
                $("#opossiteNodes").html(""); //Information extracted, just added
                $("#information").html("");
                changeButton("unselectNodes");
            }
            else changeButton("selectNode");
        //overNodes=false;
        });
        
    }
}

function createEdgesForExistingNodes (typeOfNodes) {
    if(typeOfNodes=="Bipartite"){
        var existingNodes = partialGraph._core.graph.nodes;
        var edgesFound = [];
        for(i=0; i < existingNodes.length ; i++){
            for(j=0; j < existingNodes.length ; j++){
                
                i1=existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length);                    
                i2=existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length);                    
                    
                indexS1 = existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length);
                indexT1 = existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length); 
                    
                indexS2 = existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length);  
                indexT2 = existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length);     

                if((typeof Edges[i1])!="undefined" && (typeof Edges[i2])!="undefined"){
                    if(Edges[i1].weight > Edges[i2].weight ){
                        partialGraph.addEdge(indexS1+";"+indexT1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(indexS2+";"+indexT2,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        if(Edges[i1].attributes[1].val!="bipartite") {     
                            if( (typeof partialGraph._core.graph.edgesIndex[indexS1+";"+indexT1])=="undefined" &&
                                (typeof partialGraph._core.graph.edgesIndex[indexT1+";"+indexS1])=="undefined" ){
                                partialGraph.addEdge(indexS1+";"+indexT1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                            }
                        }
                    }
                        
                        
                }
                else {
                    if((typeof Edges[i1])!="undefined" && Edges[i1].attributes[1].val=="bipartite"){
                        //I've found a source Node
                        partialGraph.addEdge(indexS1+";"+indexT1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                        
                    }
                    if((typeof Edges[i2])!="undefined" && Edges[i2].attributes[1].val=="bipartite"){
                        //I've found a target Node
                        partialGraph.addEdge(indexS2+";"+indexT2,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                }
            }            
        }
    }
    else {     
        
        var Type;
        if(typeOfNodes=="Scholars") { 
            Type="D";
        }
        else Type="N"; //Keywords
        existingNodes = partialGraph._core.graph.nodes;
        for(i=0; i < existingNodes.length ; i++){
            for(j=(i+1); j < existingNodes.length ; j++){
                    
                i1=Type+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+
                Type+existingNodes[j].id.substring(3,existingNodes[j].id.length); 
                
                i2=Type+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+
                Type+existingNodes[i].id.substring(3,existingNodes[i].id.length);
                            
                if((typeof Edges[i1])!="undefined" && (typeof Edges[i2])!="undefined" && i1!=i2){
                        
                    if(Edges[i1].weight > Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(i2,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(i1,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }  
            }  
        }  
    }
}

function changeInactvHover(imgClicked) { 
    fullurl = returnBaseUrl()+"img/trans/";
    if(imgClicked.id=="socio") {
        if ( imgClicked.src==fullurl+"inactive_scholar.png" ) {
            imgClicked.src=fullurl+"hover_scholar.png"
        }
        if ( imgClicked.src==fullurl+"inactive_scholars.png" ) {
            imgClicked.src=fullurl+"hover_scholars.png"
        }
    }
    if(imgClicked.id=="semantic") {
        if ( imgClicked.src==fullurl+"inactive_tag.png" ) {
            imgClicked.src=fullurl+"hover_tag.png"
        }
        if ( imgClicked.src==fullurl+"inactive_tags.png" ) {
            imgClicked.src=fullurl+"hover_tags.png"
        }        
    }
    if(imgClicked.id=="sociosemantic") {
        if ( imgClicked.src==fullurl+"inactive_sociosem.png" ) {
            imgClicked.src=fullurl+"hover_sociosem.png"
        }     
    }
}

function changeHoverInactv(imgClicked) {  
    fullurl = returnBaseUrl()+"img/trans/";
    if(imgClicked.id=="socio") {
        if ( imgClicked.src==fullurl+"hover_scholar.png" ) {
            imgClicked.src=fullurl+"inactive_scholar.png"
        }
        if ( imgClicked.src==fullurl+"hover_scholars.png" ) {
            imgClicked.src=fullurl+"inactive_scholars.png"
        }        
    }
    if(imgClicked.id=="semantic") {
        if ( imgClicked.src==fullurl+"hover_tag.png" ) {
            imgClicked.src=fullurl+"inactive_tag.png"
        }
        if ( imgClicked.src==fullurl+"hover_tags.png" ) {
            imgClicked.src=fullurl+"inactive_tags.png"
        }
    }
    
    if(imgClicked.id=="sociosemantic") {
        if ( imgClicked.src==fullurl+"hover_sociosem.png" ) {
            imgClicked.src=fullurl+"inactive_sociosem.png"
        }    
    }
}

function changeHoverActive(img) {
    fullurl = returnBaseUrl()+"img/trans/";
    if(img.id=="socio") {
        if ( img.src==fullurl+"hover_scholars.png" ) {
            changeButton("active_scholars.png");
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                changeToMacro("social");
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                changeToMeso("social");
            }
        }
    }
    
    if(img.id=="semantic") { 
        if ( img.src==fullurl+"hover_tags.png" ) { 
            changeButton("active_tags.png");
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                changeToMacro("semantic");
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                changeToMeso("semantic");
            }
        }
    }
    
    if(img.id=="sociosemantic") { 
        if ( img.src==fullurl+"hover_sociosem.png" ) { 
            changeButton("active_sociosem.png");
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                changeToMacro("sociosemantic");
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                changeToMeso("sociosemantic");
            }
        }
        
    }
    if(img.id=="switch") { 
        hasbeenclicked=false;
        if ( img.src==fullurl+"graph_meso.png"){
            changeButton("graph_macro.png");   
            pushSWClick(swclickActual);
            changeToMeso(swclickActual);
            hasbeenclicked=true;       
        }
        if ( img.src==fullurl+"graph_macro.png" && hasbeenclicked==false){
            changeButton("graph_meso.png");    
            pushSWClick(swclickActual);
            changeToMacro(swclickActual);
        }
    }
}

function changeToMeso(iwannagraph) { 
    pr("changing to Meso-"+iwannagraph);  
    fullurl = returnBaseUrl()+"img/trans/";   
    if(iwannagraph=="social") {
        if(!is_empty(selections)){
            partialGraph.emptyGraph();
            if(swclickPrev=="social") {
                for(var i in selections) {
                    partialGraph.addNode(i,Nodes[i]);
                    for(var j in nodes1[i].neighbours) { 
                        id=nodes1[i].neighbours[j];
                        partialGraph.addNode(id,Nodes[id]);
                    }
                }            
                createEdgesForExistingNodes("Scholars");/**/
            }
            if(swclickPrev=="semantic") {
                for(var i in selections) {
                    if(i.charAt(0)=="D"){
                        graphDocs(i);
                    }
                    if(i.charAt(0)=="N"){
                        for(var j in opossites) {
                            partialGraph.addNode(j,Nodes[j]);                            
                        }
                        createEdgesForExistingNodes("Scholars");
                        break;
                    }
                }                
            }
            if(swclickPrev=="sociosemantic") {      
                for(var i in selections) {
                    if(i.charAt(0)=="D"){
                        partialGraph.addNode(i,Nodes[i]);
                        for(var j in nodes1[i].neighbours) { 
                            id=nodes1[i].neighbours[j];
                            partialGraph.addNode(id,Nodes[id]);
                        }
                        createEdgesForExistingNodes("Scholars");
                    }
                    if(i.charAt(0)=="N"){
                        for(var j in opossites) {
                            partialGraph.addNode(j,Nodes[j]);                            
                        }
                        createEdgesForExistingNodes("Scholars");
                        break;
                    }
                }                
            }
            updateEdgeFilter(iwannagraph);
        }
    }
    if(iwannagraph=="sociosemantic") {
        if(!is_empty(selections) && !is_empty(opossites)){
            partialGraph.emptyGraph();
            for(var i in selections) {
                partialGraph.addNode(i,Nodes[i]);
            }
                
            for(var i in opossites) {
                partialGraph.addNode(i,Nodes[i]);
            }
                
            createEdgesForExistingNodes("Bipartite");
            
            partialGraph.startForceAtlas2();
            socsemFlag=true;
            updateBothEdgeFilters();
            updateNodeFilter();
        }
    }
     
    if(iwannagraph=="semantic") {
        if(!is_empty(opossites)){
            partialGraph.emptyGraph();
            //pr("2. swclickPrev: "+swclickPrev+" - swclickActual: "+swclickActual);
            if(swclickPrev=="semantic") {
                for(var i in selections) {
                    graphNGrams(i);
                }
                createEdgesForExistingNodes("Keywords");
            }
            if(swclickPrev=="social") {
                for(var i in selections) {
                    if(i.charAt(0)=="N"){
                        graphNGrams(i);
                    }
                    if(i.charAt(0)=="D"){
                        for(var j in opossites) {
                            partialGraph.addNode(j,Nodes[j]);                            
                        }
                        createEdgesForExistingNodes("Keywords");
                        break;
                    }
                } 
            }
            if(swclickPrev=="sociosemantic") {                     
                for(var i in selections) {
                    if(i.charAt(0)=="D"){                        
                        for(var j in opossites) {
                            partialGraph.addNode(j,Nodes[j]);                            
                        }
                        createEdgesForExistingNodes("Keywords");
                        break;
                    }
                    if(i.charAt(0)=="N"){                        
                        partialGraph.addNode(i,Nodes[i]);
                        for(var j in nodes2[i].neighbours) { 
                            id=nodes2[i].neighbours[j];
                            partialGraph.addNode(id,Nodes[id]);
                        }
                        createEdgesForExistingNodes("Keywords");
                    }
                }                
            }
            updateEdgeFilter(iwannagraph);  
            updateNodeFilter();
        }
    }
    highlightSelectedNodes(true); 
    partialGraph.draw();
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
    partialGraph.refresh();
    partialGraph.startForceAtlas2();
}

function highlightOpossites (list){/*tofix*/
    for(var n in list){
        partialGraph._core.graph.nodesIndex[n].forceLabel=true;
    }
}

function changeToMacro(iwannagraph) { 
    pr("changing to Macro-"+iwannagraph);
    fullurl = returnBaseUrl()+"img/trans/";
    if(iwannagraph=="semantic") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {                
            if(Nodes[n].attributes[0].val=="NGram"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }  
        createEdgesForExistingNodes("Keywords");
        for(var n in selections){
            if(n.charAt(0)=='D')
                highlightOpossites(opossites);
            break;
        }
        updateEdgeFilter(iwannagraph);
        updateNodeFilter();
    }
    if(iwannagraph=="social") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {                
            if(Nodes[n].attributes[0].val=="Document"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }
        createEdgesForExistingNodes("Scholars");
        for(var n in selections){
            if(n.charAt(0)=='N')
                highlightOpossites(opossites);
            break;
        }
        updateEdgeFilter(iwannagraph);
    }
    
    if(iwannagraph=="sociosemantic") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {  
            partialGraph.addNode(n,Nodes[n]);          
        }        
        for(var e in Edges) {  
            if(Edges[e].label=="nodes1" || Edges[e].label=="nodes2"){
                st=e.split(";");
                index = partialGraph._core.graph.edgesIndex;
                if(typeof(index[st[0]+";"+st[1]])=="undefined" &&
                    typeof(index[st[1]+";"+st[0]])=="undefined"
                    ){
                    if(Edges[st[0]+";"+st[1]].weight == Edges[st[1]+";"+st[0]].weight){
                        partialGraph.addEdge(
                            st[0]+";"+st[1],
                            Edges[st[0]+";"+st[1]].sourceID,
                            Edges[st[0]+";"+st[1]].targetID,
                            Edges[st[0]+";"+st[1]]);
                    }
                    else {
                        if(Edges[st[0]+";"+st[1]].weight > Edges[st[1]+";"+st[0]].weight){
                            partialGraph.addEdge(
                                st[0]+";"+st[1],
                                Edges[st[0]+";"+st[1]].sourceID,
                                Edges[st[0]+";"+st[1]].targetID,
                                Edges[st[0]+";"+st[1]]);
                        }
                        else {
                            partialGraph.addEdge(
                                st[1]+";"+st[0],
                                Edges[st[1]+";"+st[0]].sourceID,
                                Edges[st[1]+";"+st[0]].targetID,
                                Edges[st[1]+";"+st[0]]);                                  
                        }
                    }
                }                
            }
            if(Edges[e].label=="bipartite"){
                partialGraph.addEdge(e,Edges[e].sourceID,Edges[e].targetID,Edges[e]);
            }
        }
        updateBothEdgeFilters();
        updateNodeFilter();
    }
    highlightSelectedNodes(true);
    //partialGraph.stopForceAtlas2();
    partialGraph.draw();
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
    partialGraph.refresh();
    partialGraph.startForceAtlas2();
}

function neweffectshow(){
    if(!is_empty(selections)){    
        $("#labelchange").show();
        $("#availableView").show();  
    }
}

function neweffecthide(){
    $.doTimeout(300,function (){
        if($("#labelchange")[0].hidden==false){
            
        }
        else {
            $("#labelchange").hide();
            $("#availableView").hide(); 
        }
    });
}

function justhide(){    
    $("#labelchange").hide();
    $("#availableView").hide();  
}

function updateEdgeFilter(edgeFilterName) {
    thing="";
    if(edgeFilterName=="social") {
        edgeFilterName="#sliderAEdgeWeight";
        thing="nodes1";
    }
    if(edgeFilterName=="semantic") {
        edgeFilterName="#sliderBEdgeWeight";
        thing="nodes2";
    }
    edges=partialGraph._core.graph.edges;
    edgesByWeight=[];
    for(var i in edges){
        if(edges[i].label==thing){
            if(typeof(edgesByWeight[edges[i].weight])=="undefined"){
                edgesByWeight[edges[i].weight]=[];
            }
            edgesByWeight[edges[i].weight].push(edges[i].id);
        }
    }
    edgesSortedByWeight = ArraySortByKey(edgesByWeight, function(a,b){
        return a-b
    });
    
    $(edgeFilterName).slider({
        range: true,
        min: 0,
        max: edgesSortedByWeight.length-1,
        values: [0, edgesSortedByWeight.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                edgesTemp = partialGraph._core.graph.edgesIndex;
                for(i=0;i<edgesSortedByWeight.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in edgesSortedByWeight[i].value){
                            id=edgesSortedByWeight[i].value[j];
                            if(typeof(edgesTemp[id])=="undefined"){
                                source=Edges[id].sourceID;
                                target=Edges[id].targetID;
                                edge=Edges[id];
                                partialGraph.addEdge(id,source,target,edge);
                            }
                        }
                    }
                    else {
                        partialGraph.dropEdge(edgesSortedByWeight[i].value);
                    }
                }
                partialGraph.draw();
            });
        }
    });
}

function updateBothEdgeFilters() {
    edges=partialGraph._core.graph.edges;
    scholarsEdgesByWeight=[];
    keywordsEdgesByWeight=[];
    for(var i in edges){
        if(edges[i].label=="nodes1"){
            if(typeof(scholarsEdgesByWeight[edges[i].weight])=="undefined"){
                scholarsEdgesByWeight[edges[i].weight]=[];
            }
            scholarsEdgesByWeight[edges[i].weight].push(edges[i].id);
        }
        if(edges[i].label=="nodes2"){
            if(typeof(keywordsEdgesByWeight[edges[i].weight])=="undefined"){
                keywordsEdgesByWeight[edges[i].weight]=[];
            }
            keywordsEdgesByWeight[edges[i].weight].push(edges[i].id);            
        }
    }
    scholarsEdgesSortedByWeight = ArraySortByKey(scholarsEdgesByWeight, function(a,b){
        return a-b
    });
    
    keywordsEdgesSortedByWeight = ArraySortByKey(keywordsEdgesByWeight, function(a,b){
        return a-b
    });
    
    $("#sliderAEdgeWeight").slider({
        range: true,
        min: 0,
        max: scholarsEdgesSortedByWeight.length-1,
        values: [0, scholarsEdgesSortedByWeight.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                edgesTemp = partialGraph._core.graph.edgesIndex;
                for(i=0;i<scholarsEdgesSortedByWeight.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in scholarsEdgesSortedByWeight[i].value){
                            id=scholarsEdgesSortedByWeight[i].value[j];
                            if(typeof(edgesTemp[id])=="undefined"){
                                source=Edges[id].sourceID;
                                target=Edges[id].targetID;
                                edge=Edges[id];
                                partialGraph.addEdge(id,source,target,edge);
                            }
                        }
                    }
                    else {
                        partialGraph.dropEdge(scholarsEdgesSortedByWeight[i].value);
                    }
                }
                partialGraph.draw();
            });
        }
    });
    
    $("#sliderBEdgeWeight").slider({
        range: true,
        min: 0,
        max: keywordsEdgesSortedByWeight.length-1,
        values: [0, keywordsEdgesSortedByWeight.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                edgesTemp = partialGraph._core.graph.edgesIndex;
                for(i=0;i<keywordsEdgesSortedByWeight.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in keywordsEdgesSortedByWeight[i].value){
                            id=keywordsEdgesSortedByWeight[i].value[j];
                            if(typeof(edgesTemp[id])=="undefined"){
                                source=Edges[id].sourceID;
                                target=Edges[id].targetID;
                                edge=Edges[id];
                                partialGraph.addEdge(id,source,target,edge);
                            }
                        }
                    }
                    else {
                        partialGraph.dropEdge(keywordsEdgesSortedByWeight[i].value);
                    }
                }
                partialGraph.draw();
            });
        }
    });
}

function updateNodeFilter() {
    nodes=partialGraph._core.graph.nodes;
    nodesBySize=[];
    for(var i in nodes){
        if(nodes[i].id.charAt(0)=="N"){
            if(typeof(nodesBySize[nodes[i].size])=="undefined"){
                nodesBySize[nodes[i].size]=[];
            }
            nodesBySize[nodes[i].size].push(nodes[i].id);
        }
    }
    nodesSortedBySize = ArraySortByKey(nodesBySize, function(a,b){
        return a-b
    });
    
    $("#sliderBNodeWeight").slider({
        range: true,
        min: 0,
        max: nodesSortedBySize.length-1,
        values: [0, nodesSortedBySize.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                nodesTemp = partialGraph._core.graph.nodesIndex;
                for(i=0;i<nodesSortedBySize.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in nodesSortedBySize[i].value){
                            id=nodesSortedBySize[i].value[j];
                            nodesTemp[id].hidden=false;
                        }
                    }
                    else {
                        for (var j in nodesSortedBySize[i].value){
                            id=nodesSortedBySize[i].value[j];
                            nodesTemp[id].hidden=true;
                        }
                    }
                }
                partialGraph.draw();
            });
        }
    });
}

function trackMouse() {
    var ctx = partialGraph._core.domElements.mouse.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, partialGraph._core.domElements.nodes.width, partialGraph._core.domElements.nodes.height);

    var x;
    var y;

    x = partialGraph._core.mousecaptor.mouseX;
    y = partialGraph._core.mousecaptor.mouseY;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, cursor_size, 0, Math.PI * 2, true);
    ctx.arc(partialGraph._core.width/2, partialGraph._core.height/2, 4, 0, 2 * Math.PI, true);/*todel*/
    ctx.closePath();
    ctx.stroke();
    
};

function changeGraphPosition(evt, echelle) {
    document.body.style.cursor = "move";
    var _coord = {
        x : evt.pageX,
        y : evt.pageY
    };
    console.log("changeGraphPosition... cordx: "+_coord.x+" - cordy: "+_coord.y);
    partialGraph.centreX += ( partialGraph.lastMouse.x - _coord.x ) / echelle;
    partialGraph.centreY += ( partialGraph.lastMouse.y - _coord.y ) / echelle;
    partialGraph.lastMouse = _coord;
}

function onOverviewMove(evt) {
    console.log("onOverViewMove"); 
    /*
     pageX: 1247   pageY: 216
     screenX: 1188  screenY: 307
    
     pageX: 1444    pageY: 216
     screenX: 1365  screenY: 307
     */
    
    if (partialGraph.dragOn) {
        changeGraphPosition(evt,-overviewScale);
    }
}

function startMove(evt){
    console.log("startMove");
    evt.preventDefault();
    partialGraph.dragOn = true;
    partialGraph.lastMouse = {
        x : evt.pageX,
        y : evt.pageY
    }
    partialGraph.mouseHasMoved = false;
}

function endMove(evt){
    console.log("endMove");
    document.body.style.cursor = "default";
    partialGraph.dragOn = false;
    partialGraph.mouseHasMoved = false;
}

function onGraphScroll(evt, delta) {
    partialGraph.totalScroll += delta;
    if (Math.abs(partialGraph.totalScroll) >= 1) {
        if (partialGraph.totalScroll < 0) {
            //ZoomOUT
            if (partialGraph.position().ratio > sigmaJsMouseProperties.minRatio) {
                //partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, partialGraph._core.mousecaptor.ratio * 0.5);
                //var _el = $(this),
                //_off = $(this).offset(),
                //_deltaX = evt.pageX - _el.width() / 2 - _off.left,
                //_deltaY = evt.pageY - _el.height() / 2 - _off.top;
                var 
                mx=evt.offsetX,
                my=evt.offsetY;
                partialGraph.centreX=mx*((partialGraph._core.width-1)/(overviewWidth)),
                partialGraph.centreY=my*((partialGraph._core.height-1)/(overviewHeight));               
                
//                console.log("mx: "+mx+" - my: "+ my);                
//                console.log("cx: "+cx+" - cy: "+ cy);
//                partialGraph.centreX =cx;
//                partialGraph.centreY =cy;
                partialGraph.zoomTo(partialGraph.centreX, partialGraph.centreY, partialGraph._core.mousecaptor.ratio * 0.5);
//                partialGraph.centreX -= ( Math.SQRT2 - 1 ) * _deltaX / partialGraph.echelleGenerale;
//                partialGraph.centreY -= ( Math.SQRT2 - 1 ) * _deltaY / partialGraph.echelleGenerale;
//                partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, partialGraph._core.mousecaptor.ratio * 0.5);
                $("#zoomSlider").slider("value",partialGraph.position().ratio);
            }
        } else {
            //ZoomIN
            if (partialGraph.position().ratio < sigmaJsMouseProperties.maxRatio) {
                //                partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, partialGraph._core.mousecaptor.ratio * 1.5);
//                partialGraph.echelleGenerale = Math.pow( Math.SQRT2, partialGraph.position().ratio );
                //var _el = $(this),
                //_off = $(this).offset(),
                //_deltaX = evt.pageX - _el.width() / 2 - _off.left,
                //_deltaY = evt.pageY - _el.height() / 2 - _off.top;
                var 
                mx=evt.offsetX,
                my=evt.offsetY;
                partialGraph.centreX=mx*((partialGraph._core.width-1)/(overviewWidth)),
                partialGraph.centreY=my*((partialGraph._core.height-1)/(overviewHeight));               
                
//                console.log("mx: "+mx+" - my: "+ my);                
//                console.log("cx: "+cx+" - cy: "+ cy);
//                partialGraph.centreX =cx;
//                partialGraph.centreY =cy;
                partialGraph.zoomTo(partialGraph.centreX, partialGraph.centreY, partialGraph._core.mousecaptor.ratio * 1.5);
                $("#zoomSlider").slider("value",partialGraph.position().ratio);
            }
        }
        partialGraph.totalScroll = 0;
    }
}

function initializeMap() {
    clearInterval(partialGraph.timeRefresh);
    partialGraph.oldParams = {};
    $("#zoomSlider").slider({
        orientation: "vertical",
        value: partialGraph.position().ratio,
        min: sigmaJsMouseProperties.minRatio,
        max: sigmaJsMouseProperties.maxRatio,
        range: "min",
        step: 0.1,
        slide: function( event, ui ) {
            partialGraph.zoomTo(
                partialGraph._core.width / 2, 
                partialGraph._core.height / 2, 
                ui.value);
        }
    });
    $("#overviewzone").css({
        width : overviewWidth + "px",
        height : overviewHeight + "px"
    });
    $("#overview").attr({
        width : overviewWidth,
        height : overviewHeight
    });
    partialGraph.timeRefresh = setInterval(traceMap,60);
}

function updateMap(){
    console.log("updating MiniMap");
    
    partialGraph.imageMini="";
    partialGraph.ctxMini="";
    partialGraph.ctxMini = document.getElementById('overview').getContext('2d');
    partialGraph.ctxMini.clearRect(0, 0, overviewWidth, overviewHeight);
    
    partialGraph.iterNodes(function(n){
        partialGraph.ctxMini.fillStyle = n.color;
        partialGraph.ctxMini.beginPath();
        numPosibilidades = 2.5 - 0.9;
        aleat = Math.random() * numPosibilidades;
        partialGraph.ctxMini.arc(((n.displayX/1.2)-200)*0.25 , ((n.displayY/1.2)+110)*0.25 , (0.9 + aleat)*0.25+1 , 0 , Math.PI*2 , true);
        //        //console.log(n.x*1000 +" * 0.25"+" _ "+ n.y*1000 +" * 0.25"+" _ "+ (0.9 + aleat) +" * 0.25 + 1");
        //        
        partialGraph.ctxMini.closePath();
        partialGraph.ctxMini.fill();
    //        
    });
    partialGraph.imageMini = partialGraph.ctxMini.getImageData(0, 0, overviewWidth, overviewHeight);
}

function traceMap() {
    //pr("\ttracingmap");
    partialGraph.echelleGenerale = Math.pow( Math.SQRT2, partialGraph.position().ratio );
    partialGraph.ctxMini.putImageData(partialGraph.imageMini, 0, 0);
    
    var _r = 0.25 / partialGraph.echelleGenerale,
    cx =  partialGraph.centreX,
    cy =  partialGraph.centreY,
    _w = _r * partialGraph._core.width,
    _h = _r * partialGraph._core.height;
    partialGraph.ctxMini.strokeStyle = "rgb(220,0,0)";
    partialGraph.ctxMini.lineWidth = 3;
    partialGraph.ctxMini.fillStyle = "rgba(120,120,120,0.2)";
    partialGraph.ctxMini.beginPath();
    partialGraph.ctxMini.fillRect( cx-_w/2, cy-_h/2, _w, _h );
    partialGraph.ctxMini.strokeRect( cx-_w/2, cy-_h/2, _w, _h );
    partialGraph.ctxMini.closePath();
}

$(document).ready(function () {
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
    $("#category-B").hide();
    $("#labelchange").hide();
    $("#availableView").hide();
    
    console.log("parsing...");        
    parse(gexfLocation);
    fullExtract(); 
    updateEdgeFilter("social");
    pushSWClick("social");
    console.log("Parsing complete.");
    /*======= Show some labels at the beginning =======*/
    minIn=50,
    maxIn=0,
    minOut=50,
    maxOut=0;        
    partialGraph.iterNodes(function(n){
        if(parseInt(n.inDegree) < minIn) minIn= n.inDegree;
        if(parseInt(n.inDegree) > maxIn) maxIn= n.inDegree;
        if(parseInt(n.outDegree) < minOut) minOut= n.outDegree;
        if(parseInt(n.outDegree) > maxOut) maxOut= n.outDegree;
    });
    partialGraph.iterNodes(function(n){
        if(n.inDegree==minIn) n.forceLabel=true;
        if(n.inDegree==maxIn) n.forceLabel=true;
        if(n.outDegree==minOut) n.forceLabel=true;
        if(n.outDegree==maxOut) n.forceLabel=true;
    });
    /*======= Show some labels at the beginning =======*/
    
    
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8).draw();
    initializeMap();
    updateMap();
        
    //window.onhashchange = updateMap;
    
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
    //partialGraph.draw();    
    
    $("#loading").remove();
    
    $("#aUnfold").click(function() {
        pr("heeere");
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
                for(j=0;j<matches.length;j++){
                    search(matches[j].label);
                }
            }
        }
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
    
    $("sigma-example")
    //    .mousemove(onOverviewMove)
    //    .mousedown(startMove)
    //    .mouseup(endMove)
    //    .mouseout(endMove)
    //    .mousewheel(onGraphScroll); -> it doesn't answer!
    
//    $("#cancelselection").click(function (){
//        pr("heeeeree");
//        cancelSelection();
//    });
    
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
                    if(n.id.charAt(0)=="D") {
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
            $.doTimeout(300,function (){
                partialGraph.iterNodes(function (n) {
                    if(n.id.charAt(0)=="N") {
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
            if(cursor_size==0) updateDownNodeEvent(false);
            else updateDownNodeEvent(true); 
        //return callSlider("#sliderSelectionZone", "selectionRadius");
        }
    });
    
});
