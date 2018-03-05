//Game state
var currentGame = {}
var showForm = false

//Helper functions
function toggleForm() {
  showForm = !showForm;
  $('#game-form').remove();
  $('#games-list').toggle();

  if (showForm) {
    $.ajax({
      url: '/game_form',
      method: 'GET'
    }).done( function(html) {
      $('#toggle').after(html)
    });
  }
}

$(document).ready( function() {
  //Form submit handler
  $(document).on('submit', '#game-form form', function(e) {
    e.preventDefault();
    toggleForm();
    var data = $(this).serializeArray();
    $.ajax({
      url: '/games',
      type: 'POST',
      dataType: 'JSON',
      data: data
    }).done( function(game) {
      var g = '<li class="game-item" data-id="' + game.id + '" data-name="' + data.name + '">' + game.name + '-' + game.description + '</li>';
      $('#games-list').append(g);
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    });
  });

  //Toggle form click handler
  $('#toggle').on('click', function() {
    toggleForm()
  });

  //Game select click handler
  $(document).on('click', '.game-item', function() {
    currentGame.id = this.dataset.id;
    currentGame.name = this.dataset.name;
    $.ajax({
      url: '/games/' + currentGame.id + '/characters',
      type: 'GET',
      dataType: 'JSON'
    }).done( function(characters) {
      $('#game').text('Characters in ' + currentGame.name);
      var list = $('#characters');
      list.empty();
      characters.forEach( function(char) {
        var li = '<li data-character-id="' + char.id + '">' + char.name + ' - ' + char.power + '</li>'
        list.append(li)
      });
    });
  });
});