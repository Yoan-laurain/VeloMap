/* Search */

function searchToggle(obj, evt)
{
    var container = $(obj).closest('.search-wrapper');
    if( container.hasClass('active') && $(obj).closest('.input-holder').length == 0 )
    {
        container.removeClass('active');
        container.find('.search-input').val('');
    }
}

/* End search */

/* Dropdown Menu */

$('.dropdown').click(function ()
{
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});

$('.dropdown').focusout(function () 
{
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});

/* End Dropdown Menu */


