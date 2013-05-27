
function pr(msg) {
    console.log(msg);
}

function ArraySort(array, sortFunc){
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
        return sortFunc(o1.value, o2.value);
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
    pr("checkbox="+checkBox+"\tin cancelSelection");
    highlightSelectedNodes(false);
    opossites = [];
    selections = [];
    partialGraph.refresh();
     
    $("#names").html(""); //Information extracted, just added
    $("#opossiteNodes").html(""); //Information extracted, just added
    $("#information").html("");
    //    overNodes=false;
    //    var e = partialGraph._core.graph.edges;
    //    for(i=0;i<e.length;i++){
    //        e[i].color = e[i].attr['grey'] ? e[i].attr['true_color'] : e[i].color;
    //        e[i].attr['grey'] = 0;
    //    }
    //    partialGraph.draw(2,1,2);
    //            
    //    partialGraph.iterNodes(function(n){
    //        n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
    //        n.attr['grey'] = 0;
    //    }).draw(2,1,2);
    changeNewButtons();
}

function highlightSelectedNodes(flag){  
    pr("checkbox="+checkBox+"\tin highlightSelectedNodes");    
    if(!is_empty(selections)){    
        
        baseurl=window.location.origin+"/IntegracionSigmaGexf/";
        fullurl=baseurl+"img/trans/";
        
        for(var i in selections) {
            if(i.charAt(0)=="D" && document.getElementById("socio").src==fullurl+"active_scholars.png"){
                node = partialGraph._core.graph.nodesIndex[i];
                node.active = flag;
            }
            else if(i.charAt(0)=="N" && document.getElementById("semantic").src==fullurl+"active_tags.png") {
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
}

function changeNewButtons() {   
    pr("checkbox="+checkBox+"\tin changeNewButtons");
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";
    if(!is_empty(selections)) {
        if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
            if(document.getElementById("socio").src==fullurl+"status_active_scholars.png"){
                document.getElementById("socio").src=fullurl+"active_scholars.png";
                document.getElementById("semantic").src=fullurl+"inactive_tags.png";
                document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
            }  
            if(document.getElementById("semantic").src==fullurl+"status_active_tags.png"){
                document.getElementById("semantic").src=fullurl+"active_tags.png";
                document.getElementById("socio").src=fullurl+"inactive_scholars.png";
                document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
            }
            if(document.getElementById("sociosemantic").src==fullurl+"status_active_sociosem.png"){
                document.getElementById("sociosemantic").src=fullurl+"active_sociosem.png";
                document.getElementById("semantic").src=fullurl+"inactive_tags.png";
                document.getElementById("socio").src=fullurl+"inactive_scholars.png";
            }
            document.getElementById("switch").src=fullurl+"graph_meso.png";
        }
    }
}
  
function selection(currentNode){
    pr("checkbox="+checkBox+"\tin selection");
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
    partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, 0.8);
    partialGraph.refresh();
    changeNewButtons();
}

function getOpossitesNodes(node_id, entireNode) {
    pr("checkbox="+checkBox+"\tin getOpossitesNodes");
    var node;    
    if(entireNode==true) node=node_id;
    else node = partialGraph._core.graph.nodesIndex[node_id];
    if(socsemFlag==true) {
        cancelSelection();
        socsemFlag=false;
    }
    
    if (!node) return null;
    if(node.id.charAt(0)=="D")flag=1;
    else flag=2;
    selection(node);  
    
    var opos = ArraySort(opossites, function(a,b){
        return b-a
    });
    
    console.log("WOLOLO WOLOLO WOLOLO WOLOLO");
    $.ajax({
        type: 'GET',
        url: 'http://localhost/getJsonFromUrl/tagcloud.php',
        data: "url="+JSON.stringify(opos),
        //contentType: "application/json",
        //dataType: 'json',
        success : function(data){ 
            console.log(data);/**/
        },
        error: function(){ 
            pr("checkbox="+checkBox+"Page Not found.");
        }
    });
    
    var names='';
    var opossitesNodes='';
    var information='';
    
    counter=0;
    for(var i in selections){
        if(counter==4){
            names += '<h3><div class="largepill"></div>[...]</h3>';
            break;
        }
        names += '<h3><div class="largepill"></div>' + Nodes[i].label + ', </h3>';
        counter++;
    }
    if(flag==1) {
        opossitesNodes += '<br><h4>Keywords</h4>';
        opossitesNodes += '<ul>';
        
        for (i=0;i<opos.length;i++) {
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            if(i==0) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'' + opos[i].key + '\',true);"><h2>' + nodes2[opos[i].key].label+  '</h2></li>';
            }
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'' + opos[i].key + '\',true);"><h3>' + nodes2[opos[i].key].label+  '</h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'' + opos[i].key + '\',true);"><h4>' + nodes2[opos[i].key].label+  '</h4></li>';
            }
            if(i>2) opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphNGrams(\'' + opos[i].key + '\',true);">' + nodes2[opos[i].key].label+  '</li>';
            
        }
        
        opossitesNodes += '</ul>'
    
        information += '<br><h4>Information</h4>';    
        information += '<ul>';
            
        
        for(var i in selections){
        
            information += '<li><b>' + Nodes[i].label + '</b></li>';
            information += '<li>' + Nodes[i].attributes[3].val + '</li>';
            information += '</ul><br>';
        }
    }
    
    
    
    if(flag==2 && socsemFlag==false) {
        opossitesNodes += '<h4>Neighbours</h4>';
        opossitesNodes += '<ul>';
        for (i=0;i<opos.length;i++) {
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            if(i==0) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h2>' + nodes1[opos[i].key].label+  '</h2></li>';
            }
            
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h3>' + nodes1[opos[i].key].label+  '<h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h4>' + nodes1[opos[i].key].label+  '<h4></li>';
            }
            
            if(i>2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');">' + nodes1[opos[i].key].label+  '</li>';
            }
        }
        /*
        for (var i = 0; i < nodes.length; i++) {
            opossitesNodes += '<li onclick="graphDocs(\'' + nodes[i].id + '\');partialGraph.refresh();selections=[];opossites=[];">' + nodes[i].label+  '</li>';
        }*/
        opossitesNodes += '</ul>'
    
        information += '<br><h4>Links</h4>'; 
    }
    
    if(flag==2 && socsemFlag==true) {
        opossitesNodes += '<h4>Neighbours</h4>';
        opossitesNodes += '<ul>';
        for (i=0;i<opos.length;i++) {
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            if(i==0) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h2>' + nodes2[opos[i].key].label+  '</h2></li>';
            }
            
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h3>' + nodes2[opos[i].key].label+  '<h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');"><h4>' + nodes2[opos[i].key].label+  '<h4></li>';
            }
            
            if(i>2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="edgesTF=false;selections=[];opossites=[];graphDocs(\'' + opos[i].key + '\');">' + nodes2[opos[i].key].label+  '</li>';
            }
        }
        /*
        for (var i = 0; i < nodes.length; i++) {
            opossitesNodes += '<li onclick="graphDocs(\'' + nodes[i].id + '\');partialGraph.refresh();selections=[];opossites=[];">' + nodes[i].label+  '</li>';
        }*/
        opossitesNodes += '</ul>'
    
        information += '<br><h4>Links</h4>'; 
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
    pr("checkbox="+checkBox+"\tin graphNGrams");  
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";    
    document.getElementById("viewType").src=fullurl+"status_meso_view.png";
    document.getElementById("socio").src=fullurl+"inactive_scholars.png";
    document.getElementById("semantic").src=fullurl+"active_tags.png";
    document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
    document.getElementById("switch").src=fullurl+"graph_macro.png";
    
    console.log("in graphNGrams, node_id: "+node_id);
    $("#category-B").show();
    $("#category-A").hide();
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
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(Edges[i2].label,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }                
            }            
        } 
        var node = partialGraph._core.graph.nodesIndex[node_id];
        selection(node);
        partialGraph.startForceAtlas2();
    }
}
        
