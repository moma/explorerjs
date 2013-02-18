
var zoom=0;
var a_node_size= 0.50;
var b_node_size= 0.50;
var cursor_size= 0.01;
var a_edge_filter_min= 0.0;
var a_edge_filter_max= 1.0;
var a_node_filter_min= 0.0;
var a_node_filter_max= 1.0;
var b_edge_filter_min= 0.0;
var b_edge_filter_max= 1.0;
var b_node_filter_min= 0.0;
var b_node_filter_max= 1.0;

var checkBox=false;
var socsemFlag=false;

var overviewWidth = 200;
var overviewHeight = 175;
var overviewScale = 0.25;
var minZoom = 1;
var maxZoom = 7;
var moveDelay = 80, zoomDelay = 2;
//var Vecindad;
var gexf;
var partialGraph;
var labels = [];    
var Nodes = []; 
var Edges = [];

var selections = [];
var opossites = {};

var matches = [];

var nodes1 = [];
var nodes2 = [];
var bipartiteD2N = [];
var bipartiteN2D = [];

var flag=0;
var firstime=0;
var leftright=true;
var edgesTF=false;


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
};
    
function getWarning() {
    var isIE = /*@cc_on!@*/false;
    var loadingText = isIE ? "Ce site n'est pas assuré de fonctionner sous Internet Explorer. Il devrait marcher avec <a href=\"www.mozilla.org/fr/firefox/\">Firefox</a> ou <a href=\"https://www.google.com/chrome\">Chrome</a>." : "";
    return loadingText;
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
    for(var i in selections){
        node = partialGraph._core.graph.nodesIndex[i];
        node.active = false;
    }
    opossites = [];
    selections = [];
    partialGraph.refresh();
     
    $("#names").html(""); //Information extracted, just added
    $("#opossiteNodes").html(""); //Information extracted, just added
    $("#information").html("");
//$("#leftcontent").html("");

}

