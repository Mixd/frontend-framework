// Test for Inline SVG support
function supportsSvg() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
};

// Scope everything into a SIAF
(function(){

    // If browser doesn't support Inline SVG
    if ( !supportsSvg() ) {

        // Get all SVGs on the page and how many there are
        var svgs = document.getElementsByTagName("svg"),
            svgL = svgs.length;

        // Loop through all SVGs on the page
        while( svgL-- ) {

            // Define class check variable
            var checkSvgClass;

            // Check if browser supports indexOf() function
            if ('indexOf' in Array.prototype) {

                // use native indexOf
                checkSvgClass = svgs[svgL].className.baseVal.indexOf('nopng');
            } else {

                // create custom indexOf fallback function
                function indexOfFallback(elem, find, i) {
                    if (i===undefined) i= 0;
                    if (i<0) i+= this.length;
                    if (i<0) i= 0;
                    for (var n= this.length; i<n; i++)
                        if (i in this && this[i]===find)
                            return i;
                    return -1;
                };

                // use fallback
                checkSvgClass = indexOfFallback(svgs[svgL].className.baseVal, 'nopng');
            }

            // If SVG doesn't have class, continue ...
            if(checkSvgClass < 0) {

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
    }

})();