function graphDocs(node_id){
    pr("checkbox="+checkBox+"\tin graphDocs, node_id: "+node_id);    
    
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";    
    document.getElementById("viewType").src=fullurl+"status_meso_view.png";
    document.getElementById("socio").src=fullurl+"active_scholars.png";
    document.getElementById("semantic").src=fullurl+"inactive_tags.png";
    document.getElementById("sociosemantic").src=fullurl+"inactive_sociosem.png";
    document.getElementById("switch").src=fullurl+"graph_macro.png";
    
    $("#category-A").show();
    $("#category-B").hide();
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
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(Edges[i2].label,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }
            }
        }
        var node = partialGraph._core.graph.nodesIndex[node_id];
        selection(node);
        partialGraph.startForceAtlas2();
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
    pr("checkbox="+checkBox+"\tin alertCheckbox");
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
            if (partialGraph.position().ratio > minZoom) {
                partialGraph.position().ratio--;
                var _el = $(this),
                _off = $(this).offset(),
                _deltaX = evt.pageX - _el.width() / 2 - _off.left,
                _deltaY = evt.pageY - _el.height() / 2 - _off.top;
                partialGraph.centreX -= ( Math.SQRT2 - 1 ) * _deltaX / partialGraph.echelleGenerale;
                partialGraph.centreY -= ( Math.SQRT2 - 1 ) * _deltaY / partialGraph.echelleGenerale;
                $("#zoomSlider").slider("value",partialGraph.position().ratio);
            }
        } else {
            if (partialGraph.position().ratio < maxZoom) {
                partialGraph.position().ratio++;
                partialGraph.echelleGenerale = Math.pow( Math.SQRT2, partialGraph.position().ratio );
                var _el = $(this),
                _off = $(this).offset(),
                _deltaX = evt.pageX - _el.width() / 2 - _off.left,
                _deltaY = evt.pageY - _el.height() / 2 - _off.top;
                partialGraph.centreX += ( Math.SQRT2 - 1 ) * _deltaX / partialGraph.echelleGenerale;
                partialGraph.centreY += ( Math.SQRT2 - 1 ) * _deltaY / partialGraph.echelleGenerale;
                $("#zoomSlider").slider("value",partialGraph.position().ratio);
            }
        }
        partialGraph.totalScroll = 0;
    }
}

