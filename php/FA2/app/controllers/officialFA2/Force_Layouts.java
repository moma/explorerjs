/*
 Copyright 2008-2010 Gephi
 Authors : Mathieu Bastian <mathieu.bastian@gephi.org>
 Website : http://www.gephi.org

 This file is part of Gephi.

 Gephi is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 Gephi is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Gephi.  If not, see <http://www.gnu.org/licenses/>.
 */
package officialFA2;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import org.gephi.graph.api.Edge;
import org.gephi.graph.api.GraphController;
import org.gephi.graph.api.GraphModel;
import org.gephi.graph.api.Node;
import org.gephi.io.exporter.api.ExportController;
import org.gephi.io.importer.api.Container;
import org.gephi.io.importer.api.ContainerFactory;
import org.gephi.io.importer.api.ImportController;
import org.gephi.io.processor.plugin.DefaultProcessor;
import org.gephi.layout.plugin.AutoLayout;
import org.gephi.layout.plugin.forceAtlas2.ForceAtlas2;
import org.gephi.layout.plugin.forceAtlas2.ForceAtlas2Builder;
import org.gephi.project.api.ProjectController;
import org.gephi.project.api.Workspace;
import org.openide.util.Lookup;
import java.util.ArrayList;
import models.*;


public class Force_Layouts {

    public void log(String msg) {
        System.out.println(msg);
    }
    
    private String path, gexfName;

    public void algo(String path, String gexfName) throws Exception {
        this.path=path;
        this.gexfName=gexfName;
        ProjectController pc = Lookup.getDefault().lookup(ProjectController.class);
        pc.newProject();
        final Workspace workspace1 = pc.getCurrentWorkspace();

        //Generate a new random graph into a container
        Container container = Lookup.getDefault().lookup(ContainerFactory.class).newContainer();
        ImportController importController = Lookup.getDefault().lookup(ImportController.class);
        File file = new File(path + gexfName);
        container = importController.importFile(file);
        importController.process(container, new DefaultProcessor(), workspace1);

        short[] seconds = {(short)7,(short)10,(short)15,(short)30};
        
        ForceAtlas2(workspace1, seconds[0]);      
        
//        for (Node n : graph.getNodes()) {
//            Node[] neighbors = graph.getNeighbors(n).toArray();
//            System.out.println(n.getNodeData().getLabel() + " has " + neighbors.length + " neighbors");
//        }
//        for (Edge e : graph.getEdges()) {
//            System.out.println(e.getSource().getNodeData().getId() + " -> " + e.getTarget().getNodeData().getId());
//        }
    }
    

//    public void YifanHu(final Workspace workspace, final short secs) {
//
//                System.out.println("Comenzo el de "+secs+" [s] a las "+new java.util.Date());
//                GraphModel gm = Lookup.getDefault().lookup(GraphController.class).getModel(workspace);
//                AutoLayout autoLayout = new AutoLayout(secs, TimeUnit.SECONDS);
//                autoLayout.setGraphModel(gm);
//                autoLayout.addLayout(new YifanHuLayout(null, new StepDisplacement(1f)), 1f);
//                autoLayout.execute();
//                //Export
//                ExportController ec = Lookup.getDefault().lookup(ExportController.class);
//                File files = new File(path + gexfName.replace(".gexf", "") + "/");
//                if (!files.exists()) {
//                    files.mkdir();
//                }
//                try {
//                    ec.exportFile(new File(path + gexfName.replace(".gexf", "") + "/" + "YifanHu-" + secs + "s " + new java.util.Date() + ".png"));
//                    System.out.println("Termino el de "+secs+" [s] a las "+new java.util.Date());
//                } catch (IOException ex) {
//                    ex.printStackTrace();
//                }
//    }
    
    
    public void ForceAtlas2(final Workspace workspace, final short secs) {

                System.out.println("Comenzo el de "+secs+" [s] a las "+new java.util.Date());
                GraphModel gm = Lookup.getDefault().lookup(GraphController.class).getModel(workspace);
                //ForceAtlas2 forceAtlas2 = new ForceAtlas2(new ForceAtlas2Builder());
                /*
                for (Node n : gm.getGraph().getNodes()) {   
                    System.out.println(n.getNodeData().getLabel());
                }*/

                AutoLayout autoLayout = new AutoLayout(secs, TimeUnit.SECONDS);
                autoLayout.setGraphModel(gm);
                autoLayout.addLayout(new ForceAtlas2(new ForceAtlas2Builder()), 1f);
                autoLayout.execute();
                //Export
                ExportController ec = Lookup.getDefault().lookup(ExportController.class);
//                File files = new File(path + gexfName.replace(".gexf", "") + "/");
//                if (!files.exists()) {
//                    files.mkdir();
//                }
                try {
                    String outfile = gexfName.replace(".gexf", "") + "__" + "FA2-" + secs + "s " + new java.util.Date() + ".gexf";
                    System.out.println("saving: "+outfile);
                    ec.exportFile(new File(this.path+outfile));
                    System.out.println("Termino el de "+secs+" [s] a las "+new java.util.Date());
                    //System.exit(0);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }

    }

    public void FA2_fromScratch(ArrayList<Edge_copy> edges) {

                //System.out.println("Comenzo el de "+secs+" [s] a las "+new java.util.Date());

		ProjectController pc = Lookup.getDefault().lookup(ProjectController.class);
		pc.newProject();
		Workspace workspace = pc.getCurrentWorkspace();
		GraphModel graphModel = Lookup.getDefault().lookup(GraphController.class).getModel();

                //ForceAtlas2 forceAtlas2 = new ForceAtlas2(new ForceAtlas2Builder());
                /*
                for (Edge n : gm.getGraph().getEdges()) {   
                    System.out.println(n.getEdgeData().getLabel());
                }*/

		/*
                AutoLayout autoLayout = new AutoLayout(secs, TimeUnit.SECONDS);
                autoLayout.setGraphModel(gm);
                autoLayout.addLayout(new ForceAtlas2(new ForceAtlas2Builder()), 1f);
                autoLayout.execute();
		*/
    }
}
