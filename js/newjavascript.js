function startNewQuery() {
    jQuery(function($){

        var options = {
            //query: ' What is the name of this formula:  `x = (-b +- sqrt(b^2-4ac))/(2a)` ? ',
            query: document.getElementById("searching").value,
            page: 1,
            avatar_size: 55,
            count: 3,
            loading_text: "loading ..."
        };

        var widget = $("#paging .widget"),
        next = $("#paging .next"),
        prev = $("#paging .prev");

        var enable = function(el, yes) {
            yes ? $(el).removeAttr('disabled') :
            $(el).attr('disabled', true);
        };

        var stepClick = function(incr) {
            return function() {
                options.page = options.page + incr;
                enable(this, false);
                widget.tweet(options);
            };
        };

        next.bind("checkstate", function() {
            enable(this, widget.find("li").length == options.count)
        }).click(stepClick(1));

        prev.bind("checkstate", function() {
            enable(this, options.page > 1)
        }).click(stepClick(-1));

        widget.tweet(options).bind("loaded", function() { 
            if($("#tweets").text()=="") {
                $("#tweets").empty().append("No matching tweets found");
            }
            else next.add(prev).trigger("checkstate");
        //next.add(prev).trigger("checkstate");
        });
    });
}