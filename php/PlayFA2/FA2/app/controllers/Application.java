package controllers;

import play.*;
import play.mvc.*;
import play.libs.Json;

import views.html.*;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render("Your new application is ready."));
    }

    public static Result returnJSON() {
	String [] sarr = new String[3];
	sarr[0] = "zero";
	sarr[1] = "one";
	sarr[2] = "two";
	return ok(Json.toJson(sarr));
    }
  
}
