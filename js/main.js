

$(document).ready(function () {
    partialGraph = sigma.init(document.getElementById('sigma-example'))
    .drawingProperties(sigmaJsDrawingProperties)
    .graphProperties(sigmaJsGraphProperties)
    .mouseProperties(sigmaJsMouseProperties);
    
    startMiniMap();
    
    console.log("parsing...");        
    parse("ohgod");
    fullExtract(); 
    updateEdgeFilter("social");
    updateNodeFilter("social");
    pushSWClick("social");
    console.log("Parsing complete.");   
    
    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8).draw();
    
    startEnviroment();
    partialGraph.startForceAtlas2();    
    
});
