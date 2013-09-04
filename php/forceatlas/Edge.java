/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package forceatlas;

/**
 *
 * @author pksm3
 */
public class Edge {
    private Node source;
    private Node target;
    private double weight;

    public Node getSource() {
        return source;
    }

    public void setSource(Node source) {
        this.source = source;
    }

    public Node getTarget() {
        return target;
    }

    public void setTarget(Node target) {
        this.target = target;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}
