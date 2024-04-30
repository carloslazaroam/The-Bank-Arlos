$(document).ready(function () {
    $('#ul-wrapper').hide();
    $('#menu').click(hamburger);
    
    function hamburger () {
      $('#ul-wrapper').show();
      $('#menu').hide();
      $('#close-menu').show();
    }
    
    $('#close-menu').click(closeUL);
    
    function closeUL () {
      $('#close-menu').hide();
      $('#menu').show();
       $('#ul-wrapper').hide();
    } 
  })