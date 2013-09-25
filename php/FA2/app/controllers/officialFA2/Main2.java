
package officialFA2;

import java.util.ArrayList;
import models.*;

public class Main2 {
    
    
    public static void ceparti(ArrayList<Edge_copy> edges) throws Exception {
        
        //System.out.println(args[0]);

        //HeadlessSimple headlessSimple = new HeadlessSimple();
        //headlessSimple.script();
        
        //WithAutoLayout autoLayout = new WithAutoLayout();
        //autoLayout.script();
/*
        ParallelWorkspace parallelWorkspace = new ParallelWorkspace();
        parallelWorkspace.script();

        PartitionGraph partitionGraph = new PartitionGraph();
        partitionGraph.script();

        RankingGraph rankingGraph = new RankingGraph();
        rankingGraph.script();

        Filtering filtering = new Filtering();
        filtering.script();

        ImportExport importExport = new ImportExport();
        importExport.script();

        MYSQLImportExport mYSQLImportExport = new MYSQLImportExport();
        mYSQLImportExport.script();
*/      
        /*
        System.out.println("hola mundo primer jar");
        
        //neo = new HelloDatabase();
        //neo.Connect();
        ManualGraph1 inst = new ManualGraph1();
        String folder = "/home/pksm3/Descargas/Grafos/";
        inst.algo(folder,"2013-06-13_13_16_29.1371122189.4137.gexf");
        inst.algo(folder,"2013-06-13_13_16_22.1371122182.9474.gexf");
        inst.algo(folder,"2013-06-13_13_15_39.1371122139.5702.gexf");
        inst.algo(folder,"2013-06-13_13_19_42.1371122382.962.gexf");
        */
        
        Force_Layouts inst = new Force_Layouts();
        inst.FA2_fromScratch(edges);
        
        
//        String path = args[0];
//        File folder = new File(path);
//        for (final File fileEntry : folder.listFiles()) {
//            if (fileEntry.isDirectory()) {
//                //System.out.println(fileEntry);
//            } else {
//                //System.out.println("path: "+path + " - gexf: "+fileEntry.getName());
//                new ManualGraph(path, fileEntry.getName()).start();
//            }
//        }
        //neo.close();
/*
        ManipulateAttributes manipulateAttributes = new ManipulateAttributes();
        manipulateAttributes.script();

        DynamicMetric longitudinalGraph = new DynamicMetric();
        longitudinalGraph.script();

        ImportDynamic importDynamic = new ImportDynamic();
        importDynamic.script();*/
    }
}
