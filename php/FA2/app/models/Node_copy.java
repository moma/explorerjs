package models;

import java.util.*;
import javax.persistence.*;

import play.db.ebean.*;
import play.data.format.*;
import play.data.validation.*;

//@Entity 
public class Node_copy extends Model {

    private int id;
    private int occ;
    private int group;
    private String sID;
    private double x;
    private double y;


    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }
    
    public void setX(double x) {
        this.x = x;
    }
    
    public void setY(double y) {
        this.y = y;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOcc() {
        return occ;
    }

    public void setOcc(int occ) {
        this.occ = occ;
    }

    public int group() {
        return group;
    }

    public void setGroup(int group) {
        this.group = group;
    }

    public String getsID() {
        return sID;
    }

    public void setsID(String sID) {
        this.sID = sID;
    }
}
