// Fallback for old browsers with the indexOf() function
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}

// Get all SVGs on the page
var svgs = document.getElementsByTagName("svg"),
    svgL = svgs.length;

// Loop through all SVGs on the page
while( svgL-- ) {

    // If SVG doesn't have class, continue ...
    if(svgs[svgL].className.baseVal.indexOf('nopng') < 0) {

        // If this is not the first SVG, continue ...
        if(svgL > 0) {

            // Get title attribute of SVG
            var svgTitle = svgs[svgL].getAttribute("title");

            // Get all <use> elements from each SVG
            var uses = svgs[svgL].getElementsByTagName("use"),
                usesL = uses.length;

            // Loop through all <use> elements within an SVG
            while( usesL-- ) {

                // Get the 'xlink:href' attributes
                var svgId = uses[usesL].getAttribute("xlink:href");

                // Remove first character from variable (This removes the #)
                svgId = svgId.substring(1, svgId.length);

                // Create New Image
                var newImg = document.createElement("img");

                // Assign src attribute
                newImg.src = "assets/dist/icons/png/" + svgId + ".png";

                // Assign alt attribute
                newImg.alt = svgTitle ? svgTitle : '';

                // Insert new element straight after the SVG in question
                svgs[svgL].parentNode.insertBefore(newImg, svgs[svgL].nextSibling);
            }
        }

            // Remove all SVG nodes
            svgs[svgL].parentNode.removeChild(svgs[svgL]);
    }
}