function search(string) {
    var id_node = '';
    partialGraph.iterNodes(function (n) {
        if (n.label == string) {
            id_node = n.id;
            return;
        }                
    });
    getOpossitesNodes(id_node, true);
}

  
function selection(currentNode){
    if(socsemFlag==false){
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
    partialGraph.refresh();
//console.log(selections.length);
    
}

function getOpossitesNodes(node_id, with_zoom) {
    console.log("Clickeaste a:"+node_id+" - "+Nodes[node_id]);
        
    console.log("holamundou");
    
    if(socsemFlag==true) {
        cancelSelection();
        socsemFlag=false;
    }
    
    var node = partialGraph._core.graph.nodesIndex[node_id];
    if (!node) return null;
    /*
    var nodes = [];
    if(node_id.toString().charAt(0)=="D"){
        //Click in Human: I've to show his keywords
        flag=1;//Hago click en Document izquierdo de informacion de nodos
        for(i=0;i<bipartiteD2N[node_id].neighbours.length;i++) {
            nodes[i] = Nodes[bipartiteD2N[node_id].neighbours[i]];
        }  
    }
    else {
        //Click in Keyword: I've to show his humans' 
        flag=2;//Hago click en Document izquierdo de informacion de nodos       
        for(i=0;i<bipartiteN2D[node_id].neighbours.length;i++) {
            nodes[i] = Nodes[bipartiteN2D[node_id].neighbours[i]];
        }  
    }
    */
    if(node_id.toString().charAt(0)=="D")flag=1;
    else flag=2;
    selection(node);  
    
    console.log("Selections: ");
    console.log(selections);
    console.log("Opossites: ");
    console.log(opossites);
    console.log(nodes2);
    
    
    
    
    var opos = ArraySort(opossites, function(a,b){
        return b-a
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
                opossitesNodes += '<li style="cursor: pointer" onclick="graphNGrams(\'' + opos[i].key + '\',true);edgesTF=false;selections=[];opossites=[];"><h2>' + nodes2[opos[i].key].label+  '</h2></li>';
            }
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphNGrams(\'' + opos[i].key + '\',true);edgesTF=false;selections=[];opossites=[];"><h3>' + nodes2[opos[i].key].label+  '</h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphNGrams(\'' + opos[i].key + '\',true);edgesTF=false;selections=[];opossites=[];"><h4>' + nodes2[opos[i].key].label+  '</h4></li>';
            }
            if(i>2) opossitesNodes += '<li style="cursor: pointer" onclick="graphNGrams(\'' + opos[i].key + '\',true);edgesTF=false;selections=[];opossites=[];">' + nodes2[opos[i].key].label+  '</li>';
            
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
        //console.log(nodes1);
        for (i=0;i<opos.length;i++) {
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            /**///Problema serio
            //console.log(opos[i].key);
            if(i==0) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h2>' + nodes1[opos[i].key].label+  '</h2></li>';
            }
            
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h3>' + nodes1[opos[i].key].label+  '<h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h4>' + nodes1[opos[i].key].label+  '<h4></li>';
            }
            
            if(i>2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];">' + nodes1[opos[i].key].label+  '</li>';
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
        //console.log(nodes1);
        for (i=0;i<opos.length;i++) {
            if(i==25){
                opossitesNodes += '<li>[...]</li>';
                break;
            }
            /**///Problema serio
            //console.log(opos[i].key);
            if(i==0) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h2>' + nodes2[opos[i].key].label+  '</h2></li>';
            }
            
            if(i==1) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h3>' + nodes2[opos[i].key].label+  '<h3></li>';
            }
            
            if(i==2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];"><h4>' + nodes2[opos[i].key].label+  '<h4></li>';
            }
            
            if(i>2) {
                opossitesNodes += '<li style="cursor: pointer" onclick="graphDocs(\'' + opos[i].key + '\');edgesTF=false;selections=[];opossites=[];">' + nodes2[opos[i].key].label+  '</li>';
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
    console.log("in graphNGrams, node_id: "+node_id);
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
                      
                if((typeof Edges[i1])!="undefined"){
                    //I've found a source Node
                    //Edges[i1].label="nodes2";
                    edgesFound[0]=Edges[i1];
                    partialGraph.addEdge(edgesFound[0].label,edgesFound[0].sourceID,edgesFound[0].targetID,edgesFound[0]);
                        
                }
                if((typeof Edges[i2])!="undefined"){
                    //I've found a target Node
                    //Edges[i2].label="nodes2";
                    edgesFound[1]=Edges[i2];
                    partialGraph.addEdge(edgesFound[1].label,edgesFound[1].sourceID,edgesFound[1].targetID,edgesFound[1]);
                }
                
            }
            
        } 
        partialGraph.startForceAtlas2();
    }
}
        
function graphDocs(node_id){
    console.log("in graphDocs, node_id: "+node_id);
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
        var edgesFound = [];
        for(i=0; i < existingNodes.length ; i++){
            if(existingNodes[i].id==node_id) i++;
            for(j=0; j < existingNodes.length ; j++){
                
                i1="D"+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+"D"+existingNodes[j].id.substring(3,existingNodes[j].id.length);                    
                i2="D"+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+"D"+existingNodes[i].id.substring(3,existingNodes[i].id.length);                    
                      
                if((typeof Edges[i1])!="undefined"){
                    //I've found a source Node
                    //Edges[i1].label="nodes1";
                    edgesFound[0]=Edges[i1];
                    partialGraph.addEdge(edgesFound[0].label,edgesFound[0].sourceID,edgesFound[0].targetID,edgesFound[0]);
                        
                }
                if((typeof Edges[i2])!="undefined"){
                    //I've found a target Node
                    //Edges[i2].label="nodes1";
                    edgesFound[1]=Edges[i2];
                    partialGraph.addEdge(edgesFound[1].label,edgesFound[1].sourceID,edgesFound[1].targetID,edgesFound[1]);
                }
                
            }
            
        }
        partialGraph.startForceAtlas2();
    }
}
       