function initializeMap() {
    //clearInterval(partialGraph.timeRefresh);
    $("#zoomSlider").slider({
        orientation: "vertical",
        value: 1,//partialGraph.position().ratio,
        min: minZoom,
        max: maxZoom,
        range: "min",
        step: 0.1,
        slide: function( event, ui ) {
            partialGraph.zoomTo(
                partialGraph._core.domElements.nodes.width / 2, 
                partialGraph._core.domElements.nodes.height / 2, 
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
//partialGraph.timeRefresh = setInterval(traceMap,60);

}

function updateMap(){
    console.log("updating MiniMap");
    partialGraph.iterNodes(function(n){
        partialGraph.ctxMini.fillStyle = n.color;
        partialGraph.ctxMini.beginPath();
        numPosibilidades = 2.5 - 0.9;
        aleat = Math.random() * numPosibilidades;
        partialGraph.ctxMini.arc(((n.displayX/1.2)-200)*0.25 , ((n.displayY/1.2)+110)*0.25 , (0.9 + aleat)*0.25+1 , 0 , Math.PI*2 , true);
        //console.log(n.x*1000 +" * 0.25"+" _ "+ n.y*1000 +" * 0.25"+" _ "+ (0.9 + aleat) +" * 0.25 + 1");
        
        partialGraph.ctxMini.closePath();
        partialGraph.ctxMini.fill();
        
    });
    partialGraph.imageMini = partialGraph.ctxMini.getImageData(0, 0, 200, 175);
}

function traceMap() {
    pr("checkbox="+checkBox+"\ttracingmap");
    partialGraph.echelleGenerale = Math.pow( Math.SQRT2, partialGraph.position().ratio );
    partialGraph.decalageX = ( partialGraph._core.width / 2 ) - ( partialGraph.centreX * partialGraph.echelleGenerale );
    partialGraph.decalageY = ( partialGraph._core.height / 2 ) - ( partialGraph.centreY * partialGraph.echelleGenerale );
    
    
    partialGraph.ctxMini.putImageData(partialGraph.imageMini, 0, 0);
    
    var _r = 0.25 / partialGraph.echelleGenerale,
    _x = - _r * partialGraph.decalageX,
    _y = - _r * partialGraph.decalageY,
    _w = _r * partialGraph._core.width,
    _h = _r * partialGraph._core.height;
    partialGraph.ctxMini.strokeStyle = "rgb(220,0,0)";
    partialGraph.ctxMini.lineWidth = 3;
    partialGraph.ctxMini.fillStyle = "rgba(120,120,120,0.2)";
    partialGraph.ctxMini.beginPath();
    partialGraph.ctxMini.fillRect( _x, _y, _w, _h );
    partialGraph.ctxMini.strokeRect( _x, _y, _w, _h );
}

function updateDownNodeEvent(flagEvent){
    partialGraph.unbind("downnodes");
    partialGraph.unbind("overnodes");
    partialGraph.unbind("outnodes");
    hoverNodeEffectWhileFA2(flagEvent);
}

function hoverNodeEffectWhileFA2(flagEvent) {
    if(flagEvent==false){
        //If cursor_size=0 -> Normal and single mouse-selection
        alertCheckBox(checkBox);
        partialGraph.bind('downnodes', function (event) {
            getOpossitesNodes(event.content, false);
        
            if(is_empty(selections)==true){  
                $("#names").html(""); //Information extracted, just added
                $("#opossiteNodes").html(""); //Information extracted, just added
                $("#information").html("");
            }/**/
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
                        updateDownNodeEvent
                    }
                }else{
                    n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                    n.attr['grey'] = 0;
                }
            }).draw(2,1,2);
        });
    //        partialGraph.draw(2,1,2);
    //overNodes=false;/**/
    }
    else {
        //If cursor_size>0 -> Multiple mouse-selection
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
            partialGraph.refresh();
        });
        
    }
}

