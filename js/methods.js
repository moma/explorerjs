
function pr(msg) {
    console.log(msg);
}

getUrlParam = (function () {
    var get = {
        push:function (key,value){
            var cur = this[key];
            if (cur.isArray){
                this[key].push(value);
            }else {
                this[key] = [];
                this[key].push(cur);
                this[key].push(value);
            }
        }
    },
    search = document.location.search,
    decode = function (s,boo) {
        var a = decodeURIComponent(s.split("+").join(" "));
        return boo? a.replace(/\s+/g,''):a;
    };
    search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function (a,b,c) {
        if (get[decode(b,true)]){
            get.push(decode(b,true),decode(c));
        }else {
            get[decode(b,true)] = decode(c);
        }
    });
    return get;
})();

function showhideChat(){
    
    cg = document.getElementById("rightcolumn");
    if(cg){
        if(cg.style.right=="-400px"){
            cg.style.right="0px";
        }
        else cg.style.right="-400px";
    }
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
            if(Nodes[i].type=="Document" && document.getElementById("socio").src==fullurl+"active_scholars.png"){
                node = partialGraph._core.graph.nodesIndex[i];
                node.active = flag;
            }
            else if(Nodes[i].type=="NGram" && document.getElementById("semantic").src==fullurl+"active_tags.png") {
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
            if(Nodes[currentNode.id].type=="Document" && (typeof bipartiteD2N[currentNode.id])!="undefined"){
                for(i=0;i<bipartiteD2N[currentNode.id].neighbours.length;i++) {
                    if((typeof opossites[bipartiteD2N[currentNode.id].neighbours[i]])=="undefined"){
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]=1;
                    }
                    else {
                        opossites[bipartiteD2N[currentNode.id].neighbours[i]]++;
                    }
                }
            }  
            if(Nodes[currentNode.id].type=="NGram"){
                if((typeof bipartiteN2D[currentNode.id])!="undefined"){
                    for(i=0;i<bipartiteN2D[currentNode.id].neighbours.length;i++) {
                        if((typeof opossites[bipartiteN2D[currentNode.id].neighbours[i]])=="undefined"){
                            opossites[bipartiteN2D[currentNode.id].neighbours[i]]=1;
                        }
                        else opossites[bipartiteN2D[currentNode.id].neighbours[i]]++;
                
                    }
                }
            }
            currentNode.active=true; 
        }
        else {
            delete selections[currentNode.id];        
        
            if(Nodes[currentNode.id].type=="Document"){
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
            if(Nodes[currentNode.id].type=="NGram"){
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
        
            if(Nodes[currentNode.id].type=="Document"){
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
            if(Nodes[currentNode.id].type=="NGram"){
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
        
            if(Nodes[currentNode.id].type=="Document"){
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
            if(Nodes[currentNode.id].type=="NGram"){
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
function selectionUni(currentNode){
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
            currentNode.active=true; 
        }
        else {
            delete selections[currentNode.id];        
            currentNode.active=false;
        }
    }
    
    /* ============================================================================================== */
    
    else {
        if((typeof selections[currentNode.id])=="undefined"){
            selections[currentNode.id] = 1;
            currentNode.active=true;
        }
        else {
            delete selections[currentNode.id];               
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
    if(bipartite){
        selection(node);
        if(Nodes[node.id].type=="Document"){
            flag=1;
        } else {
            flag=2;
        }
    
        opos = ArraySortByValue(opossites, function(a,b){
            return b-a
        });
    }
    else selectionUni(node);
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

function updateLeftPanel2(){//Uni-partite graph
    pr("nueva funcion");
    var names='';
    var information='';
    
    counter=0;
    names+='<div id="selectionsBox">';
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
    names=names.replace(", </h4>","</h4>");
    names=names.replace(", <h4>","<h4>");
    names+='</div>';
    
    
    minFont=12;
    //maxFont=(minFont+oposMAX)-1;  
    maxFont=20;
    js2='\');"';
    information += '<br><h4>Information:</h4>';
    information += '<ul>';
            
    for(var i in selections){
        information += '<div id="opossitesBox">';
        information += '<li><b>' + Nodes[i].label.toUpperCase() + '</b></li>';
        for(var j in Nodes[i].attributes){ 
            if(Nodes[i].attributes[j].attr=="period"||
                Nodes[i].attributes[j].attr=="cluster_label" 
                    )
                information += 
                '<li><b>' + Nodes[i].attributes[j].attr + 
                '</b>:&nbsp;'+Nodes[i].attributes[j].val+'</li>';
        }
        information += '</div>';            
        information += '</ul><br>';
    }
    
    
    $("#names").html(names); //Information extracted, just added
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

function updateLeftPanel(){
    var names='';
    var opossitesNodes='';
    var information='';
    
    counter=0;
    names+='<div id="selectionsBox">';
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
    names=names.replace(", </h4>","</h4>");
    names=names.replace(", <h4>","<h4>");
    names+='</div>';
    
    
    minFont=12;
    //maxFont=(minFont+oposMAX)-1;  
    maxFont=20;
    js2='\');"';
    if(flag==1) {
        opossitesNodes+= '<br><h4>Keywords: </h4>';
        opossitesNodes+='<div id="opossitesBox">';
        js1='onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'';
        for(var i in opos){
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            if(typeof(nodes2[opos[i].key])!=="undefined"){
                //fontSize=(opos[i].value/maxFont)*(maxFont-minFont)+minFont;
                fontSize=minFont+(opos[i].value-1)*((maxFont-minFont)/(oposMAX-1));
                opossitesNodes += '<span style="font-size:'+fontSize+'px; cursor: pointer;" '
                +js1+opos[i].key+js2+'>' + nodes2[opos[i].key].label+  '</span>,&nbsp;&nbsp;';
            }

        }        
        opossitesNodes += '</div>';
        information += '<br><h4>Information:</h4>';
        information += '<ul>';
            
        for(var i in selections){
            information += '<li><b>' + Nodes[i].label.toUpperCase() + '</b></li>';
            for(var j in Nodes[i].attributes){ 
                if(Nodes[i].attributes[j].attr=="period"||
                    Nodes[i].attributes[j].attr=="cluster_label" 
                        )
                    information += 
                    '<li><b>' + Nodes[i].attributes[j].attr + 
                    '</b>:&nbsp;'+Nodes[i].attributes[j].val+'</li>';
            }            
            information += '</ul><br>';
        }
    }
    
    if(flag==2 && socsemFlag==false) {
        opossitesNodes+= '<br><h4>Scholars: </h4>';
        opossitesNodes+='<div id="opossitesBox">';
        pr("max from opos: ");
        pr(oposMAX);    
        js1='onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\''; 
        for(var i in opos){
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            if(typeof(nodes1[opos[i].key])!=="undefined"){
                //fontSize=(opos[i].value/maxFont)*(maxFont-minFont)+minFont;
                fontSize=minFont+(opos[i].value-1)*((maxFont-minFont)/(oposMAX-1));
                opossitesNodes += '<span style="font-size:'+fontSize+'px; cursor: pointer;" '
                +js1+opos[i].key+js2+'>' + nodes1[opos[i].key].label+  '</span>,&nbsp;&nbsp;';
            }

        } 
        opossitesNodes+='</div>';
    }
    if(flag==2 && socsemFlag==true) {
        opossitesNodes+= '<br><h4>Neighbours: </h4>';
        opossitesNodes+='<div id="opossitesBox">';
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
    if(Nodes[node_id].type=="NGram") {
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
                
                i1=existingNodes[i].id+";"+existingNodes[j].id;                    
                i2=existingNodes[j].id+";"+existingNodes[i].id;                    
                      
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
        updateNodeFilter("semantic");
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
    
    if(Nodes[node_id].type=="Document") {
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
                
                i1=existingNodes[i].id+";"+existingNodes[j].id;                    
                i2=existingNodes[j].id+";"+existingNodes[i].id;                    
                      
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
            if(bipartite) updateLeftPanel();
            else updateLeftPanel2();
            /*****            
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
            if(bipartite) updateLeftPanel();
            else updateLeftPanel2();
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
                
                i1=existingNodes[i].id+";"+existingNodes[j].id;                    
                i2==existingNodes[j].id+";"+existingNodes[i].id;
                    
                indexS1 = existingNodes[i].id;
                indexT1 = existingNodes[j].id; 
                    
                indexS2 = existingNodes[j].id;  
                indexT2 = existingNodes[i].id;     

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
        existingNodes = partialGraph._core.graph.nodes;
        for(i=0; i < existingNodes.length ; i++){
            for(j=(i+1); j < existingNodes.length ; j++){
                    
                i1=existingNodes[i].id+";"+
                existingNodes[j].id; 
                
                i2=existingNodes[j].id+";"+
                existingNodes[i].id;
                            
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
                    if(Nodes[i].type=="Document"){
                        graphDocs(i);
                    }
                    if(Nodes[i].type=="NGram"){
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
                    if(Nodes[i].type=="Document"){
                        partialGraph.addNode(i,Nodes[i]);
                        for(var j in nodes1[i].neighbours) { 
                            id=nodes1[i].neighbours[j];
                            partialGraph.addNode(id,Nodes[id]);
                        }
                        createEdgesForExistingNodes("Scholars");
                    }
                    if(Nodes[i].type=="NGram"){
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
            updateBothNodeFilters();
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
                    if(Nodes[i].type=="NGram"){
                        graphNGrams(i);
                    }
                    if(Nodes[i].type=="Document"){
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
                    if(Nodes[i].type=="Document"){                        
                        for(var j in opossites) {
                            partialGraph.addNode(j,Nodes[j]);                            
                        }
                        createEdgesForExistingNodes("Keywords");
                        break;
                    }
                    if(Nodes[i].type=="NGram"){                        
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
            updateNodeFilter("semantic");
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
            if(Nodes[n].type=="NGram"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }  
        createEdgesForExistingNodes("Keywords");
        for(var n in selections){
            if(Nodes[n].type=="Document")
                highlightOpossites(opossites);
            break;
        }
        updateEdgeFilter(iwannagraph);
        updateNodeFilter("semantic");
    }
    if(iwannagraph=="social") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {                
            if(Nodes[n].type=="Document"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }
        createEdgesForExistingNodes("Scholars");
        for(var n in selections){
            if(Nodes[n].type=="NGram")
                highlightOpossites(opossites);
            break;
        }
        updateEdgeFilter(iwannagraph);
        updateNodeFilter("social");
    }
    
    if(iwannagraph=="sociosemantic") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {  
            partialGraph.addNode(n,Nodes[n]);          
        }
        for(var e in Edges) {
            st=e.split(";");
            index = partialGraph._core.graph.edgesIndex;
            if(typeof(index[st[0]+";"+st[1]])==="undefined" &&
                typeof(index[st[1]+";"+st[0]])==="undefined"
                ){                           
                            
                if(typeof(Edges[st[0]+";"+st[1]])!=="undefined" &&
                    typeof(Edges[st[1]+";"+st[0]])!=="undefined"
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
                else {
                    if(typeof(Edges[st[0]+";"+st[1]])!=="undefined"){
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
        updateBothEdgeFilters();
        updateBothNodeFilters();
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
    pr("Updating filter "+edgeFilterName);
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
    //pr(edges);
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
    //pr(edgesSortedByWeight);
    
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


function updateBothNodeFilters() {
    nodes=partialGraph._core.graph.nodes;    
    scholarsNodesBySize=[];
    keywordsNodesBySize=[];
    
    for(var i in nodes){
        if(Nodes[nodes[i].id].type=="Document"){
            if(typeof(scholarsNodesBySize[nodes[i].size])=="undefined"){
                scholarsNodesBySize[nodes[i].size]=[];
            }
            scholarsNodesBySize[nodes[i].size].push(nodes[i].id);
        }
        if(Nodes[nodes[i].id].type=="NGram"){
            if(typeof(keywordsNodesBySize[nodes[i].size])=="undefined"){
                keywordsNodesBySize[nodes[i].size]=[];
            }
            keywordsNodesBySize[nodes[i].size].push(nodes[i].id);
        }
    }
    scholarsSortedBySize = ArraySortByKey(scholarsNodesBySize, function(a,b){
        return a-b
    });    
    keywordsSortedBySize = ArraySortByKey(keywordsNodesBySize, function(a,b){
        return a-b
    });
    
    $("#sliderANodeWeight").slider({
        range: true,
        min: 0,
        max: scholarsSortedBySize.length-1,
        values: [0, scholarsSortedBySize.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                nodesTemp = partialGraph._core.graph.nodesIndex;
                for(i=0;i<scholarsSortedBySize.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in scholarsSortedBySize[i].value){
                            id=scholarsSortedBySize[i].value[j];
                            nodesTemp[id].hidden=false;
                        }
                    }
                    else {
                        for (var j in scholarsSortedBySize[i].value){
                            id=scholarsSortedBySize[i].value[j];
                            nodesTemp[id].hidden=true;
                        }
                    }
                }
                partialGraph.draw();
            });
        }
    });
    $("#sliderBNodeWeight").slider({
        range: true,
        min: 0,
        max: keywordsSortedBySize.length-1,
        values: [0, keywordsSortedBySize.length-1],
        step: 1,
        animate: true,
        slide: function(event, ui) {
            $.doTimeout(300,function (){
                //console.log("Rango Pesos Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
                nodesTemp = partialGraph._core.graph.nodesIndex;
                for(i=0;i<keywordsSortedBySize.length;i++){
                    if(i>=ui.values[0] && i<=ui.values[1]){
                        for (var j in keywordsSortedBySize[i].value){
                            id=keywordsSortedBySize[i].value[j];
                            nodesTemp[id].hidden=false;
                        }
                    }
                    else {
                        for (var j in keywordsSortedBySize[i].value){
                            id=keywordsSortedBySize[i].value[j];
                            nodesTemp[id].hidden=true;
                        }
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

function updateNodeFilter(nodeFilterName) {
    nodeType="";
    divName="";
    if(nodeFilterName=="social"){
        nodeType="Document";
        divName="#sliderANodeWeight";
    }
    else {
        nodeType="NGram";
        divName="#sliderBNodeWeight";
    }
    nodes=partialGraph._core.graph.nodes;
    nodesBySize=[];
    for(var i in nodes){
        if(Nodes[nodes[i].id].type==nodeType){
            if(typeof(nodesBySize[nodes[i].size])=="undefined"){
                nodesBySize[nodes[i].size]=[];
            }
            nodesBySize[nodes[i].size].push(nodes[i].id);
        }
    }
    nodesSortedBySize = ArraySortByKey(nodesBySize, function(a,b){
        return a-b
    });
    
    $(divName).slider({
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
    //ctx.arc(partialGraph._core.width/2, partialGraph._core.height/2, 4, 0, 2 * Math.PI, true);/*todel*/
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

function camaraButton(){
    $("#PhotoGraph").click(function (){
        
        //canvas=partialGraph._core.domElements.nodes;
        
        
        
        var nodesCtx = partialGraph._core.domElements.nodes;
        /*
        var edgesCtx = document.getElementById("sigma_edges_1").getContext('2d');
        
        var edgesImg = edgesCtx.getImageData(0, 0, document.getElementById("sigma_edges_1").width, document.getElementById("sigma_edges_1").height)
        
        nodesCtx.putImageData(edgesImg,0,0);
        
        
        
        
        //ctx.drawImage(partialGraph._core.domElements.edges,0,0)
        //var oCanvas = ctx;  
  */
        //div = document.getElementById("sigma_nodes_1").getContext('2d');
        //ctx = div.getContext("2d");
        //oCanvas.drawImage(partialGraph._core.domElements.edges,0,0);
        Canvas2Image.saveAsPNG(nodesCtx);
        
        /*
        Canvas2Image.saveAsJPEG(oCanvas); // will prompt the user to save the image as JPEG.   
        // Only supported by Firefox.  
  
        Canvas2Image.saveAsBMP(oCanvas);  // will prompt the user to save the image as BMP.  
  
  
        // returns an <img> element containing the converted PNG image  
        var oImgPNG = Canvas2Image.saveAsPNG(oCanvas, true);     
  
        // returns an <img> element containing the converted JPEG image (Only supported by Firefox)  
        var oImgJPEG = Canvas2Image.saveAsJPEG(oCanvas, true);   
                                                         
        // returns an <img> element containing the converted BMP image  
        var oImgBMP = Canvas2Image.saveAsBMP(oCanvas, true);   
  
  
        // all the functions also takes width and height arguments.   
        // These can be used to scale the resulting image:  
  
        // saves a PNG image scaled to 100x100  
        Canvas2Image.saveAsPNG(oCanvas, false, 100, 100);  
        */
    });
}
