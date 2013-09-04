package forceatlas;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class ExtractData {

    private ArrayList<Node> nds;
    private ArrayList<Edge> egs;

    public ExtractData() throws FileNotFoundException, IOException {
        nds = new ArrayList<Node>();
        egs = new ArrayList<Edge>();        
        File archivo = null;
        FileReader fr = null;
        BufferedReader br = null;
        // Apertura del fichero y creacion de BufferedReader para poder
        // hacer una lectura comoda (disponer del metodo readLine()).
        archivo = new File("Graph.txt");
        fr = new FileReader(archivo);
        br = new BufferedReader(fr);
        String linea;
        String[] elems = null;
        while((linea=br.readLine())!=null) {
            elems = linea.split(" ");
            Node n1 = updateNode(elems[0]);
            Node n2 = updateNode(elems[1]);
            addEdge(n1,n2,Float.parseFloat(elems[2]));
        }
        fr.close();     
    }

    public ArrayList<Node> getNds() {
        return nds;
    }

    public ArrayList<Edge> getEgs() {
        return egs;
    }
    
    private void addEdge(Node n1, Node n2, double weight){
        Edge e = new Edge();
        e.setSource(n1);
        e.setTarget(n2);
        e.setWeight(weight);
        egs.add(e);
    }

    private Node updateNode(String node) {   
        int n = Integer.parseInt(node);
        int nodeExists = isInArray(n);
        Node f = null;
        if(nodeExists==-1)
            f = addNewNode(n);        
        else {
            int id = nodeExists;
            f = incrmNodeDeg(n,id);
        }
        return f;
    }
    
    
    /* Crea un nuevo nodo con grado 1 */
    private Node addNewNode(int source) {        
        Node n = new Node();
        n.setName(source);
        n.setDegree(1);
        n.setSize(5);        
        nds.add(n);
        int ind = nds.indexOf(n);
        nds.get(ind).setId(ind);
        return n;
    }
    
    
    /* Aumenta en uno el grado del nodo existente */
    private Node incrmNodeDeg(int source, int id) {
        Node n = nds.get(id);
        double deg = n.getDegree();
        n.setDegree(deg+1);      
        //double n1_deg = n.getDegree();
        //n.setDegree(n1_deg+1);
        return n;
    }
    
    
    /* Si es que encuentra lo buscado
     * retorna su posición correspondiente
     * del ArrayList */
    private int isInArray(double id){
        int res = -1;
        if(nds.isEmpty()) return res;
        else {
            for(int i=0; i<nds.size();i++){
                if(id==nds.get(i).getName()){
                    return i;
                }
            }
        }        
        return res;
    }

    public void showGraph(){
        System.out.println("nodes:");
        for(Node n : nds){
            System.out.println(n.getName()+": ( "+n.getLayoutData().dx+" , "+n.getLayoutData().dy+" )");
        }
                
        System.out.println("edges:");
        for(Edge e : egs){
            System.out.println(e.getSource().getName()+" <-> "+e.getTarget().getName());
        }
    }
    

}
