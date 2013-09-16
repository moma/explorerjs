/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package layoutsbyme;

/**
 *
 * @author pksm3
 */
public class AnEdge {
    private ANode source;
    private ANode target;
    private double weight;

    public ANode getSource() {
        return source;
    }

    public void setSource(ANode source) {
        this.source = source;
    }

    public ANode getTarget() {
        return target;
    }

    public void setTarget(ANode target) {
        this.target = target;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}
