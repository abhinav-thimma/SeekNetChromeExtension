// Change for local development
const CONNECTION = "http://127.0.0.1:5000/"; // local development
// const CONNECTION = "http://seeknet.eastus.cloudapp.azure.com:5000/"; // in production

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
    this.post = function(aUrl, data, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
            anHttpRequest.open( "POST", aUrl, true );            
            anHttpRequest.send( data );
    }
}
var client = new HttpClient();
var connectionForm = document.getElementById('post-connection');
var connections = document.getElementById('connections');

function getConnections() {
    url = window.url
    get_url = CONNECTION + '?url=' + url
    client.get(get_url, function(response){
        var parsed_response = JSON.parse(response);
        if(parsed_response['status'] == 1){
            renderConnections(parsed_response['payload']['connections'])
        } else {
            alert('Sorry, something went wrong. Please try again later.')
        }
    })
}

connectionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var data = new FormData(connectionForm);
    data.append('current_url', window.url)
    client.post(CONNECTION + 'connect', data, function(response){
        var parsed_response = JSON.parse(response);
        if(parsed_response['status'] == 1){
            renderConnections(parsed_response['payload']['connections'])
        } else {
            alert('Sorry, something went wrong. Please try again later.')
            console.log(parsed_response)
        }
    });
});


// render connections
function renderConnections(parsed_response) {
    connections.innerHTML = "<text> Connections from the Current URL: </text>"
    for(var connection in parsed_response){
        connections.innerHTML += '<hr><text>' + parsed_response[connection]['text'] + '<text><br>'
        connections.innerHTML += '<button \
                                    id=' + connection + ' \
                                    data-url=' + parsed_response[connection]['tgt_url'] + ' \
                                    data-id=' + parsed_response[connection]['_id'] + '\
                                    >See Connection </button>'
        host = new URL(parsed_response[connection]['tgt_url']).host
        connections.innerHTML += '<text> via </text><b> ' + host + '</b><br>'
    } 
    for (var connection in parsed_response) {
        document.getElementById(connection).addEventListener("click", clickConnection);
    }
}


function clickConnection(e) {
    url = e.target.dataset.url
    var redirectWindow = window.open(url, '_blank');
    redirectWindow.location;
    var data = new FormData();
    data.append('id', e.target.dataset.id)
    client.post(CONNECTION + 'log', data, function(response){
        return
    });
}



function handleExtensionOpen() {
  // gets the URL of the window then renders the data
  chrome.tabs.query({active: true, currentWindow: true}, 
    (tabs) => {
        var url = tabs[0].url;
        window.url = url
        getConnections()
  });
}

window.addEventListener('load', handleExtensionOpen)