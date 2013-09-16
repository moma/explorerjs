/*
 Copyright 2008-2011 Gephi
 Authors : Mathieu Jacomy <mathieu.jacomy@gmail.com>
 Website : http://www.gephi.org

 This file is part of Gephi.

 DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.

 Copyright 2011 Gephi Consortium. All rights reserved.

 The contents of this file are subject to the terms of either the GNU
 General Public License Version 3 only ("GPL") or the Common
 Development and Distribution License("CDDL") (collectively, the
 "License"). You may not use this file except in compliance with the
 License. You can obtain a copy of the License at
 http://gephi.org/about/legal/license-notice/
 or /cddl-1.0.txt and /gpl-3.0.txt. See the License for the
 specific language governing permissions and limitations under the
 License.  When distributing the software, include this License Header
 Notice in each file and include the License files at
 /cddl-1.0.txt and /gpl-3.0.txt. If applicable, add the following below the
 License Header, with the fields enclosed by brackets [] replaced by
 your own identifying information:
 "Portions Copyrighted [year] [name of copyright owner]"

 If you wish your version of this file to be governed by only the CDDL
 or only the GPL Version 3, indicate your decision by adding
 "[Contributor] elects to include this software in this distribution
 under the [CDDL or GPL Version 3] license." If you do not indicate a
 single choice of license, a recipient has the option to distribute
 your version of this file under either the CDDL, the GPL Version 3 or
 to extend the choice of license to its licensees as provided above.
 However, if you add GPL Version 3 code and therefore, elected the GPL
 Version 3 license, then the option applies only if the new code is
 made subject to such option by the copyright holder.

 Contributor(s):

 Portions Copyrighted 2011 Gephi Consortium.
 */
package layoutsbyme;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import layoutsbyme.ForceFactory.AttractionForce;
import layoutsbyme.ForceFactory.RepulsionForce;

/**
 * ForceAtlas 2 Layout, manages each step of the computations.
 *
 * @author Mathieu Jacomy
 */
public class ForceAtlas2 /*extends GraphLock*/ {

    //private Graph graph;
    //private final ForceAtlas2Builder layoutBuilder;
    private double edgeWeightInfluence=0;
    private double jitterTolerance=1;
    private double scalingRatio=1.;
    private double gravity;
    private double speed=1.;
    private boolean outboundAttractionDistribution = false;
    private boolean adjustSizes=false;
    private boolean barnesHutOptimize=false;
    private double barnesHutTheta=1.2;
    private boolean linLogMode=false;
    private boolean strongGravityMode=false;
    private int threadCount;
    private int currentThreadCount;
    private Region rootRegion;
    double outboundAttCompensation = 1;
    private ExecutorService pool;
    public static ForceAtlas2LayoutData[] nodesFA2;
    public ExtractData legraphe;
    private int complexIntervals = 500;
    private int simpleIntervals = 1000;
    HashMap<String, Integer> state = new HashMap<>();

    public ForceAtlas2(/*ForceAtlas2Builder layoutBuilder*/) {
        //this.layoutBuilder = layoutBuilder;
        this.threadCount = Math.min(4, Math.max(1, Runtime.getRuntime().availableProcessors() - 1));
    }

    public void initAlgo() throws Exception {
        speed = 1.;
        state.put("step", 0);
        state.put("index", 0);

        legraphe = new ExtractData(); //get JSON data
        ArrayList<ANode> nodesArrayList = legraphe.getNds();
        //readLock();
        ANode[] nodes = new ANode[nodesArrayList.size()];
        nodesArrayList.toArray(nodes);

//        Node[] nodes = (Node[]) legraphe.getNds().toArray();//Extraer nodos
        nodesFA2 = new ForceAtlas2LayoutData[nodes.length];

        // Initialise layout data
        for (ANode n : nodes) {
            if (n.getLayoutData() == null || !(n.getLayoutData() instanceof ForceAtlas2LayoutData)) {
                ForceAtlas2LayoutData nLayout = new ForceAtlas2LayoutData();
                n.setLayoutData(nLayout);
            }
            ForceAtlas2LayoutData nLayout = n.getLayoutData();
            nLayout.mass = 1 + n.getDegree();//graph.getDegree(n)???;
            nLayout.old_dx = 0;
            nLayout.old_dy = 0;
            nLayout.dx = 0;
            nLayout.dy = 0;
        }


        pool = Executors.newFixedThreadPool(threadCount);
        currentThreadCount = threadCount;
    }

