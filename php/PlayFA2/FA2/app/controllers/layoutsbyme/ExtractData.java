package layoutsbyme;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import models.*;

public class ExtractData {

    private ArrayList<ANode> nds;
    private ArrayList<AnEdge> egs;
    
    
    public void doGETRequest(String stringurl) throws Exception {
        String linea;        
        try {
            URL url = new URL(stringurl);
            try {
                URLConnection con = url.openConnection();
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(con.getInputStream()));
                linea = in.readLine();
                Reader r = new StringReader(linea);
                System.out.println(linea);
                System.out.println(r);

            } catch (IOException exp1) {
                System.out.println(exp1);
            }
        } catch (MalformedURLException exp2) {
            System.out.println(exp2);
        }
    }

    public ExtractData(ArrayList<Node> nodes, ArrayList<Edge> edges) {
	nds = new ArrayList<ANode>();
	egs = new ArrayList<AnEdge>();
	for(Node n : nodes){
		ANode neo = new ANode();
		neo.setId(n.getId());
		neo.setDegree(n.getOcc());
		//n.getGroup();
		//n.getsID();
                double x = (0 + (int)(Math.random()*100))/100f;
                double y = (0 + (int)(Math.random()*100))/100f;		
                neo.setX(x);
                neo.setY(y);
		nds.add(neo);
		//System.out.println(neo.getId()+": deg->"+neo.getDegree()+" - x:"+neo.x()+" - y:"+neo.y());
	}

	for(Edge e : edges){
		AnEdge neo = new AnEdge();
		neo.setSource(getNds().get(e.getSource()));
		neo.setTarget(getNds().get(e.getTarget()));
		neo.setWeight(e.getValue());
		egs.add(neo);
		//System.out.println(neo.getSource().getId()+" -> "+neo.getTarget().getId()+" : "+neo.getWeight());
	}
    }






/*throws Exception {
	

        JSONParser parser = new JSONParser();
        try {

            Object obj = parser.parse(new FileReader("app/controllers/layoutsbyme/Elisa__Omodei.json"));

            JSONObject jsonObject = (JSONObject) obj;

//		long age = (Long) jsonObject.get("age");
//		System.out.println(age);

            // loop array
//		JSONArray msg = (JSONArray) jsonObject.get("messages");
//		Iterator<String> iterator = msg.iterator();
//		while (iterator.hasNext()) {
//			System.out.println(iterator.next());
//		}

            nds = new ArrayList<ANode>();
            JSONArray nodes = (JSONArray) jsonObject.get("nodes");
            for (int i = 0; i < nodes.size(); i++) {
                JSONObject node = (JSONObject) nodes.get(i);
                
                ANode n = new ANode();
                int id = (int) (long) node.get("id");
                //System.out.println("node_id: " + id);                
                n.setId(id);
                //String idS = (String) node.get("sID");
                //System.out.println("node_idS: " + idS);
                double x = (0 + (int)(Math.random()*100))/100f; ;
                double y = (0 + (int)(Math.random()*100))/100f; ;
                n.setX(x);
                n.setY(y);
                int deg = (int) (long) node.get("occ");
                //System.out.println("node_occ: " + deg);
                n.setDegree(deg);
                
                nds.add(n);
            }

            egs = new ArrayList<AnEdge>();
            JSONArray edges = (JSONArray) jsonObject.get("links");
            for (int i = 0; i < edges.size(); i++) {
                JSONObject edge = (JSONObject) edges.get(i);

                AnEdge e = new AnEdge();
                
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
*/

    public ArrayList<ANode> getNds() {
        return nds;
    }

    public ArrayList<AnEdge> getEgs() {
        return egs;
    }
    
    public void showNodes(){
        for(ANode n: nds){
            System.out.println(
                    "( id , deg , x , y ) = "+
                    "( "+n.getId()+" , "+n.getDegree()+" , "+n.x()+" , "+n.y()+" )"
                    );
        }
    }
}
