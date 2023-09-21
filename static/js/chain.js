var history_state = 0;

let clicks = 0;
let chains = 0;

const current = {};
current.id = $('.current').data('id');
current.url = $('#current-img').attr('src');
current.name = $('#current-name').text();
current.type = 'a';

const target = {};
target.id = $('.target').data('id');
target.url = $('#target-img').attr('src');
target.name = $('#target-name').text();

var isRunning = false;
var startTime = 0;

var start_name = $('#current-name').text();

$(document).on('click', '.movie-parent', function() {
    $("html, body").animate({ scrollTop: 0 }, 500);
    $("#click-counter").text(++clicks);
    $("#search-input").val("");

    if ($(this).data('id') === target.id) { // can never happen
        alert("You Win");
    }


    const src = $('#current-img').attr('src');
    const newImg = $("<img>").attr("src", src);
    const newHistoryItem = $("<div>").addClass("history-item")
        .attr("data-id", current.id)
        .attr("data-type", current.type)
        .append(newImg);
    $(".history").append(newHistoryItem);

    const movie_id = $(this).data('id');
    const movie_url = $(this).find('img').prop('src');
    const movie_name = $(this).find('.info h2').text();

    current.id = movie_id;
    current.url = movie_url;
    current.name = movie_name;
    current.type = 'm';

    $('.current').attr('data-id', movie_id);
    $('#current-img').attr('src', movie_url);
    $('#current-name').text(movie_name);

    loadMovieCredits(movie_id);
});

$(document).on('click', '.tv-parent', function() {
    $("html, body").animate({ scrollTop: 0 }, 500);
    $("#click-counter").text(++clicks);
    $("#search-input").val("");

    if ($(this).data('id') === target.id) {  // can never happen
        alert("You Win");
    }


    const src = $('#current-img').attr('src');
    const newImg = $("<img>").attr("src", src);
    const newHistoryItem = $("<div>").addClass("history-item")
        .attr("data-id", current.id)
        .attr("data-type", current.type)
        .append(newImg);
    $(".history").append(newHistoryItem);

    const tv_id = $(this).data('id');
    const tv_url = $(this).find('img').prop('src');
    const tv_name = $(this).find('.info h2').text();

    current.id = tv_id;
    current.url = tv_url;
    current.name = tv_name;
    current.type = 'tv';

    $('.current').attr('data-id', tv_id);
    $('#current-img').attr('src', tv_url);
    $('#current-name').text(tv_name);

    loadTVCredits(tv_id);
});

$(document).on('click', '.actor-parent', function() {
    $("html, body").animate({ scrollTop: 0 }, 500);
    $("#click-counter").text(++clicks);
    $("#search-input").val("");

    if ($(this).data('id') === target.id) {
        $("#chain-counter").text(++chains);
        var people = loadPerson();

        current.id = people["start"][2];
        current.url = people["start"][1];
        current.name = people["start"][0];
        current.type = 'a';

        $('.current').attr('data-id', people["start"][2]);
        $('#current-img').attr('src', people["start"][1]);
        $('#current-name').text(people["start"][0]);

        target.id = people["target"][2];
        target.url = people["target"][1];
        target.name = people["target"][0];
        target.type = 'a';

        $('.target').attr('data-id', people["target"][2]);
        $('#target-img').attr('src', people["target"][1]);
        $('#target-name').text(people["target"][0]);

        loadRoles(people["start"][2]);
    }


    const src = $('#current-img').attr('src');
    const newImg = $("<img>").attr("src", src);
    const newHistoryItem = $("<div>").addClass("history-item")
        .attr("data-id", current.id)
        .attr("data-type", current.type)
        .append(newImg);
    $(".history").append(newHistoryItem);

    const actor_id = $(this).data('id');
    const actor_url = $(this).find('img').prop('src');
    const actor_name = $(this).find('.info h2').text();

    current.id = actor_id;
    current.url = actor_url;
    current.name = actor_name;
    current.type = 'a';

    $('.current').attr('data-id', actor_id);
    $('#current-img').attr('src', actor_url);
    $('#current-name').text(actor_name);

    loadRoles(actor_id);
});

$(document).on('click', '.history-item', function() {
    const actor_id = $(this).data('id');
    const actor_url = $(this).find('img').prop('src');
    const actor_name = $(this).find('.info h2').text();

    current.id = actor_id;
    current.url = actor_url;
    current.name = actor_name;

    $('.current').attr('data-id', actor_id);
    $('#current-img').attr('src', actor_url);
    $('#current-name').text(actor_name);

    if ($(this).attr('data-type') === 'a') {
        loadRoles($(this).attr('data-id'));
    } else if ($(this).attr('data-type') === 'm') {
        loadMovieCredits($(this).attr('data-id'));
    } else if ($(this).attr('data-type') === 'tv') {
        loadTVCredits($(this).attr('data-id'));
    }

    if (history_state === 1) {
        $("#history-parent").animate({
            marginLeft: '-7rem',
        }, 500);

        $("#modal-bg").animate({
            opacity: 0,
        }, 500);

        history_state = 0;
        $("#modal-bg").css("display", "none");
    }
});

function loadPerson() {
    return fetch('/api/person')
        .then(response => response.json());
}


function loadMovieCredits(movie_id) {
    fetch('/api/movie/' + movie_id)
    .then(response => response.json())
    .then(data => updateCredits(data));
}

