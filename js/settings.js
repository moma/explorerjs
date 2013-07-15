var iterationsTinaForce=10;

var inactiveColor = '#666';
var startingNodeId = "1";
var minLengthAutoComplete = 1;
var maxSearchResults = 10;
var strSearchBar = "Search";


var gexf;
//var zoom=0;
var cursor_size= 0.00;

var checkBox=false;
var overNodes=false;

var swclickActual="";
var swclickPrev="";

var socsemFlag=false;
var constantNGramFilter;

var desirableTagCloudFont_MIN=12;
var desirableTagCloudFont_MAX=20;
var desirableNodeSizeMIN=2;
var desirableNodeSizeMAX=9;
var desirableScholarSize=6; //Remember that all scholars have the same size!

var overviewWidth = 200;
var overviewHeight = 175;
var overviewScale = 0.25;
var overviewHover=false;
var moveDelay = 80, zoomDelay = 2;
//var Vecindad;
var partialGraph; 
var Nodes = []; 
var Edges = [];

var visibleNodes=[];
var visibleEdges=[];

var scholarsSortedBySize=[];
var keywordsSortedBySize=[];
var nodesSortedBySize=[];
var labels = [];   

var numberOfDocs=0;
var numberOfNGrams=0;
var semanticConverged=0;
var socialConverged=0;

var selections = [];
var opossites = {};
var opos=[];
var oposMAX;

var matches = [];

var nodes1 = [];
var nodes2 = [];
var bipartiteD2N = [];
var bipartiteN2D = [];

var flag=0;
var firstime=0;
var leftright=true;
var edgesTF=false;

//This variables will be updated in sigma.parseCustom.js
var minNodeSize=5.00;
var maxNodeSize=5.00;
var minEdgeWeight=5.0;
var maxEdgeWeight=0.0;
//---------------------------------------------------

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
    minEdgeSize: 2,
    maxEdgeSize: 2
};
var sigmaJsMouseProperties = {
    minRatio:0.3,
    maxRatio: 10
};
