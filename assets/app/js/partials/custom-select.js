(function( $ ) {

    CustomSelect = function(realSelectBox) {
        //wrap select div around select element
        realSelectBox.wrap("<div class='select icon--select'></div>");

        //element to display selected option
        var fakeSelect = $('<div/>', {
            "class": "select__placeholder",
        }).insertAfter(realSelectBox);

        //add text to fake select
        fakeSelect.text(realSelectBox.find("option:selected").text());

        //style real select box to be same size as fake select
        //hide it using opacity so its still clickable
        realSelectBox.css({
            "width": "100%",
            "height": "100%",
            "min-height": "100%",
            "opacity": "0",
            "position": "absolute",
            "top": "0",
            "left": "0",
            "cursor": "pointer"
        });

        //display text of selected option on change
        realSelectBox.on("change", function(event)
        {
            var textValue = $(this).find("option:selected").text();
            fakeSelect.text(textValue);
        });
    };

}( jQuery ));