function createEdgesForExistingNodes (typeOfNodes) {
    pr("checkbox="+checkBox+"in createEdgesForExistingNodes");
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
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                    if(Edges[i1].weight < Edges[i2].weight){
                        partialGraph.addEdge(Edges[i2].label,Edges[i2].sourceID,Edges[i2].targetID,Edges[i2]);
                    }
                    if(Edges[i1].weight == Edges[i2].weight){
                        partialGraph.addEdge(Edges[i1].label,Edges[i1].sourceID,Edges[i1].targetID,Edges[i1]);
                    }
                }  
            }  
        }  
    }
//partialGraph.stopForceAtlas2();
//partialGraph.draw(1,1,1);
}

function changeInactvHover(img) { 
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";
    if(img.id=="socio") {
        if ( img.src==fullurl+"inactive_scholar.png" ) {
            img.src=fullurl+"hover_scholar.png"
        }
        if ( img.src==fullurl+"inactive_scholars.png" ) {
            img.src=fullurl+"hover_scholars.png"
        }
    }
    if(img.id=="semantic") {
        if ( img.src==fullurl+"inactive_tag.png" ) {
            img.src=fullurl+"hover_tag.png"
        }
        if ( img.src==fullurl+"inactive_tags.png" ) {
            img.src=fullurl+"hover_tags.png"
        }        
    }
    if(img.id=="sociosemantic") {
        if ( img.src==fullurl+"inactive_sociosem.png" ) {
            img.src=fullurl+"hover_sociosem.png"
        }     
    }
//    if(img.id=="switch"){
//        changeflag=false;
//        if(img.src==fullurl+"graph_meso.png") {
//            img.src=fullurl+"graph_macro.png";
//            changeflag=true;
//        }
//        if(img.src==fullurl+"graph_macro.png" && changeflag==false){
//            img.src=fullurl+"graph_meso.png";
//        }
//    }
}

