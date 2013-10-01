/*
 *Categories:
 *  ISItermsAlexandrePartCountry
 *  Authors
 **/


function parse(gexfPath) {
    var gexfhttp;
    gexfhttp = window.XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject('Microsoft.XMLHTTP');

    gexfhttp.open('GET', "data/"+gexfPath, false);
    gexfhttp.send();
    gexf = gexfhttp.responseXML;
}

function scanCategories(){
    var categories = {}
    nodesNodes = gexf.getElementsByTagName('nodes');
    for(i=0; i<nodesNodes.length; i++){       
        var nodesNode = nodesNodes[i];  // Each xml node 'nodes' (plural)
        nodeNodes = nodesNode.getElementsByTagName('node');
        
        for(j=0; j<nodeNodes.length; j++){
            attvalueNodes = nodeNodes[j].getElementsByTagName('attvalue');
            for(k=0; k<attvalueNodes.length; k++){
                attvalueNode = attvalueNodes[k];
                attr = attvalueNode.getAttribute('for');
                val = attvalueNode.getAttribute('value');
                if (attr=="category") categories[val]=1;
            }
        }
    }
    return Object.keys(categories).length;
}

function onepartiteExtract(){
    
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
    minNodeSize=5.00;
    maxNodeSize=5.00;
    numberOfDocs=0;
    numberOfNGrams=0;
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
            
            var node = ({
                id:id,
                label:label, 
                size:size, 
                x:x, 
                y:y, 
                type:"",
                attributes:[], 
                color:color
            });  // The graph node
                
            // Attribute values
            var attvalueNodes = nodeNode.getElementsByTagName('attvalue');
            for(k=0; k<attvalueNodes.length; k++){
                var attvalueNode = attvalueNodes[k];
                var attr = attvalueNode.getAttribute('for');
                var val = attvalueNode.getAttribute('value');
                node.attributes.push({
                    attr:attr, 
                    val:val
                });
            }
            node.id=id;
            node.type = "Document";
            if(node.attributes[0].attr=="weight"){
                node.size=node.attributes[0].val;
            }
            if(node.attributes[1].attr=="weight"){
                node.size=node.attributes[1].val;
            }
                
            partialGraph.addNode(id,node);
            labels.push({
                'label' : label,
                'desc'  : node.type
            });
            
            if(parseInt(node.size) < parseInt(minNodeSize)) minNodeSize= node.size;
            if(parseInt(node.size) > parseInt(maxNodeSize)) maxNodeSize= node.size;
            // Create Node
            Nodes[id] = node  // The graph node
            //pr(node);
        }
    }    
    
    //New scale for node size: now, between 2 and 5 instead [1,70]
    for(var it in Nodes){
        Nodes[it].size = 
        desirableNodeSizeMIN+
        (parseInt(Nodes[it].size)-1)*
        ((desirableNodeSizeMAX-desirableNodeSizeMIN)/
            (maxNodeSize-minNodeSize));
        partialGraph._core.graph.nodesIndex[it].size=Nodes[it].size;
    }
    

    var edgeId = 0;
    var edgesNodes = gexf.getElementsByTagName('edges');
    minEdgeWeight=5.0;
    maxEdgeWeight=0.0;
    for(i=0; i<edgesNodes.length; i++){
        var edgesNode = edgesNodes[i];
        var edgeNodes = edgesNode.getElementsByTagName('edge');
        for(j=0; j<edgeNodes.length; j++){
            var edgeNode = edgeNodes[j];
            var source = edgeNode.getAttribute('source');
            var target = edgeNode.getAttribute('target');
            var indice=source+";"+target;
            
            var edge = {
                id:         j,
                sourceID:   source,
                targetID:   target,
                label:      "",
                weight: 1,
                attributes: []
            };

            var weight = edgeNode.getAttribute('weight');
            if(weight!=undefined){
                edge['weight'] = weight;
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
                if(k==3) {
                    edge.weight = val;
                    if(edge.weight < minEdgeWeight) minEdgeWeight= edge.weight;
                    if(edge.weight > maxEdgeWeight) maxEdgeWeight= edge.weight;
                }
                edge.attributes.push({
                    attr:attr, 
                    val:val
                });
            }
            edge.label="nodes1";            
            if((typeof nodes1[source])=="undefined"){
                nodes1[source] = {
                    label: Nodes[source].label,
                    neighbours: []
                };
                nodes1[source].neighbours.push(target);
            }
            else nodes1[source].neighbours.push(target);
            Edges[indice] = edge;
            if( (typeof partialGraph._core.graph.edgesIndex[target+";"+source])=="undefined" ){
                partialGraph.addEdge(indice,source,target,edge);
            }
                            
        }
    }
}