    public void pr(String msg) {
        System.out.println(msg);
    }

//    public void atomicGo() {
//
//        ArrayList<Node> nodesArrayList = legraphe.getNds();
//        Node[] nodes = new Node[nodesArrayList.size()];
//        nodesArrayList.toArray(nodes);
//
//        ArrayList<Edge> edgesArrayList = legraphe.getEgs();
//        Edge[] edges = new Edge[edgesArrayList.size()];
//        edgesArrayList.toArray(edges);
//
//        int cInt = complexIntervals;
//        int sInt = simpleIntervals;
//
//        switch (state.get("step")) {
//            case 0:
//                pr("cero");
//                // Initialise layout data
//                for (Node n : nodes) {
//                    System.out.println("1. iterNodes");
//                    if (n.getLayoutData() == null || !(n.getLayoutData() instanceof ForceAtlas2LayoutData)) {
//                        ForceAtlas2LayoutData nLayout = new ForceAtlas2LayoutData();
//                        n.setLayoutData(nLayout);
//                    }
//                    ForceAtlas2LayoutData nLayout = n.getLayoutData();
//                    nLayout.mass = 1 + n.getDegree();//graph.getDegree(n)???;
//                    nLayout.old_dx = nLayout.dx;
//                    nLayout.old_dy = nLayout.dy;
//                    nLayout.dx = 0;
//                    nLayout.dy = 0;
//                }
//
//                // If Barnes Hut active, initialize root region
//                if (isBarnesHutOptimize()) {
//                    System.out.println("2. isBarnesHutOptimize()");
//                    rootRegion = new Region(nodes);
//                    rootRegion.buildSubRegions();
//                }
//
//                // If outboundAttractionDistribution active, compensate.
//                if (isOutboundAttractionDistribution()) {
//                    System.out.println("3. isOutboundAttractionDistribution()");
//                    outboundAttCompensation = 0;
//                    for (Node n : nodes) {
//                        ForceAtlas2LayoutData nLayout = n.getLayoutData();
//                        outboundAttCompensation += nLayout.mass;
//                    }
//                    outboundAttCompensation /= nodes.length;
//                }
//                state.put("step", 1);
//                state.put("index", 0);
//                break;
//            case 1:
//                pr("uno");
//                /*===== NORMAL REPULSION & GRAVITY =====*/
//                RepulsionForce Repulsion = ForceFactory.builder.buildRepulsion(isAdjustSizes(), getScalingRatio());
//                // Repulsion
//                if (barnesHutOptimize) {
//                    int i = state.get("index");
//                    while (i < nodes.length && i < state.get("index") + cInt) {
//                        Node n = nodes[i++];
//                        rootRegion.applyForce(n, Repulsion, barnesHutTheta);
//                    }
//                    if (i == nodes.length) {
//                        state.put("step", 2);
//                        state.put("index", 0);
//                    } else {
//                        state.put("index", i);
//                    }
//                } else {
//                    int i1 = state.get("index");
//                    while (i1 < nodes.length && i1 < state.get("index") + cInt) {
//                        Node n1 = nodes[i1++];
//                        for (int i2 = 0; i2 < nodes.length; i2++) {
//                            if (i2 < i1){
//                                Node n2 = nodes[i2];
//                                Repulsion.apply(n1, n2);
//                            }
//                        }
//                    }
//
//                    if (i1 == nodes.length) {
//                        state.put("step", 2);
//                        state.put("index", 0);
//                    } else {
//                        state.put("index", i1);
//                    }
//                }
//                /*===== NORMAL REPULSION =====*/
//                break;
//            case 2:
//                pr("dos");
//                break;
//            case 3:
//                pr("tres");
//                break;
//            case 4:
//                pr("cuatro");
//                break;
//            case 5:
//                pr("cinco");
//                break;
//        }
//    }