function changeHoverInactv(img) {  
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";
    if(img.id=="socio") {
        if ( img.src==fullurl+"hover_scholar.png" ) {
            img.src=fullurl+"inactive_scholar.png"
        }
        if ( img.src==fullurl+"hover_scholars.png" ) {
            img.src=fullurl+"inactive_scholars.png"
        }        
    }
    if(img.id=="semantic") {
        if ( img.src==fullurl+"hover_tag.png" ) {
            img.src=fullurl+"inactive_tag.png"
        }
        if ( img.src==fullurl+"hover_tags.png" ) {
            img.src=fullurl+"inactive_tags.png"
        }
    }
    
    if(img.id=="sociosemantic") {
        if ( img.src==fullurl+"hover_sociosem.png" ) {
            img.src=fullurl+"inactive_sociosem.png"
        }    
    }
//    if(img.id=="switch"){
//        changeflag=false;
//        if(img.src==fullurl+"graph_macro.png") {
//            img.src=fullurl+"graph_meso.png";
//            changeflag=true;
//        }
//        if(img.src==fullurl+"graph_meso.png" && changeflag==false){
//            img.src=fullurl+"graph_macro.png";
//        }
//    }
}

function changeHoverActive(img) { 
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";
    
    if(img.id=="socio") {

        if ( img.src==fullurl+"hover_scholars.png" ) {
            img.src=fullurl+"active_scholars.png";  
            if(document.getElementById("semantic").src==fullurl+"active_tags.png") {
                document.getElementById("semantic").src=fullurl+"inactive_tags.png"
            }
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                changeToMacro();
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                socioClick();
            }
        }
        changeNewButtons();
    }
    
    if(img.id=="semantic") { 
        if ( img.src==fullurl+"hover_tags.png" ) { 
            img.src=fullurl+"active_tags.png";
            document.getElementById("socio").src=fullurl+"inactive_scholars.png";
            if(document.getElementById("viewType").src==fullurl+"status_macro_view.png"){
                changeToMacro();
            }
            if(document.getElementById("viewType").src==fullurl+"status_meso_view.png"){
                semanticClick();
            }
        }
        changeNewButtons();
    }
    
    if(img.id=="switch") { 
        hasbeenclicked=false;
        if ( img.src==fullurl+"graph_meso.png"){
            socioClick();
            document.getElementById("viewType").src=fullurl+"status_meso_view.png";
            document.getElementById("switch").src=fullurl+"graph_macro.png";
            hasbeenclicked=true;
        }
        if ( img.src==fullurl+"graph_macro.png" && hasbeenclicked==false){
            changeToMacro();
            document.getElementById("viewType").src=fullurl+"status_macro_view.png";
            document.getElementById("switch").src=fullurl+"graph_meso.png";
        }
    }
}

