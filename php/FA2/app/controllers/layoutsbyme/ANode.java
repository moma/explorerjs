/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package layoutsbyme;


public class ANode {
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
        //if (ForceAtlas2.nodesFA2[this.id] != null) {
            return ForceAtlas2.nodesFA2[this.getId()];
        //}
        //else return null;
    }
    
    
    public void setLayoutData(ForceAtlas2LayoutData fa2ld){
        ForceAtlas2.nodesFA2[this.getId()] = fa2ld;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}