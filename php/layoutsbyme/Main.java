/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package layoutsbyme;

/**
 *
 * @author pksm3
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        System.out.println(Math.min(4, Math.max(1, Runtime.getRuntime().availableProcessors())));

        // TODO code application logic here
        //"http://localhost:8080/getJSON?callback=jQuery19109809626471251249_1377620962679&unique_id=Greg__Paperin&it=1&_=1377620962680");
        ForceAtlas2 fa2 = new ForceAtlas2(null);
        fa2.initAlgo();
        
        fa2.legraphe.showNodes();
        
        for(int i=0; i<10; i++) fa2.goAlgo();
        //fa2.atomicGo();        
        fa2.legraphe.showNodes();
        

    }
}
