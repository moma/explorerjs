/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package layoutsbyme;

import models.*;
import java.util.ArrayList;

/**
 *
 * @author pksm3
 */
public class Main {
    public static ForceAtlas2 fa2;
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args, ArrayList<Node> nodes, ArrayList<Edge> edges) throws Exception {
        //System.out.println(Math.min(4, Math.max(1, Runtime.getRuntime().availableProcessors())));

        // TODO code application logic here
        //"http://localhost:8080/getJSON?callback=jQuery19109809626471251249_1377620962679&unique_id=Greg__Paperin&it=1&_=1377620962680");
        
        //ExtractData ed = new ExtractData();
        //String unique_id = "Elisa__Omodei";
        //String it = "50";
        //ed.doGETRequest("http://localhost:8080/getJSON?callback=jQuery19107178748180158436_1378972340761&unique_id="+unique_id+"&it="+it+"&_=1378972340762");
        ForceAtlas2 fa2 = new ForceAtlas2(nodes,edges);
        fa2.initAlgo();
        
        //fa2.legraphe.showNodes();
        
        for(int i=0; i<50; i++) fa2.goAlgo();
		//fa2.atomicGo();        
        //fa2.legraphe.showNodes();

    }
}
