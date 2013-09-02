/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package layoutsbyme;


public class Node {
    private int id;
    private double x;
    private double y;
    private double size;
    private boolean fixed;
    private double degree;

    public double x() {
        return x;
    }

    public double y() {
        return y;
    }
    
    public double size() {
        return size;
    }

    public void setX(double x) {
        this.x = x;
    }
    
    public void setY(double y) {
        this.y = y;
    }

    public void setSize(double size) {
        this.size = size;
    }
        
    public boolean isFixed() {
        return fixed;
    }

    public void setFixed(boolean fixed) {
        this.fixed = fixed;
    }

    public double getDegree() {
        return degree;
    }

    public void setDegree(double degree) {
        this.degree = degree;
    }
    
    
    public ForceAtlas2LayoutData getLayoutData(){
        //if (ForceFactory.Nodes[this.id] != null) {
            return ForceFactory.Nodes[this.id];
        //}
    }
    
    
    public void setLayoutData(ForceAtlas2LayoutData fa2ld){
        ForceFactory.Nodes[this.id] = fa2ld;
    }

}
