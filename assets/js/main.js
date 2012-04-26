function loaded() {
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  // Initializating TabBar
  nativeControls = window.plugins.nativeControls;
  nativeControls.createTabBar();
  
  // Books tab
  nativeControls.createTabBarItem(
    "books",
    "Books",
    "/www/tabs/book.png",
    {"onSelect": function() {
      books();
    }}
  );
  
  // Stats tab
  nativeControls.createTabBarItem(
    "finished",
    "Finished",
    "/www/tabs/box.png",
    {"onSelect": function() {
      finished();
    }}
  );
  
  // About tab
  nativeControls.createTabBarItem(
    "about",
    "About",
    "/www/tabs/info.png",
    {"onSelect": function() {
      about();
    }}
  );
  
  // Compile the TabBar
  nativeControls.showTabBar();
  nativeControls.showTabBarItems("books", "finished", "about");
  nativeControls.selectTabBarItem("books");
}