function semanticClick(){    
    var displayedGraph;
    for(var i in selections) {
        if(i.charAt(0)=="D") displayedGraph="Scholars";
        else displayedGraph="Keywords";
        break;
    }
        
    if(displayedGraph=="Keywords") {
        if(!is_empty(opossites)){
            partialGraph.emptyGraph();
            for(var i in opossites) {
                partialGraph.addNode(i,Nodes[i]);
            }
            createEdgesForExistingNodes("Keywords");
        }

    }
    //    else {// displayedGraph=="Keywords"
    //        if(!is_empty(selections)){
    //            partialGraph.emptyGraph();
    //            for(var i in selections) {
    //                partialGraph.addNode(i,Nodes[i]);
    //                for(var j in nodes2[i].neighbours) { 
    //                    id=nodes2[i].neighbours[j];
    //                    partialGraph.addNode(id,Nodes[id]);
    //                }
    //            }
    //            createEdgesForExistingNodes("Keywords");
    //        }
    //            
    //    }
    highlightSelectedNodes(true);
//partialGraph.stopForceAtlas2();
//partialGraph.draw();
//partialGraph.startForceAtlas2();    
}

function socioClick() {        
    var displayedGraph;
    for(var i in selections) {
        if(i.charAt(0)=="D") displayedGraph="Scholars";
        else displayedGraph="Keywords";
        break;
    }
        
    if(displayedGraph=="Scholars") {
        if(!is_empty(selections)){
            partialGraph.emptyGraph();
            for(var i in selections) {
                partialGraph.addNode(i,Nodes[i]);
                for(var j in nodes1[i].neighbours) { 
                    id=nodes1[i].neighbours[j];
                    partialGraph.addNode(id,Nodes[id]);
                }
            }
            
            createEdgesForExistingNodes("Scholars");/**/
        }
    }
    //    else {// displayedGraph=="Keywords"
    //        if(!is_empty(opossites)){
    //            partialGraph.emptyGraph();
    //            for(var i in opossites) {
    //                partialGraph.addNode(i,Nodes[i]);
    //            }
    //            createEdgesForExistingNodes("Scholars");
    //            
    //        }
    //    }
    highlightSelectedNodes(true);
//partialGraph.stopForceAtlas2();
//partialGraph.draw();
//partialGraph.startForceAtlas2();
    
}

function changeToMacro() { 
       
    baseurl=window.location.origin+"/IntegracionSigmaGexf/";
    fullurl=baseurl+"img/trans/";
    if(document.getElementById("semantic").src==fullurl+"active_tags.png") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {                
            if(Nodes[n].attributes[0].val=="NGram"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }  
        createEdgesForExistingNodes("Keywords");
        swclick=true;
    }
    if(document.getElementById("socio").src==fullurl+"active_scholars.png") {
        partialGraph.emptyGraph();
        for(var n in Nodes) {                
            if(Nodes[n].attributes[0].val=="Document"){
                partialGraph.addNode(n,Nodes[n]);
            }                
        }
        createEdgesForExistingNodes("Scholars");
        swclick=false;            
    }
    highlightSelectedNodes(true);
    //partialGraph.stopForceAtlas2();
    partialGraph.draw();
    partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, 0.8);
    partialGraph.refresh();
    partialGraph.startForceAtlas2();
}

