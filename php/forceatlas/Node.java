/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package forceatlas;


public class Node {
    private int name;
    private int id;
    private float x;
    private float y;
    private double size;
    private boolean fixed;
    private double degree;

    
    public double size() {
        return size;
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
    
    
    public ForceVectorNodeLayoutData getLayoutData(){
        //if (ForceAtlas2.nodesFA2[this.id] != null) {
            return ForceAtlasLayout.nodesFA[this.getId()];
        //}
        //else return null;
    }
    
    
    public void setLayoutData(ForceVectorNodeLayoutData fald){
        ForceAtlasLayout.nodesFA[this.getId()] = fald;
    }

    public int getName() {
        return name;
    }

    public void setName(int id) {
        this.name = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float x() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float y() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

}
