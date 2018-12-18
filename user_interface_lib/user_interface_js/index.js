
		var menuEl = document.getElementById('ml-menu'),
			mlmenu = new MLMenu(menuEl, {
				// breadcrumbsCtrl : true, // show breadcrumbs
				// initialBreadcrumb : 'all', // initial breadcrumb text
				backCtrl : false, // show back button
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
				if (itemName in dummyData){
					classie.remove(gridWrapper, 'content--loading');
					gridWrapper.innerHTML = '<ul class="products">' + dummyData[itemName] + '<ul>';
				} else {
					var detector = itemName.replaceAll(" ","_").toLowerCase();
					var detector_file_path = "detector_js/"+detector+"_detector.js";
					//alert(detector_file_path);
					chrome.tabs.executeScript({ file: detector_file_path}, 
							    function(result){
								
								var contents = "";
								if(result < 0){ contents = "iframe error!"}
								else{
							    	for (i = 0; i < result[0].length; i++)
									{contents += "<xmp>"+result[0][i] + "</xmp><br>";}
								}
									dummyData[itemName] = "<h2>"+itemName+"</h2>"+ contents;
									classie.remove(gridWrapper, 'content--loading');
									gridWrapper.innerHTML = '<ul class="products">' + dummyData[itemName] + '<ul>';
								}
								
						);
			 	}
			}, 700);

			if(itemName == "Focus Error elements"){
						setTimeout(function(){
						chrome.tabs.executeScript({code: "document.body.foucus_error_result"}, function(result){
								dummyData[itemName] = "<h2>"+itemName+"</h2>"+ result;
								gridWrapper.innerHTML = '<ul class="products">' + dummyData[itemName] + '<ul>';
								
						})
					},5000)
			}

		}
