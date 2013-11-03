$( function () {
    var tmplRaw = document.querySelector( ".js-items-list__template" ).innerHTML;
    var tmpl = Hogan.compile( tmplRaw );
    var data = {
        items: [
            {
                description: "einz",
                checkedOut: false
            }
        ]
    };

    var query = {
        "query" : {
            "match_all" : {}
        }
    };

    $.post( "/randl/item/_search", query, function ( data ) {
        console.log( "hlskdf", data.hits );
        var html = tmpl.render( data.hits );
        document.querySelector( ".js-items-list" ).innerHTML = html;
    });
});