function loadTVCredits(tv_id) {
    fetch('/api/tv/' + tv_id)
    .then(response => response.json())
    .then(data => updateCredits(data));
}

function loadRoles(actor_id) {
    fetch('/api/roles/' + actor_id)
    .then(response => response.json())
    .then(data => updateRoles(data));
}

function updateCredits(data) {
    var cast = data["cast"]
    var crew = data["crew"]

    var castColumn = $("<div>").addClass("column");

    var castSectionHeader = $("<div>").addClass("section-header");
    var castSectionHeaderP = $("<p>").text("CAST");
    castSectionHeader.append(castSectionHeaderP);
    castColumn.append(castSectionHeader);

    var castDataContainer = $("<div>").addClass("data-container");
    $.each(cast, function(i, credit) {
        var actorParent = $("<div>").addClass("actor-parent").attr("data-id", credit[3]);
        var img = $("<img>").attr("src", credit[2]);
        var info = $("<div>").addClass("info");
        var h2 = $("<h2>").text(credit[0]);
        var p = $("<p>").text(credit[1]);

        info.append(h2, p);
        actorParent.append(img, info);
        castDataContainer.append(actorParent);
    });

    castColumn.append(castDataContainer);

    var crewColumn = $("<div>").addClass("column");

    var crewSectionHeader = $("<div>").addClass("section-header");
    var crewSectionHeaderP = $("<p>").text("CREW");
    crewSectionHeader.append(crewSectionHeaderP);
    crewColumn.append(crewSectionHeader);

    var crewDataContainer = $("<div>").addClass("data-container");
    $.each(crew, function(i, credit) {
        var actorParent = $("<div>").addClass("actor-parent").attr("data-id", credit[3]);
        var img = $("<img>").attr("src", credit[2]);
        var info = $("<div>").addClass("info");
        var h2 = $("<h2>").text(credit[0]);
        var p = $("<p>").text(credit[1]);

        info.append(h2, p);
        actorParent.append(img, info);
        crewDataContainer.append(actorParent);
    });

    crewColumn.append(crewDataContainer);

    $(".columns").empty();
    $(".columns").append(castColumn);
    $(".columns").append(crewColumn);

}

function updateRoles(data) {
    var movies = data["movies"]
    var tv = data["tv"]

    var moviesColumn = $("<div>").addClass("column");

    var moviesSectionHeader = $("<div>").addClass("section-header");
    var moviesSectionHeaderP = $("<p>").text("MOVIES");
    moviesSectionHeader.append(moviesSectionHeaderP);
    moviesColumn.append(moviesSectionHeader);

    var moviesDataContainer = $("<div>").addClass("data-container");
    $.each(movies, function(i, credit) {
        var movieParent = $("<div>").addClass("movie-parent").attr("data-id", credit[3]);
        var img = $("<img>").attr("src", credit[2]);
        var info = $("<div>").addClass("info");
        var h2 = $("<h2>").text(credit[0]);
        var p = $("<p>").text(credit[1]);

        info.append(h2, p);
        movieParent.append(img, info);
        moviesDataContainer.append(movieParent);
    });

    moviesColumn.append(moviesDataContainer);

    var tvColumn = $("<div>").addClass("column");

    var tvSectionHeader = $("<div>").addClass("section-header");
    var tvSectionHeaderP = $("<p>").text("SHOWS");
    tvSectionHeader.append(tvSectionHeaderP);
    tvColumn.append(tvSectionHeader);

    var tvDataContainer = $("<div>").addClass("data-container");
    $.each(tv, function(i, credit) {
        var tvParent = $("<div>").addClass("tv-parent").attr("data-id", credit[3]);
        var img = $("<img>").attr("src", credit[2]);
        var info = $("<div>").addClass("info");
        var h2 = $("<h2>").text(credit[0]);
        var p = $("<p>").text(credit[1]);

        info.append(h2, p);
        tvParent.append(img, info);
        tvDataContainer.append(tvParent);
    });

    tvColumn.append(tvDataContainer);

    $(".columns").empty();
    $(".columns").append(moviesColumn);
    $(".columns").append(tvColumn);

}

$(document).ready(function() {
    $("#home-title").click(function() {
        window.location.href = "/";
    });

    $("#home-icon").click(function() {
        window.location.href = "/";
    });

    $("#history-icon").click(function() {
        if (history_state === 0) {
            $("#modal-bg").css("display", "block");

            $("#history-parent").animate({
              marginLeft: 0,
            }, 500);

            $("#modal-bg").animate({
              opacity: 1,
            }, 500);

            history_state = 1;
        } else {
            $("#history-parent").animate({
              marginLeft: '-7rem',
            }, 500);

            $("#modal-bg").animate({
              opacity: 0,
            }, 500);

            history_state = 0;
            $("#modal-bg").css("display", "none");
        }
    });

    $("#modal-bg").click(function() {
        if (history_state === 1) {
            $("#history-parent").animate({
                marginLeft: '-7rem',
            }, 500);

            $("#modal-bg").animate({
                opacity: 0,
            }, 500);

            history_state = 0;
            $("#modal-bg").css("display", "none");
        }
    });

    $("#search-input").on("input", function() {
        var query = $(this).val().toLowerCase();
        $(".movie-parent").each(function() {
            var title = $(this).find("h2").text().toLowerCase();
            var role = $(this).find("p").text().toLowerCase();
            if (title.indexOf(query) === -1 && role.indexOf(query) === -1) {
              $(this).hide();
            } else {
              $(this).show();
            }
        });
    });
});