document.querySelector('#result-box').addEventListener('click', event => {
    if (!event.target.closest('section')) return;

    $(event.target.closest('section').querySelector('#rest-candidates')).slideToggle(300);
    console.log('toggle');
})