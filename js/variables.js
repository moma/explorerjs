var isBipartite = [];
isBipartite["hnetwork-1982_2013hn-homework1982_2013top200-Author-ISItermsAlexandrePartCountry-distributionalcooc-10000-oT0.19-10-louTrue.gexf"]=1;
isBipartite["Biparti_AuteurTermes.gexf"]=1;
var inactiveColor = '#666';
var startingNodeId = "1";
var minLengthAutoComplete = 1;
var maxSearchResults = 10;
var strSearchBar = "Search";


var gexf;
var zoom=0;
var a_node_size= 0.50;
var b_node_size= 0.50;
var cursor_size= 0.00;

var checkBox=false;
var overNodes=false;

var swclickFlag=false;
var swclickActual="";
var swclickPrev="";

var swhover=false;
var socsemFlag=false;
var constantNGramFilter;
var socialFlag=true;
var semanticFlag=false;
var maxNodeSize;
var minNodeSize;
var sliderNodeWeight;
var maxEdgeWeight;
var minEdgeWeight;

var desirableNodeSizeMIN=2;
var desirableNodeSizeMAX=10;

var overviewWidth = 200;
var overviewHeight = 175;
var overviewScale = 0.25;
var overviewHover=false;
var moveDelay = 80, zoomDelay = 2;
//var Vecindad;
var partialGraph;
var labels = [];    
var Nodes = []; 
var Edges = [];

var numberOfDocs=0;
var numberOfNGrams=0;
var semanticConverged=0;
var socialConverged=0;

var selections = [];
var opossites = {};
var opos=[];

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
    minEdgeSize: 2,
    maxEdgeSize: 2
};
var sigmaJsMouseProperties = {
    minRatio:0.3,
    maxRatio: 10
};
