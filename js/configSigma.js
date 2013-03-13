var inactiveColor = '#666';
var gexfLocation = "data/teste.gexf";
var startingNodeId = "1";
var minLengthAutoComplete = 1;
var maxSearchResults = 10;
var strSearchBar = "Search";


var zoom=0;
var a_node_size= 0.50;
var b_node_size= 0.50;
var cursor_size= 0.00;
var a_edge_filter_min= 0.0;
var a_edge_filter_max= 1.0;
var a_node_filter_min= 0.0;
var a_node_filter_max= 1.0;
var b_edge_filter_min= 0.0;
var b_edge_filter_max= 1.0;
var b_node_filter_min= 0.0;
var b_node_filter_max= 1.0;

var checkBox=false;
var overNodes=false;

var socsemFlag=false;
var constantNGramFilter;
var socialFlag=true;
var semanticFlag=false;
var maxNodeSize;
var minNodeSize;
var sliderNodeWeight;
var maxEdgeWeight;
var minEdgeWeight;

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
    //minNodeSize: 2,
    //maxNodeSize: 5,
    minEdgeSize: 1,
    maxEdgeSize: 1
};
var sigmaJsMouseProperties = {
    maxRatio: 32
};
