/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



//For UNI-PARTITE
function updateLeftPanel_uni(){//Uni-partite graph
    pr("\t ** in updateLeftPanel_uni() ** ");
    var names='';
    var information='';
    
    counter=0;
    names+='<div id="selectionsBox">';
    names += '<h4>';
    for(var i in selections){
        if(counter==4){
            names += '<h4>[...]</h4>';
            break;
        }
        names += Nodes[i].label+', ';
        counter++;
    }
    names += '</h4>';
    names=names.replace(", </h4>","</h4>");
    names=names.replace(", <h4>","<h4>");
    names+='</div>';
    
    
    minFont=12;
    //maxFont=(minFont+oposMAX)-1;  
    maxFont=20;
    
//    
    params=[];
    for(var i in selections){
        params.push(Nodes[i].label);
    }
    jsonparams=JSON.stringify(params);
    //jsonparams = jsonparams.replaceAll("&","__and__");
    jsonparams = jsonparams.split('&').join('__and__');
    pr(jsonparams);
    $.ajax({
        type: 'GET',
        url: 'php/test.php',
        data: "type=semantic&query="+jsonparams,
        //contentType: "application/json",
        //dataType: 'json',
        success : function(data){ 
            $("#topPapers").html(data);
        },
        error: function(){ 
            pr('Page Not found: updateLeftPanel_uni()');
        }
    });
    
    
    
    
    js2='\');"';
    information += '<br><h4>Information:</h4>';
    information += '<ul>';
            
    for(var i in selections){
        information += '<div id="opossitesBox">';
        information += '<li><b>' + Nodes[i].label.toUpperCase() + '</b></li>';
        //for(var j in Nodes[i].attributes){
//            if(Nodes[i].attributes[j].attr=="period"||
//                Nodes[i].attributes[j].attr=="cluster_label" 
//                    )
                information += 
                '<li><b>density:' + 
                '</b>:&nbsp;'+Nodes[i].attributes["density"]+'</li>';
                information += 
                '<li><b>weight:' + 
                '</b>:&nbsp;'+Nodes[i].attributes["weight"]+'</li>';
        //}
        information += '</div>';            
        information += '</ul><br>';
    }
    
    
    $("#names").html(names); //Information extracted, just added
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

//FOR UNI-PARTITE
function selectionUni(currentNode){
    pr("in selectionUni");
    if(checkBox==false && cursor_size==0) {
        highlightSelectedNodes(false);
        opossites = [];
        selections = [];
        partialGraph.refresh();
    }   
    
    if((typeof selections[currentNode.id])=="undefined"){
        selections[currentNode.id] = 1;
        currentNode.active=true;
    }
    else {
        delete selections[currentNode.id];               
        currentNode.active=false;
    }
    //highlightOpossites(nodes1[currentNode.id].neighbours);
//        currentNode.color = currentNode.attr['true_color'];
//        currentNode.attr['grey'] = 0;
//        
//
   

    partialGraph.zoomTo(partialGraph._core.width / 2, partialGraph._core.height / 2, 0.8);
    partialGraph.refresh();
}

//JUST ADEME
function camaraButton(){
    $("#PhotoGraph").click(function (){
        
        //canvas=partialGraph._core.domElements.nodes;
        
        
        
        var nodesCtx = partialGraph._core.domElements.nodes;
        /*
        var edgesCtx = document.getElementById("sigma_edges_1").getContext('2d');
        
        var edgesImg = edgesCtx.getImageData(0, 0, document.getElementById("sigma_edges_1").width, document.getElementById("sigma_edges_1").height)
        
        nodesCtx.putImageData(edgesImg,0,0);
        
        
        
        
        //ctx.drawImage(partialGraph._core.domElements.edges,0,0)
        //var oCanvas = ctx;  
  */
        //div = document.getElementById("sigma_nodes_1").getContext('2d');
        //ctx = div.getContext("2d");
        //oCanvas.drawImage(partialGraph._core.domElements.edges,0,0);
        Canvas2Image.saveAsPNG(nodesCtx);
        
        /*
        Canvas2Image.saveAsJPEG(oCanvas); // will prompt the user to save the image as JPEG.   
        // Only supported by Firefox.  
  
        Canvas2Image.saveAsBMP(oCanvas);  // will prompt the user to save the image as BMP.  
  
  
        // returns an <img> element containing the converted PNG image  
        var oImgPNG = Canvas2Image.saveAsPNG(oCanvas, true);     
  
        // returns an <img> element containing the converted JPEG image (Only supported by Firefox)  
        var oImgJPEG = Canvas2Image.saveAsJPEG(oCanvas, true);   
                                                         
        // returns an <img> element containing the converted BMP image  
        var oImgBMP = Canvas2Image.saveAsBMP(oCanvas, true);   
  
  
        // all the functions also takes width and height arguments.   
        // These can be used to scale the resulting image:  
  
        // saves a PNG image scaled to 100x100  
        Canvas2Image.saveAsPNG(oCanvas, false, 100, 100);  
        */
    });
}

//JUST ADEME
function showhideChat(){
    
    cg = document.getElementById("rightcolumn");
    if(cg){
        if(cg.style.right=="-400px"){
            cg.style.right="0px";
        }
        else cg.style.right="-400px";
    }
}

//JUST ADEME
  function drawPercentBar(width, percent, color, background) { 
    var pixels = width * (percent / 100); 
    if (!background) { background = "none"; }
 
    document.write("<div style=\"position: relative; line-height: 1em; background-color: " 

                   + background + "; border: 1px solid black; width: " 
                   + width + "px\">"); 
    document.write("<div style=\"height: 1.5em; width: " + pixels + "px; background-color: "
                   + color + ";\"></div>"); 
    document.write("<div style=\"position: absolute; text-align: center; padding-top: .25em; width: " 
                   + width + "px; top: 0; left: 0\">" + percent + "%</div>"); 

    document.write("</div>"); 
  } 
