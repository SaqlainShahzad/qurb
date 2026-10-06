(function(){
  function isEnglish() { return true; }
  window = global;
  window.testFn = function() {
    console.log("isEnglish:", isEnglish());
  };
})();
window.testFn();