$(document).ready(function () {

    partialGraph = sigma.init(document.getElementById('sigma-example'))
    .drawingProperties(sigmaJsDrawingProperties)
    .graphProperties(sigmaJsGraphProperties)
    .mouseProperties(sigmaJsMouseProperties);
    
    partialGraph.ctxMini = document.getElementById('overview').getContext('2d');
    partialGraph.ctxMini.clearRect(0, 0, 200, 175);
    
    $('#sigma-example').css('background-color','white');
    $("#category-B").hide();
    
    console.log("parsing...");        
    parse(gexfLocation);
    fullExtract(); 
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
    
    
    
    partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, 0.8);
    partialGraph.draw();
         
    initializeMap();
    updateMap();
        
    window.onhashchange = updateMap;
    
    updateDownNodeEvent(false);
        
    /* Initial Effect (Add: unchecked) HIDE */
    partialGraph.bind('overnodes',function(event){            
        var nodes = event.content;
        var neighbors = {};
        var e = partialGraph._core.graph.edges;
        for(i=0;i<e.length;i++){
            if(nodes.indexOf(e[i].source.id)>=0 || nodes.indexOf(e[i].target.id)>=0){
                neighbors[e[i].source.id] = 1;
                neighbors[e[i].target.id] = 1;
            }
        }
        partialGraph.draw(2,1,2);
            
        partialGraph.iterNodes(function(n){
            if(!neighbors[n.id]){
                n.hidden = 1;
            }else{
                n.hidden = 0;
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
        partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, 0.8);
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
    .mousemove(onOverviewMove)
    .mousedown(startMove)
    .mouseup(endMove)
    .mouseout(endMove)
    ;//.mousewheel(onGraphScroll);
    
    $("#sociosemantic").click(function () {
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
            changeNewButtons();
            $("#category-A").show();
            $("#category-B").show();
        }
        else alert("You must select a node!");
    });
    
    $("#zoomPlusButton").click(function () {
        partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, partialGraph._core.mousecaptor.ratio * 1.5);
        $("#zoomSlider").slider("value",partialGraph.position().ratio);
        return false;
    });
    $("#zoomMinusButton").click(function () {
        partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, partialGraph._core.mousecaptor.ratio * 0.5);
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
    
    $("#sliderAEdgeWeight").slider({
        range: true,
        min: 0.00045,
        max: 5.0,
        values: [0.00045, 5.0],
        step: 0.01,
        animate: true,
        slide: function(event, ui) {
            //console.log("Docs - Peso Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
            $.doTimeout(300,function (){
                var edgesTemp = partialGraph._core.graph.edges;
                for(i=0;i<edgesTemp.length;i++){
                    if(edgesTemp[i].attr.attributes[1].val=="nodes1"){
                        if(edgesTemp[i].weight>=ui.values[ 0 ] && edgesTemp[i].weight<=ui.values[ 1 ]) {
                            edgesTemp[i].hidden=false;
                        }
                        else edgesTemp[i].hidden=true;
                    }
                }
                partialGraph.draw();
            });
        }
    });
    $("#sliderANodeWeight").slider({
        range: true,
        min: 1,
        max: 100,
        values: [a_node_filter_min * 100.0, a_node_filter_max * 100.0],
        animate: true,
        slide: function(event, ui) {
        //console.log("Docs - Peso Nodo: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
        }
    });
    $("#sliderBEdgeWeight").slider({
        range: true,
        min: 0.00045,
        max: 5.0,
        values: [0.00045, 5.0],
        step: 0.01,
        animate: true,
        slide: function(event, ui) {
            //console.log("NGrams-keywords - Peso Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
            $.doTimeout(300,function (){
                var edgesTemp = partialGraph._core.graph.edges;
                for(i=0;i<edgesTemp.length;i++){
                    if(edgesTemp[i].attr.attributes[1].val=="nodes2"){
                        if(edgesTemp[i].weight>=ui.values[ 0 ] && edgesTemp[i].weight<=ui.values[ 1 ]) {
                            edgesTemp[i].hidden=false;
                        }
                        else edgesTemp[i].hidden=true;
                    }
                }
                partialGraph.draw();
            });
        }
    });
    $("#sliderBNodeWeight").slider({
        range: true,
        min: parseInt(minNodeSize),
        max: parseInt(maxNodeSize),
        values: [parseInt(minNodeSize), parseInt(maxNodeSize)],
        animate: true,
        slide: function(event, ui) {
            //console.log("NGrams - Peso Nodo: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
            $.doTimeout(300,function (){
                partialGraph.iterNodes(function (n){
                    if(n.id.charAt(0)=="N"){
                        if(n.size>=parseFloat(ui.values[ 0 ]) && n.size<=parseFloat(ui.values[ 1 ])) {
                            n.hidden = false;
                        }
                        else {
                            n.hidden=true;
                        }
                    }
                });
                partialGraph.draw();
            });
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
