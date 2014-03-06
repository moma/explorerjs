/*
 * Customize as you want ;)
 */

// ============ < DEVELOPER OPTIONS > ============
var geomap=false;
var minimap=false;
var getAdditionalInfo=false;//for topPapers div
var mainfile=false;
var dataFolderTree = {};
var gexfDict={};
//gexfDict["data/the.gexf"]="The characteristic name";



var bridge={};
external="";
//external="http://tina.iscpif.fr/explorerjs/";//Just if you want to use the server-apps from tina.server
bridge["forFilteredQuery"] = external+"php/bridgeClientServer_filter.php";
bridge["forNormalQuery"] = external+"php/bridgeClientServer.php";




ircNick="";
ircCHN="";

var catSoc = "Document";
var catSem = "NGram";

var inactiveColor = '#666';
var startingNodeId = "1";
var minLengthAutoComplete = 1;
var maxSearchResults = 10;
var strSearchBar = "Search";
var cursor_size_min= 0;
var cursor_size= 0;
var cursor_size_max= 100;

var desirableTagCloudFont_MIN=12;
var desirableTagCloudFont_MAX=20;
var desirableNodeSizeMIN=1;
var desirableNodeSizeMAX=12;
var desirableScholarSize=6; //Remember that all scholars have the same size!

/*
 *Three states:
 *  - true: fa2 running at start
 *  - false: fa2 stopped at start, button exists
 *  - "off": button doesn't exist, fa2 stopped forever 
 **/
var fa2enabled=false;
var showLabelsIfZoom=2.0;
        // ============ < SIGMA.JS PROPERTIES > ============
        var desirableNodeSizeMIN=1;
        var desirableNodeSizeMAX=12;
        var desirableScholarSize=6; //Remember that all scholars have the same size!

        var sigmaJsDrawingProperties = {
            defaultLabelColor: 'black',
            defaultLabelSize: 10,//in fact I'm using it as minLabelSize'
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
            minRatio:0.1,
            maxRatio: 100
        };
        // ============ < / SIGMA.JS PROPERTIES > ============
         

// ============ < / DEVELOPER OPTIONS > ============



// ============ < VARIABLES.JS > ============
//"http://webchat.freenode.net/?nick=Ademe&channels=#anoe"
var ircUrl="http://webchat.freenode.net/?nick="+ircNick+"&channels="+ircCHN;
var twjs="tinawebJS/";
var iterationsFA2=1;
var categories = {};
var categoriesIndex = [];

var gexf;
//var zoom=0;

var checkBox=false;
var overNodes=false;

var swclickActual="";
var swclickPrev="";

var socsemFlag=false;
var constantNGramFilter;


var overviewWidth = 200;
var overviewHeight = 175;
var overviewScale = 0.25;
var overviewHover=false;
var moveDelay = 80, zoomDelay = 2;
//var Vecindad;
var partialGraph; 
var Nodes = []; 
var Edges = [];

var nodeslength=0;

var labels = [];   

var numberOfDocs=0;
var numberOfNGrams=0;
var semanticConverged=0;
var socialConverged=0;

var selections = [];
var deselections={};
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
var minNodeSize=1.00;
var maxNodeSize=5.00;
var minEdgeWeight=5.0;
var maxEdgeWeight=0.0;
//---------------------------------------------------

var bipartite=false;
var gexfDictReverse={}
for (var i in gexfDict){
    gexfDictReverse[gexfDict[i]]=i;
}

