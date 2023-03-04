window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}
function checkSupport() {
  if (!('speechSynthesis' in window)) {
    window.alert("你的浏览器不支持文本转语音。请下载 Google Chrome 或 Microsoft Edge 浏览器")
  }
}

function setSpeech() {
return new Promise(function (resolve, reject) {
  let id;

  id = setInterval(() => {
    if (speechSynthesis.getVoices().length !== 0) {
      resolve(speechSynthesis.getVoices());
      clearInterval(id);
    }
  }, 10);
});
}

showVal = 4

function speak(text, lang) {
  checkSupport()
  setSpeech().then((voices) => {
    const filteredVoices = voices.filter(voice => voice.localService === false && voice.lang == lang)
  // Create a new instance of SpeechSynthesisUtterance.
  var msg = new SpeechSynthesisUtterance();
    msg.voice = filteredVoices[0] || voices.localService;
    msg.lang = lang
    // Set the text.
    msg.text = text;
    msg.rate = 0.9;
  // Queue this utterance.

  if (!speechSynthesis.speaking) {

    window.speechSynthesis.speak(msg);
  } else {
    speechSynthesis.cancel()
    window.speechSynthesis.speak(msg);
  }
});
}

let regExp = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;

function getLang(myString) {
  let found = regExp.test(myString)
  let result = found ? "zh-CN" : "it-IT";
  return result
}

function showResults() {
  results = []
    $('#results').empty('')
    const value = $('#search').val().toLowerCase();
    if( searches.length + 1 > 20 ) {
      searches.pop()
    }
    if( searches.includes(value) ) {
      searches.splice(searches.indexOf(value), 1)
    }
    
    searches.unshift(value)
    localStorage.setItem('DICT_RECENT_SEARCH', JSON.stringify(searches))

    json.forEach(j => {
      if (containsWord(j['w'], value)) {
        results.push(j)
      } else if ( j['w'].toLowerCase().includes(value)) {
        results.push(j)
      }
    })
    results.sort(function(a,b){
      return a['w'].length - b['w'].length;
    });
    results.slice( 0, showVal ).forEach(function (r, i) {
      var l_h3 = getLang(r['w']);
      if (l_h3 == 'it-IT') {
          var l_m = 'zh-CN'
        }
        else {
          var l_m = 'it-IT'
        }
      $('#results').append(`<div class="result"><h3 onClick="speak('${r['w']}', '${l_h3}')">${r['w']}</h3><span id="meaning-${i}"></span></div>`);
      r['m'].forEach(m => {
        $(`#meaning-${i}`).append(`<button onClick="speak('${m}', '${l_m}')" class="meaning">${m}</button></div>`);
      })
    })
}

function containsWord(string, word) {
  return new RegExp('\\b' + word.toLowerCase() + '\\b').test(string.toLowerCase());
}

const searches = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('DICT_RECENT_SEARCH') || "[]") : null

searches.forEach(function(s, i) {
  $('#recent').append(`<button class="recent">${s}</button>`);
})

$('.recent').on('click', function () {
  $('#search').val($(this).html());
  showResults()
});


var results = []
var json = (function () {
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'url': 'ita.json',
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
  return json;
})();

$('#search').focus()
$('#search').on('click', function () {
  $(this).select()
});
$(document).on('keypress',function(e) {
  if(e.which == 13) {
    showResults()
  }
});


$('#show-more').on('click', function(){
  showVal +=4
  showResults()
});

$('#show-less').on('click', function(){
  showVal -=4
  showResults()
});

//Show only four items
if ( $('.result').length > 4 ) {
   /*$('.lia-list-standard li:gt(3)').hide();
   $('.show-more').removeClass('hidden');
   */
       $('.show-less').click();
}

   