    public void goAlgo() {
        // Initialize graph data
        //Node[] nodes = (Node[]) legraphe.getNds().toArray();//Extraer nodos
        //Edge[] edges = (Edge[]) legraphe.getEgs().toArray();//Extraer aristas

        //readLock();
        ArrayList<ANode> nodesArrayList = legraphe.getNds();
        ANode[] nodes = new ANode[nodesArrayList.size()];
        nodesArrayList.toArray(nodes);

        ArrayList<AnEdge> edgesArrayList = legraphe.getEgs();
        AnEdge[] edges = new AnEdge[edgesArrayList.size()];
        edgesArrayList.toArray(edges);

        // Initialise layout data
        for (ANode n : nodes) {
            //System.out.println("1. iterNodes");
            if (n.getLayoutData() == null || !(n.getLayoutData() instanceof ForceAtlas2LayoutData)) {
                ForceAtlas2LayoutData nLayout = new ForceAtlas2LayoutData();
                n.setLayoutData(nLayout);
            }
            ForceAtlas2LayoutData nLayout = n.getLayoutData();
            nLayout.mass = 1 + n.getDegree();//graph.getDegree(n)???;
            nLayout.old_dx = nLayout.dx;
            nLayout.old_dy = nLayout.dy;
            nLayout.dx = 0;
            nLayout.dy = 0;
        }

        // If Barnes Hut active, initialize root region
        if (isBarnesHutOptimize()) {
            System.out.println("2. isBarnesHutOptimize()");
            rootRegion = new Region(nodes);
            rootRegion.buildSubRegions();
        }

        // If outboundAttractionDistribution active, compensate.
        if (isOutboundAttractionDistribution()) {
            System.out.println("3. isOutboundAttractionDistribution()");
            outboundAttCompensation = 0;
            for (ANode n : nodes) {
                ForceAtlas2LayoutData nLayout = n.getLayoutData();
                outboundAttCompensation += nLayout.mass;
            }
            outboundAttCompensation /= nodes.length;
        }

        /*===== NORMAL REPULSION & GRAVITY =====*/
        RepulsionForce Repulsion = ForceFactory.builder.buildRepulsion(isAdjustSizes(), getScalingRatio());
        // Repulsion
        if (barnesHutOptimize) {
            for (int nIndex = 0; nIndex < nodes.length; nIndex++) {
                ANode n = nodes[nIndex];
                rootRegion.applyForce(n, Repulsion, barnesHutTheta);
            }
        } else {
            for (int n1Index = 0; n1Index < nodes.length; n1Index++) {
                ANode n1 = nodes[n1Index];
                for (int n2Index = 0; n2Index < n1Index; n2Index++) {
                    ANode n2 = nodes[n2Index];
                    Repulsion.apply(n1, n2);
                }
            }
        }
        RepulsionForce GravityForce = (isStrongGravityMode()) ? (ForceFactory.builder.getStrongGravity(getScalingRatio())) : (Repulsion);
        // Gravity
        for (int nIndex = 0; nIndex < nodes.length; nIndex++) {
            ANode n = nodes[nIndex];
            GravityForce.apply(n, gravity / getScalingRatio());
        }
        
        /*===== NORMAL REPULSION & GRAVITY =====*/


        /*===== THREADED REPULSION & GRAVITY =====*/
//        int taskCount = 8 * currentThreadCount;  // The threadPool Executor Service will manage the fetching of tasks and threads.
//        // We make more tasks than threads because some tasks may need more time to compute.
//        ArrayList<Future> threads = new ArrayList();
//        for (int t = taskCount; t > 0; t--) {
//            int from = (int) Math.floor(nodes.length * (t - 1) / taskCount);
//            int to = (int) Math.floor(nodes.length * t / taskCount);
//            Future future = pool.submit(new NodesThread(nodes, from, to, isBarnesHutOptimize(), getBarnesHutTheta(), getGravity(), (isStrongGravityMode()) ? (ForceFactory.builder.getStrongGravity(getScalingRatio())) : (Repulsion), getScalingRatio(), rootRegion, Repulsion));
//            threads.add(future);
//        }
//        for (Future future : threads) {
//            try {
//                //System.out.print("");
//                future.get();
//            } catch (InterruptedException ex) {
//                System.err.print(ex);
//            } catch (ExecutionException ex) {
//                System.err.print(ex);
//            }
//        }
        /*===== THREADED REPULSION & GRAVITY =====*/


        // Attraction
        AttractionForce Attraction = ForceFactory.builder.buildAttraction(isLinLogMode(), isOutboundAttractionDistribution(), isAdjustSizes(), 1 * ((isOutboundAttractionDistribution()) ? (outboundAttCompensation) : (1)));
        if (getEdgeWeightInfluence() == 0) {
            for (AnEdge e : edges) {
                Attraction.apply(e.getSource(), e.getTarget(), 1);
            }
        } else if (getEdgeWeightInfluence() == 1) {
            for (AnEdge e : edges) {
                Attraction.apply(e.getSource(), e.getTarget(), e.getWeight());
            }
        } else {
            for (AnEdge e : edges) {
                Attraction.apply(e.getSource(), e.getTarget(), Math.pow(e.getWeight(), getEdgeWeightInfluence()));
            }
        }

        // Auto adjust speed
        double totalSwinging = 0d;  // How much irregular movement
        double totalEffectiveTraction = 0d;  // Hom much useful movement
        for (ANode n : nodes) {
            ForceAtlas2LayoutData nLayout = n.getLayoutData();
            if (!n.isFixed()) {
                double swinging = Math.sqrt(Math.pow(nLayout.old_dx - nLayout.dx, 2) + Math.pow(nLayout.old_dy - nLayout.dy, 2));
                totalSwinging += nLayout.mass * swinging;   // If the node has a burst change of direction, then it's not converging.
                totalEffectiveTraction += nLayout.mass * 0.5 * Math.sqrt(Math.pow(nLayout.old_dx + nLayout.dx, 2) + Math.pow(nLayout.old_dy + nLayout.dy, 2));
            }
        }
        // We want that swingingMovement < tolerance * convergenceMovement
        double targetSpeed = getJitterTolerance() * getJitterTolerance() * totalEffectiveTraction / totalSwinging;

        // But the speed shoudn't rise too much too quickly, since it would make the convergence drop dramatically.
        double maxRise = 0.5;   // Max rise: 50%
        speed = speed + Math.min(targetSpeed - speed, maxRise * speed);

        // Apply forces
        if (isAdjustSizes()) {
            System.out.println("4. isAdjustSizes()");
            // If nodes overlap prevention is active, it's not possible to trust the swinging mesure.
            for (ANode n : nodes) {
                ForceAtlas2LayoutData nLayout = n.getLayoutData();
                if (!n.isFixed()) {

                    // Adaptive auto-speed: the speed of each node is lowered
                    // when the node swings.
                    double swinging = Math.sqrt((nLayout.old_dx - nLayout.dx) * (nLayout.old_dx - nLayout.dx) + (nLayout.old_dy - nLayout.dy) * (nLayout.old_dy - nLayout.dy));
                    double factor = 0.1 * speed / (1f + speed * Math.sqrt(swinging));

                    double df = Math.sqrt(Math.pow(nLayout.dx, 2) + Math.pow(nLayout.dy, 2));
                    factor = Math.min(factor * df, 10.) / df;

                    double x = n.x() + nLayout.dx * factor;
                    double y = n.y() + nLayout.dy * factor;

                    //n.setX((float) x);
                    //n.setY((float) y);
                    n.setX(x);
                    n.setY(y);
                    //System.out.println(x+" , "+y);
                }
            }
        } else {
            System.out.println("else 4. isAdjustSizes()");
            for (ANode n : nodes) {
                ForceAtlas2LayoutData nLayout = n.getLayoutData();
                if (!n.isFixed()) {

                    // Adaptive auto-speed: the speed of each node is lowered
                    // when the node swings.
                    double swinging = Math.sqrt((nLayout.old_dx - nLayout.dx) * (nLayout.old_dx - nLayout.dx) + (nLayout.old_dy - nLayout.dy) * (nLayout.old_dy - nLayout.dy));
                    //double factor = speed / (1f + Math.sqrt(speed * swinging));
                    double factor = speed / (1f + speed * Math.sqrt(swinging));

                    double x = n.x() + nLayout.dx * factor;
                    double y = n.y() + nLayout.dy * factor;

//                    n.setX((float) x);
//                    n.setY((float) y);
                    n.setX(x);
                    n.setY(y);
                    //System.out.println(swinging);
                }
            }
        }
        //graph.readUnlockAll();/*not completed*/
        //readUnlockAll();
    }

//    public boolean canAlgo() {
//        return graphModel != null;
//    }
//    public void endAlgo() {
//        for (Node n : graph.getNodes()) {
//            n.setLayoutData(null);
//        }
//        pool.shutdown();
//        graph.readUnlockAll();
//    }
    public void resetPropertiesValues() {
        int nodesCount = 0;
        nodesCount = legraphe.getNds().size();

        // Tuning
        if (nodesCount >= 100) {
            setScalingRatio(2.0);
        } else {
            setScalingRatio(10.0);
        }
        setStrongGravityMode(false);
        setGravity(1.);

        // Behavior
        setOutboundAttractionDistribution(false);
        setLinLogMode(false);
        setAdjustSizes(false);
        setEdgeWeightInfluence(1.);

        // Performance
        if (nodesCount >= 50000) {
            setJitterTolerance(10d);
        } else if (nodesCount >= 5000) {
            setJitterTolerance(1d);
        } else {
            setJitterTolerance(0.1d);
        }
        if (nodesCount >= 1000) {
            setBarnesHutOptimize(true);
        } else {
            setBarnesHutOptimize(false);
        }
        setBarnesHutTheta(1.2);
        setThreadsCount(2);
    }

//    public LayoutBuilder getBuilder() {
//        return layoutBuilder;
//    }
//
//    
//    public void setGraphModel(GraphModel graphModel) {
//        this.graphModel = graphModel;
//        // Trick: reset here to take the profile of the graph in account for default values
//        resetPropertiesValues();
//    }
    public Double getBarnesHutTheta() {
        return barnesHutTheta;
    }

