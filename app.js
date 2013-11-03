$( function () {

    var createForm = $( ".js-create__form" );
    createForm.on( "submit", function ( e ) {
        e.preventDefault();
        $.post( createForm.attr( "action" ), createForm.serialize(), function( data ) {
            var qr = document.getElementsByClassName( "js-create__qr" )[ 0 ]
            qr.innerHTML = "";
            new QRCode( qr , data );
            $( ".js-create__id" ).html( data );
        });
    });
});