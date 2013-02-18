var inactiveColor = '#666';
var gexfLocation = "data/teste.gexf";
var startingNodeId = "1";
var minLengthAutoComplete = 1;
var maxSearchResults = 10;
var strSearchBar = "Search";

var sigmaJsDrawingProperties = {
    defaultLabelColor: 'black',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 6,
    defaultEdgeType: 'curve',
    
    borderSize: 2.5,//Something other than 0
    nodeBorderColor: "default",//exactly like this
    defaultNodeBorderColor: "black"//,//Any color of your choice
    //defaultBorderView: "always"
};
var sigmaJsGraphProperties = {
    //minNodeSize: 0.5,
    //maxNodeSize: 5,
    minNodeSize: 3,
    maxNodeSize: 5,
    minEdgeSize: 1,
    maxEdgeSize: 1
};
var sigmaJsMouseProperties = {
    maxRatio: 32
};