function fullExtract(){
    var i, j, k;
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
    numberOfDocs=0;
    numberOfNGrams=0;
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
            
            var node = ({
                id:id,
                label:label, 
                size:size, 
                x:x, 
                y:y, 
                type:"",
                attributes:[], 
                color:color
            });  // The graph node
                
            // Attribute values
            var attvalueNodes = nodeNode.getElementsByTagName('attvalue');
            for(k=0; k<attvalueNodes.length; k++){
                var attvalueNode = attvalueNodes[k];
                var attr = attvalueNode.getAttribute('for');
                var val = attvalueNode.getAttribute('value');
                node.attributes.push({
                    attr:attr, 
                    val:val
                });
                /*      Para asignar tamaño a los NGrams    */
                if(k==2) {
                    node.size=parseInt(val).toFixed(2);
                
                /* Type of Node*/
                //console.log(val);
                //if(val<30) val=30;
                //Nodes[id].size=(parseInt(val).toFixed(2)*5)/70;
                //                    Nodes[id].size=parseInt(val).toFixed(2);
                //                    node.size=Nodes[id].size;
                //                    if(id.charAt(0)=="D") {
                //                        Nodes[id].size = "5";
                //                        node.size = "5";
                //                    }
                }
            /*      Para asignar tamaño a los NGrams    */
            }
            //console.log(node.attributes);
            
            if(node.attributes[2].val=="Author"){
                node.type="Document";
                node.shape="square";
                numberOfDocs++;
                //node.size=desirableScholarSize;
                node.size=node.attributes[0].val;
            }
            else {
                node.type="NGram";
                numberOfNGrams++;
                node.size=node.attributes[0].val;
            }      
            
            if(parseInt(node.size) < parseInt(minNodeSize)) minNodeSize= node.size;
            if(parseInt(node.size) > parseInt(maxNodeSize)) maxNodeSize= node.size;
            // Create Node
            Nodes[id] = node  // The graph node
        }
    }    
    
    //New scale for node size: now, between 2 and 5 instead [1,70]
    for(var i in Nodes){
        normalizedSize=desirableNodeSizeMIN+(Nodes[i].size-1)*((desirableNodeSizeMAX-desirableNodeSizeMIN)/(parseInt(maxNodeSize)-parseInt(minNodeSize)));
        Nodes[i].size = ""+normalizedSize;
        if(Nodes[i].type=="NGram") {
            nodeK = Nodes[i];
            nodeK.hidden=true;
            partialGraph.addNode(i,nodeK);  
            delete Nodes[i].hidden; 
        }
        else {
            partialGraph.addNode(i,Nodes[i]);  
            unHide(i);
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
            var indice=source+";"+target;
                
            var edge = {
                id:         indice,
                sourceID:   source,
                targetID:   target,
                label:      "",
                weight: 1,
                attributes: []
            };

            var weight = edgeNode.getAttribute('weight');
            if(weight!=undefined){
                edge['weight'] = weight;
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
                if(k==3) {
                    edge.weight = val;
                    if(edge.weight < minEdgeWeight) minEdgeWeight= edge.weight;
                    if(edge.weight > maxEdgeWeight) maxEdgeWeight= edge.weight;
                }
                edge.attributes.push({
                    attr:attr, 
                    val:val
                });
            }
            
            
            idS=Nodes[edge.sourceID].type.charAt(0);
            idT=Nodes[edge.targetID].type.charAt(0);
            //pr(idS+";"+idT);
            if(idS=="D" && idT=="D"){
                edge.label="nodes1";
                
                if( (typeof partialGraph._core.graph.edgesIndex[target+";"+source])=="undefined" ){
                    edge.hidden=false;
                }
                else edge.hidden=true;
                
                if((typeof nodes1[source])=="undefined"){
                    nodes1[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    nodes1[source].neighbours.push(target);
                }
                else nodes1[source].neighbours.push(target);
                
//                if((typeof nodes1[target])=="undefined"){
//                    nodes1[target] = {
//                        label: Nodes[target].label,
//                        neighbours: []
//                    };
//                    nodes1[target].neighbours.push(source);
//                }
//                else nodes1[target].neighbours.push(source);
            }
            
            
            if(idS=="N" && idT=="N"){
                edge.label="nodes2";
                edge.hidden=true;
                if((typeof nodes2[source])=="undefined"){                    
                    nodes2[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    nodes2[source].neighbours.push(target);
                }
                else nodes2[source].neighbours.push(target);
            }
            
            
            if((idS=="D" && idT=="N")||(idS=="N" && idT=="D")){                 
                edge.label="bipartite";
                edge.hidden=true;
                // Document to NGram 
                if((typeof bipartiteD2N[source])=="undefined"){   
                    bipartiteD2N[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    bipartiteD2N[source].neighbours.push(target);
                }
                else bipartiteD2N[source].neighbours.push(target);
                
                // NGram to Document 
                if((typeof bipartiteN2D[target])=="undefined"){
                    bipartiteN2D[target] = {
                        label: Nodes[target].label,
                        neighbours: []
                    };
                    bipartiteN2D[target].neighbours.push(source);
                }
                else bipartiteN2D[target].neighbours.push(source);
            }
            partialGraph.addEdge(indice,source,target,edge);
            delete edge.hidden;
            Edges[indice]=edge;
        }
    }
}
    