    public void setBarnesHutTheta(Double barnesHutTheta) {
        this.barnesHutTheta = barnesHutTheta;
    }

    public Double getEdgeWeightInfluence() {
        return edgeWeightInfluence;
    }

    public void setEdgeWeightInfluence(Double edgeWeightInfluence) {
        this.edgeWeightInfluence = edgeWeightInfluence;
    }

    public Double getJitterTolerance() {
        return jitterTolerance;
    }

    public void setJitterTolerance(Double jitterTolerance) {
        this.jitterTolerance = jitterTolerance;
    }

    public Boolean isLinLogMode() {
        return linLogMode;
    }

    public void setLinLogMode(Boolean linLogMode) {
        this.linLogMode = linLogMode;
    }

    public Double getScalingRatio() {
        return scalingRatio;
    }

    public void setScalingRatio(Double scalingRatio) {
        this.scalingRatio = scalingRatio;
    }

    public Boolean isStrongGravityMode() {
        return strongGravityMode;
    }

    public void setStrongGravityMode(Boolean strongGravityMode) {
        this.strongGravityMode = strongGravityMode;
    }

    public Double getGravity() {
        return gravity;
    }

    public void setGravity(Double gravity) {
        this.gravity = gravity;
    }

    public Integer getThreadsCount() {
        return threadCount;
    }

    public void setThreadsCount(Integer threadCount) {
        if (threadCount < 1) {
            setThreadsCount(1);
        } else {
            this.threadCount = threadCount;
        }
    }

    public Boolean isOutboundAttractionDistribution() {
        return outboundAttractionDistribution;
    }

    public void setOutboundAttractionDistribution(Boolean outboundAttractionDistribution) {
        this.outboundAttractionDistribution = outboundAttractionDistribution;
    }

    public Boolean isAdjustSizes() {
        return adjustSizes;
    }

    public void setAdjustSizes(Boolean adjustSizes) {
        this.adjustSizes = adjustSizes;
    }

    public Boolean isBarnesHutOptimize() {
        return barnesHutOptimize;
    }

    public void setBarnesHutOptimize(Boolean barnesHutOptimize) {
        this.barnesHutOptimize = barnesHutOptimize;
    }
}
