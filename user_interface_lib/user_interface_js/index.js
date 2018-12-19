var menuEl = document.getElementById('ml-menu'),
    mlmenu = new MLMenu(menuEl, {
        // breadcrumbsCtrl : true, // show breadcrumbs
        // initialBreadcrumb : 'all', // initial breadcrumb text
        backCtrl: false, // show back button
        // itemsDelayInterval : 60, // delay between each menu item sliding animation
        onItemClick: loadDummyData // callback: item that doesn´t have a submenu gets clicked - onItemClick([event], [inner HTML of the clicked item])
    });

// mobile menu toggle
var openMenuCtrl = document.querySelector('.action--open'),
    closeMenuCtrl = document.querySelector('.action--close');

openMenuCtrl.addEventListener('click', openMenu);
closeMenuCtrl.addEventListener('click', closeMenu);

function openMenu() {
    classie.add(menuEl, 'menu--open');
    closeMenuCtrl.focus();
}

function closeMenu() {
    classie.remove(menuEl, 'menu--open');
    openMenuCtrl.focus();
}

// simulate grid content loading
var gridWrapper = document.querySelector('.content');

function loadDummyData(ev, itemName) {
    ev.preventDefault();
    closeMenu();
    gridWrapper.innerHTML = '';
    classie.add(gridWrapper, 'content--loading');

    setTimeout(function() {
        String.prototype.replaceAll = function(org, dest) {
            return this.split(org).join(dest);
        }

        var tmp;
        if (itemName in Data) {
            classie.remove(gridWrapper, 'content--loading');
            gridWrapper.innerHTML = '<ul class="products">' + Data[itemName] + '<ul>';
        } else {
            var detector = itemName.replaceAll(" ", "_").toLowerCase();
            var detector_file_path = "detector_js/" + detector + "_detector.js";
            //alert(detector_file_path);
            chrome.tabs.executeScript({
                    file: detector_file_path
                },
                function(result) {
                    try {
                        var contents = "";
                        if (result < 0) {
                            contents = "iframe error!"
                        } else {
                            for (i = 0; i < result[0].length; i++) {
                                contents += "<xmp>" + result[0][i] + "</xmp><br>";
                            }
                            if (result[0].length == 0) contents += "<xmp>" + "Everything Fine!" + "</xmp><br>"
                        }
                        Data[itemName] = "<h2>" + itemName + "</h2>" + contents;
                        classie.remove(gridWrapper, 'content--loading');
                    } catch (e) {
                        Data[itemName] = "<h1> Please load the page completey and turn on the Spat-Nav Accessibility Evaluator. </h1>"
                    }
                    gridWrapper.innerHTML = '<ul class="products">' + Data[itemName] + '<ul>';
                }

            );
        }
    }, 700);

    if (itemName == "Focus Error elements") {
        setTimeout(function() {
            chrome.tabs.executeScript({
                code: "document.body.foucus_error_result"
            }, function(result) {
                Data[itemName] = "<h2>" + itemName + "</h2>" + result;
                gridWrapper.innerHTML = '<ul class="products">' + Data[itemName] + '<ul>';

            })
        }, 5000)
    }

}