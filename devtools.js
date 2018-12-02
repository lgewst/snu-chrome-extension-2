console.log("hello from devtools");
chrome.devtools.panels.create("Spat_Nav_Dev",
                              "dev.png",
                              "index.html",
                              function(panel) { console.log("hello from callback"); });
                              