function parse(gexfPath) {
    // Load XML file:
    var gexfhttp;
    gexfhttp = window.XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject('Microsoft.XMLHTTP');

    //gexfhttp.overrideMimeType('text/xml');
    gexfhttp.open('GET', gexfPath, false);
    gexfhttp.send();
    gexf = gexfhttp.responseXML;
}
    
function fullExtract(){
    var i, j, k;
    partialGraph.emptyGraph();
    // Parse Attributes
    // This is confusing, so I'll comment heavily
    var nodesAttributes = [];   // The list of attributes of the nodes of the graph that we build in json
    var edgesAttributes = [];   // The list of attributes of the edges of the graph that we build in json
    var attributesNodes = gexf.getElementsByTagName('attributes');  // In the gexf (that is an xml), the list of xml nodes 'attributes' (note the plural 's')
  
    for(i = 0; i<attributesNodes.length; i++){
        var attributesNode = attributesNodes[i];  // attributesNode is each xml node 'attributes' (plural)
        if(attributesNode.getAttribute('class') == 'node'){
            var attributeNodes = attributesNode.getElementsByTagName('attribute');  // The list of xml nodes 'attribute' (no 's')
            for(j = 0; j<attributeNodes.length; j++){
                var attributeNode = attributeNodes[j];  // Each xml node 'attribute'
        
                var id = attributeNode.getAttribute('id'),
                title = attributeNode.getAttribute('title'),
                type = attributeNode.getAttribute('type');
        
                var attribute = {
                    id:id, 
                    title:title, 
                    type:type
                };
                nodesAttributes.push(attribute);
        
            }
        } else if(attributesNode.getAttribute('class') == 'edge'){
            var attributeNodes = attributesNode.getElementsByTagName('attribute');  // The list of xml nodes 'attribute' (no 's')
            for(j = 0; j<attributeNodes.length; j++){
                var attributeNode = attributeNodes[j];  // Each xml node 'attribute'
        
                var id = attributeNode.getAttribute('id'),
                title = attributeNode.getAttribute('title'),
                type = attributeNode.getAttribute('type');
          
                var attribute = {
                    id:id, 
                    title:title, 
                    type:type
                };
                edgesAttributes.push(attribute);
        
            }
        }
    }
  
    var nodesNodes = gexf.getElementsByTagName('nodes') // The list of xml nodes 'nodes' (plural)
  
    labels = [];
    for(i=0; i<nodesNodes.length; i++){
        var nodesNode = nodesNodes[i];  // Each xml node 'nodes' (plural)
        var nodeNodes = nodesNode.getElementsByTagName('node'); // The list of xml nodes 'node' (no 's')

        for(j=0; j<nodeNodes.length; j++){
            var nodeNode = nodeNodes[j];  // Each xml node 'node' (no 's')
      
      
            window.NODE = nodeNode;

            var id = nodeNode.getAttribute('id');
            var label = nodeNode.getAttribute('label') || id;
      
      
            //viz
            var size = 1;
            var x = 100 - 200*Math.random();
            var y = 100 - 200*Math.random();
            var color;
      
            var positionNodes = nodeNode.getElementsByTagName('position');
            positionNodes = positionNodes.length ? 
            positionNodes : 
            nodeNode.getElementsByTagNameNS('*','position');
            if(positionNodes.length>0){
                var positionNode = positionNodes[0];
                x = parseFloat(positionNode.getAttribute('x'));
                y = parseFloat(positionNode.getAttribute('y'));
            }

            var colorNodes = nodeNode.getElementsByTagName('color');
            colorNodes = colorNodes.length ? 
            colorNodes : 
            nodeNode.getElementsByTagNameNS('*','color');
            if(colorNodes.length>0){
                colorNode = colorNodes[0];
                color = '#'+sigma.tools.rgbToHex(parseFloat(colorNode.getAttribute('r')),
                    parseFloat(colorNode.getAttribute('g')),
                    parseFloat(colorNode.getAttribute('b')));
            }
            // Create Node
            Nodes[id] = ({
                id:id,
                label:label, 
                size:size, 
                x:x, 
                y:y, 
                attributes:[], 
                color:color
            });  // The graph node
            
            var node = ({
                id:id,
                label:label, 
                size:size, 
                x:x, 
                y:y, 
                attributes:[], 
                color:color
            });  // The graph node
                
            // Attribute values
            var attvalueNodes = nodeNode.getElementsByTagName('attvalue');
            for(k=0; k<attvalueNodes.length; k++){
                var attvalueNode = attvalueNodes[k];
                var attr = attvalueNode.getAttribute('for');
                var val = attvalueNode.getAttribute('value');
                Nodes[id].attributes.push({
                    attr:attr, 
                    val:val
                });
                node.attributes.push({
                    attr:attr, 
                    val:val
                });
                /*      Para asignar tamaño a los NGrams    */
                if(attr==4) {
                    if(val<30) val=30;
                    Nodes[id].size=parseInt(val).toFixed(2);
                    node.size=Nodes[id].size;
                }
            /*      Para asignar tamaño a los NGrams    */
            }
                
            if(node.attributes[0].val=="Document"){
                partialGraph.addNode(id,node);
                labels.push({
                    'label' : label, 
                    'desc': Nodes[id].attributes[0].val
                });
            }
        }
    }
    var edgeId = 0;
    var edgesNodes = gexf.getElementsByTagName('edges');
    for(i=0; i<edgesNodes.length; i++){
        var edgesNode = edgesNodes[i];
        var edgeNodes = edgesNode.getElementsByTagName('edge');
        for(j=0; j<edgeNodes.length; j++){
            var edgeNode = edgeNodes[j];
            var source = edgeNode.getAttribute('source');
            var target = edgeNode.getAttribute('target');
            var indice=source.charAt(0)+source.substring(3,source.length)+";"+target.charAt(0)+target.substring(3,target.length);
            
            Edges[indice] = {
                id:         j,
                sourceID:   source,
                targetID:   target,
                label:      "",
                attributes: []
            };
            
            
            
            //Nodes2[source].neighbours.push(target);
                
            var edge = {
                id:         j,
                sourceID:   source,
                targetID:   target,
                label:      "",
                attributes: []
            };

            var weight = edgeNode.getAttribute('weight');
            if(weight!=undefined){
                Edges[indice]['weight'] = weight;
            }
            var kind;
            var attvalueNodes = edgeNode.getElementsByTagName('attvalue');
            for(k=0; k<attvalueNodes.length; k++){
                var attvalueNode = attvalueNodes[k];
                var attr = attvalueNode.getAttribute('for');
                var val = attvalueNode.getAttribute('value');
                if(k==1) {
                    kind=val;
                    edge.label=val;
                }
                Edges[indice].attributes.push({
                    attr:attr, 
                    val:val
                });
                edge.attributes.push({
                    attr:attr, 
                    val:val
                });
            }   
            
            
            if(edge.attributes[1].val=="nodes1"){
                if((typeof nodes1[source])=="undefined"){
                    nodes1[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    nodes1[source].neighbours.push(target);
                }
                else nodes1[source].neighbours.push(target);
            }
            
            
            if(edge.attributes[1].val=="nodes2"){
                if((typeof nodes2[source])=="undefined"){
                    nodes2[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    nodes2[source].neighbours.push(target);
                }
                else nodes2[source].neighbours.push(target);
            }
            
            
            if(edge.attributes[1].val=="bipartite"){
                /* Document to NGram */
                if((typeof bipartiteD2N[source])=="undefined"){
                    bipartiteD2N[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    bipartiteD2N[source].neighbours.push(target);
                }
                else bipartiteD2N[source].neighbours.push(target);
                
                /* NGram to Document */
                if((typeof bipartiteN2D[target])=="undefined"){
                    bipartiteN2D[target] = {
                        label: Nodes[target].label,
                        neighbours: []
                    };
                    bipartiteN2D[target].neighbours.push(source);
                }
                else bipartiteN2D[target].neighbours.push(source);
            }
            if(edge.attributes[1].val=="nodes1"){
                partialGraph.addEdge(indice,source,target,edge);
            }
                
        }
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

function alertCheckBox(e){
    if(e.checked==true) {
        console.log("efecto bind 1: fade");
        // Bind events :
        var greyColor = 'yellow';
        partialGraph.bind('overnodes',function(event){
            console.log("Dentro del efecto OverNodes");
            var nodes = event.content;
            var neighbors = {};
            partialGraph.iterEdges(function(e){
                if(nodes.indexOf(e.source)<0 && nodes.indexOf(e.target)<0){
                    if(!e.attr['grey']){
                        e.attr['true_color'] = e.color;
                        e.color = greyColor;
                        e.attr['grey'] = 1;
                    }
                }else{
                    e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
                    e.attr['grey'] = 0;

                    neighbors[e.source] = 1;
                    neighbors[e.target] = 1;
                }
            }).iterNodes(function(n){
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
            }).draw(2,2,2);
        });
        
        partialGraph.bind('outnodes',function(){
            console.log("Dentro del efecto OutNodes");
            partialGraph.iterEdges(function(e){
                e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
                e.attr['grey'] = 0;
            }).iterNodes(function(n){
                n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                n.attr['grey'] = 0;
            }).draw(2,2,2);
        });
    }
    else {
        console.log("efecto bind 2: hide");
        
        partialGraph.bind('overnodes',function(event){
            var nodes = event.content;
            var neighbors = {};
            partialGraph.iterEdges(function(e){
                if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
                    neighbors[e.source] = 1;
                    neighbors[e.target] = 1;
                }
            }).iterNodes(function(n){
                if(!neighbors[n.id]){
                    n.hidden = 1;
                }else{
                    n.hidden = 0;
                }
            }).draw(2,2,2);
        });
  
        partialGraph.bind('outnodes',function(){
            partialGraph.iterEdges(function(e){
                e.hidden = 0;
            }).iterNodes(function(n){
                n.hidden = 0;
            }).draw(2,2,2);
        });
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
            partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, ui.value);
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
    console.log(partialGraph);
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
    console.log("tracingmap");
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

$(document).ready(function () {

    $("#warning").html(getWarning());
    

    partialGraph = sigma.init(document.getElementById('sigma-example')).drawingProperties(sigmaJsDrawingProperties).graphProperties(sigmaJsGraphProperties).mouseProperties(sigmaJsMouseProperties);
    
    partialGraph.ctxMini = document.getElementById('overview').getContext('2d');
    partialGraph.ctxMini.clearRect(0, 0, 200, 175);
    
    $('#sigma-example').css('background-color','white');
    
   
    
    console.log("parsing...");        
    parse(gexfLocation);
    fullExtract(); 
    console.log("Parsing complete.");
    
    partialGraph.draw();
      
    initializeMap();
    updateMap();
        
    window.onhashchange = updateMap;
    
    
    partialGraph.bind('downnodes', function (event) {       
        partialGraph.stopForceAtlas2();
        
        //partialGraph.draw();
        getOpossitesNodes(event.content, false);
        
        if(is_empty(selections)==true){  
            $("#names").html(""); //Information extracted, just added
            $("#opossiteNodes").html(""); //Information extracted, just added
            $("#information").html("");
        }
    });
    
    partialGraph.startForceAtlas2();
    
    
    
    
    $("#loading").remove();
    //console.log(partialGraph._core.mousecaptor);
    
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
        return $('<li></li>')
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
    
    $("#socio").click(function () {
        console.log("socio");
    });
    
    $("#semantic").click(function () {
        console.log("sem");
    });
    
    $("#sociosemantic").click(function () {
        if(!is_empty(selections) && !is_empty(opossites)){
            partialGraph.emptyGraph();
            for(var i in selections) {
                partialGraph.addNode(i,Nodes[i]);
            }
                
            for(var i in opossites) {
                partialGraph.addNode(i,Nodes[i]);
            }
                
            var existingNodes = partialGraph._core.graph.nodes;
            var edgesFound = [];
            for(i=0; i < existingNodes.length ; i++){
                for(j=0; j < existingNodes.length ; j++){
                
                    i1=existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length)+";"+existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length);                    
                    i2=existingNodes[j].id.charAt(0)+existingNodes[j].id.substring(3,existingNodes[j].id.length)+";"+existingNodes[i].id.charAt(0)+existingNodes[i].id.substring(3,existingNodes[i].id.length);                    
                    
                    if((typeof Edges[i1])!="undefined"){
                        //I've found a source Node
                        //Edges[i1].label=label1;
                        edgesFound[0]=Edges[i1];
                        partialGraph.addEdge(edgesFound[0].label,edgesFound[0].sourceID,edgesFound[0].targetID,edgesFound[0]);
                        
                    }
                    if((typeof Edges[i2])!="undefined"){
                        //I've found a target Node
                        //Edges[i2].label=label2;
                        edgesFound[1]=Edges[i2];
                        partialGraph.addEdge(edgesFound[1].label,edgesFound[1].sourceID,edgesFound[1].targetID,edgesFound[1]);
                    }
                
                }
            
            }
            partialGraph.startForceAtlas2();
            socsemFlag=true;
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
        values: [a_edge_filter_min * 100.0, a_edge_filter_max * 100.0],
        animate: true,
        slide: function(event, ui) {
            console.log("Docs - Peso Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
        //return callSlider("#sliderAEdgeWeight", "filter.a.edge.weight");
        }
    });
    $("#sliderANodeWeight").slider({
        range: true,
        values: [a_node_filter_min * 100.0, a_node_filter_max * 100.0],
        animate: true,
        slide: function(event, ui) {
            console.log("Docs - Peso Nodo: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
        //return callSlider("#sliderANodeWeight", "filter.a.node.weight");
        }
    });
    $("#sliderBEdgeWeight").slider({
        range: true,
        values: [b_edge_filter_min * 100.0, b_edge_filter_max * 100.0],
        animate: true,
        slide: function(event, ui) {
            console.log("NGrams - Peso Arista: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
        //return callSlider("#sliderBEdgeWeight", "filter.b.edge.weight");
        }
    });
    $("#sliderBNodeWeight").slider({
        range: true,
        values: [b_node_filter_min * 100.0, b_node_filter_max * 100.0],
        animate: true,
        slide: function(event, ui) {
            console.log("NGrams - Peso Nodo: "+ui.values[ 0 ]+" , "+ui.values[ 1 ]);
        //return callSlider("#sliderBNodeWeight", "filter.b.node.weight");
        }
    });
    $("#sliderANodeSize").slider({
        value: a_node_size * 100.0,
        max: 100.0,
        animate: true,
        slide: function(event, ui) {
            console.log("Docs - Tamaño Nodo: "+ui.value);
        //return callSlider("#sliderANodeSize", "filter.a.node.size");
        }
    });
    $("#sliderBNodeSize").slider({
        value: b_node_size * 100.0,
        max: 100.0,
        animate: true,
        slide: function(event, ui) {
            console.log("NGrams - Tamaño Nodo: "+ui.value);
        //return callSlider("#sliderBNodeSize", "filter.b.node.size");
        }
    });
    $("#sliderSelectionZone").slider({
        value: cursor_size * 5.0,
        min: 0.0,
        max: 150.0,
        animate: true,
        change: function(event, ui) {
            cursor_size= ui.value;
        //return callSlider("#sliderSelectionZone", "selectionRadius");
        }
    });
    
    
  

/* Controls 
    $("#in").click(function () {
        partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, partialGraph._core.mousecaptor.ratio * 1.5);
    });
    $("#out").click(function () {
        partialGraph.zoomTo(partialGraph._core.domElements.nodes.width / 2, partialGraph._core.domElements.nodes.height / 2, partialGraph._core.mousecaptor.ratio * 0.5);
    });
    $("#center").click(function () {
        partialGraph.position(0,0,1).draw();
    });
    $("#cancel").click(function () {
        cancelSelection();    
    });

    $("#helpbutton").click(function () {
        $("#help").fadeIn('fast');
    });
    $("#closewindow, #closeimage").click(function () {
        $("#help").fadeOut('fast');
    });
    
    
    /******************* GEXF integration **********************/
    
});
