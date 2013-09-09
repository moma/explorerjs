package layoutsbyme;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class ExtractData {

    private ArrayList<Node> nds;
    private ArrayList<Edge> egs;

    public ExtractData() {

        JSONParser parser = new JSONParser();

        try {

            Object obj = parser.parse(new FileReader("Elisa__Omodei.json"));

            JSONObject jsonObject = (JSONObject) obj;

//		long age = (Long) jsonObject.get("age");
//		System.out.println(age);

            // loop array
//		JSONArray msg = (JSONArray) jsonObject.get("messages");
//		Iterator<String> iterator = msg.iterator();
//		while (iterator.hasNext()) {
//			System.out.println(iterator.next());
//		}

            nds = new ArrayList<Node>();
            JSONArray nodes = (JSONArray) jsonObject.get("nodes");
            for (int i = 0; i < nodes.size(); i++) {
                JSONObject node = (JSONObject) nodes.get(i);
                
                Node n = new Node();
                int id = (int) (long) node.get("id");
                //System.out.println("node_id: " + id);                
                n.setId(id);
                
                //String idS = (String) node.get("sID");
                //System.out.println("node_idS: " + idS);
                
                int deg = (int) (long) node.get("occ");
                //System.out.println("node_occ: " + deg);
                n.setDegree(deg);
                
                nds.add(n);
            }

            egs = new ArrayList<Edge>();
            JSONArray edges = (JSONArray) jsonObject.get("links");
            for (int i = 0; i < edges.size(); i++) {
                JSONObject edge = (JSONObject) edges.get(i);

                Edge e = new Edge();
                
                int source = (int) (long) edge.get("source");
                e.setSource(getNds().get(source));
                //System.out.println("edge_s: " + source);

                int target = (int) (long) edge.get("target");
                e.setTarget(getNds().get(target));
                //System.out.println("edge_t: " + target);

                double weight = Float.parseFloat((String) edge.get("value"));
                e.setWeight(weight);
                //System.out.println("edge_w: " + weight);
                egs.add(e);
            }




        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

    }

    public ArrayList<Node> getNds() {
        return nds;
    }

    public ArrayList<Edge> getEgs() {
        return egs;
    }
    
    public void showNodes(){
        for(Node n: nds){
            System.out.println(n.getId()+": "+n.getDegree());
        }
    }
    
    public void showEdges(){
        for(Edge e: egs){
            System.out.println("");
        }
    }
}
