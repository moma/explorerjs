package controllers;


import play.*;
import play.mvc.*;
import play.libs.Json;
import play.mvc.Http.RequestBody;
import java.util.Map;
import play.data.DynamicForm;

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

    public static Result receiveJSON(String parameter) {
	
	String res = "";
	res = parameter+"\njijiijij\n";
	/*
	RequestBody body = request().body();
	String textBody = body.asText();
	if(textBody != null) {
	    res = "Got: " + textBody;
	} else {
	    res = "ah?\n";
	}*/
	return ok(res);
    }

    public static Result post() {
	    System.out.println("Nodes\n");
	    String nodesRAW = request().body().asFormUrlEncoded().get("nodes")[0];
	    System.out.println(nodesRAW);
	    /*
	    ObjectMapper mapper = new ObjectMapper();
	    mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
	    JsonNode df = mapper.readValue(nodesRAW, JsonNode.class);
	    System.out.println(df.toString());
	    */



	    System.out.println("\nLinks\n");
	    String linksRAW = request().body().asFormUrlEncoded().get("links")[0];
	    System.out.println(linksRAW);
	    return ok("lalal");
    }

  
}
