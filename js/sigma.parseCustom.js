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
            node.size=node.attributes[1].val;
                
            partialGraph.addNode(id,node);
            labels.push({
                'label' : label,
                'desc'  : node.type
            });
            
            if(parseInt(node.size) < parseInt(minNodeSize)) minNodeSize= node.size;
            if(parseInt(node.size) > parseInt(maxNodeSize)) maxNodeSize= node.size;
            // Create Node
            Nodes[id] = node  // The graph node
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
            
            Edges[indice] = {
                id:         indice,
                sourceID:   source,
                targetID:   target,
                label:      "",
                weight: 1,
                attributes: []
            };
                
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
                    Edges[indice].label=val;
                }
                if(k==3) {
                    Edges[indice].weight = val;
                    edge.weight = val;
                    if(edge.weight < minEdgeWeight) minEdgeWeight= edge.weight;
                    if(edge.weight > maxEdgeWeight) maxEdgeWeight= edge.weight;
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
            //console.log(edge);
            
            idS=Nodes[edge.sourceID].type.charAt(0);
            idT=Nodes[edge.targetID].type.charAt(0);
            if((typeof nodes1[source])=="undefined"){
                nodes1[source] = {
                    label: Nodes[source].label,
                    neighbours: []
                };
                nodes1[source].neighbours.push(target);
            }
            else nodes1[source].neighbours.push(target);
            
                          
            if( (typeof partialGraph._core.graph.edgesIndex[target+";"+source])=="undefined" ){
                partialGraph.addEdge(indice,source,target,edge);
            }
                            
        }
    }
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
                /*      Para asignar tamaño a los NGrams    */
                if(k==2) {
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
                numberOfDocs++;
                node.id=id;
                node.type = "Document";
                node.size=node.attributes[0].val;
                
                partialGraph.addNode(id,node);
                labels.push({
                    'label' : label,
                    'desc'  : node.type
                });
            }
            else {
                numberOfNGrams++;
                node.id=id;
                node.type = "NGram";
                node.size=node.attributes[0].val;
            }      
            
            if(parseInt(node.size) < parseInt(minNodeSize)) minNodeSize= node.size;
            if(parseInt(node.size) > parseInt(maxNodeSize)) maxNodeSize= node.size;
            // Create Node
            Nodes[id] = node  // The graph node
        }
    }    
    
    //New scale for node size: now, between 2 and 5 instead [1,70]
    for(var it in Nodes){
        Nodes[it].size = desirableNodeSizeMIN+
        (parseInt(Nodes[it].size)-1)*
        ((desirableNodeSizeMAX-desirableNodeSizeMIN)/
            (maxNodeSize-minNodeSize));
        if(Nodes[it].type.charAt(0)=="D") {
            partialGraph._core.graph.nodesIndex[it].size=Nodes[it].size;
        }        
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
            
            Edges[indice] = {
                id:         indice,
                sourceID:   source,
                targetID:   target,
                label:      "",
                weight: 1,
                attributes: []
            };
                
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
                    Edges[indice].label=val;
                }
                if(k==3) {
                    Edges[indice].weight = val;
                    edge.weight = val;
                    if(edge.weight < minEdgeWeight) minEdgeWeight= edge.weight;
                    if(edge.weight > maxEdgeWeight) maxEdgeWeight= edge.weight;
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
            //console.log(edge);
            
            idS=Nodes[edge.sourceID].type.charAt(0);
            idT=Nodes[edge.targetID].type.charAt(0);
            //pr(idS+";"+idT);
            if(idS=="D" && idT=="D"){
                Edges[edge.sourceID+";"+edge.targetID].label="nodes1";
                if((typeof nodes1[source])=="undefined"){
                    nodes1[source] = {
                        label: Nodes[source].label,
                        neighbours: []
                    };
                    nodes1[source].neighbours.push(target);
                }
                else nodes1[source].neighbours.push(target);
            }
            
            
            if(idS=="N" && idT=="N"){
                Edges[edge.sourceID+";"+edge.targetID].label="nodes2";
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
                Edges[edge.sourceID+";"+edge.targetID].label="bipartite";
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
            if(idS=="D" && idT=="D"){               
                if( (typeof partialGraph._core.graph.edgesIndex[target+";"+source])=="undefined" ){
                    partialGraph.addEdge(indice,source,target,edge);
                }
            }                
        }
    }
}
    

