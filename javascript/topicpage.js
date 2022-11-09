

var counter = 0;
for (let i = 0; i < 30; i++)
{
  setTimeout(() => {
    autoSearch();

  }, i*100);
}






// Tags each question with difficulty + color and then sorts by difficulty after grouping by revisit, incomplete, and complete
function autoSearch() {
    var items = document.querySelectorAll('div.question-id');

    if (items.length == 0 || counter > 0)
    {
      return;
    }
    else
    {
      counter++;
    }

    // var qtoqtext = {};
    // for (let i = 0; i < items.length; i++) {
    //   qtoqtext[items[i].textContent] = qtext[i].innerHTML
    // }

    var p1UnComQs = [], p2UnComQs = [], p3UnComQs = [];
    var p1RevQs = [], p2RevQs = [], p3RevQs = [];
    var p1ComQs = [], p2ComQs = [], p3ComQs = [];
    
    function myFunction(item, index) {
      var cN = item.parentNode.parentNode.parentNode.className;
      if (cN == "paper-1") {
        if (item.parentNode.className == "question-item complete") {
            p1ComQs.push([item, 0])
        }
        else if (item.parentNode.className == "question-item revisit")
        {
          p1RevQs.push([item, 0])
        }
        else {
            p1UnComQs.push([item, 0])
        }
      }
      
      else if (cN == "paper-2") {
        if (item.parentNode.className == "question-item complete") {
          p2ComQs.push([item, 0])
        }
        else if (item.parentNode.className == "question-item revisit")
        {
          p2RevQs.push([item, 0])
        }
        else {
            p2UnComQs.push([item, 0])
        }      
      }
      
      else {
        if (item.parentNode.className == "question-item complete") {
          p3ComQs.push([item, 0])
        }
        else if (item.parentNode.className == "question-item revisit")
        {
          p3RevQs.push([item, 0])
        }
        else {
            p3UnComQs.push([item, 0])

        }
      }
    }    

    items.forEach(myFunction)
    
    var questions = [[p1UnComQs, p1RevQs, p1ComQs], [p2UnComQs, p2RevQs, p2ComQs], [p3UnComQs, p3RevQs, p3ComQs]]
    //false if not present, true if present; 3 arrays, one for each paper, each with 9 elements for each difficulty
    var uncompletedquestionspresentcheck = false
    // var qidlist = [];

    scoreurl = chrome.runtime.getURL("json/questionscores.json")
    fetch(scoreurl)
    .then(response => response.json())
    .then(function(json) {
  
        for (let i = 0; i < 3; i++)
        {
          for (let j = 0; j < 3; j++)
          {
            for (let k = 0; k < questions[i][j].length; k++)
            {
                var qid = questions[i][j][k][0].textContent
                // qidlist.push(qid);
                var coolMetric = Math.round(json[qid]*10)/10
                
                if (coolMetric >= 1) {
                    coolMetric = 0.9
                }
                
                var qidelement = questions[i][j][k][0]
                
                if (j == 0) {
                    qidelement.className += ` paper${i+1}_difficulty${Math.round(coolMetric*10)}`
                }
                
                questions[i][j][k][1] = coolMetric
                var bendDegree = 1.53
                var redCode = Math.floor(Math.min(255*((2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                var greenCode = Math.floor(Math.min(255*(-(2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                questions[i][j][k][0].parentNode.setAttribute("style", "border-right:7px solid " + "#" + redCode + greenCode + "00" + ";")
                
                if (document.getElementsByClassName("cool-metric").length<items.length)
                {
                    var coolMetricDiv = document.createElement('div')
                    coolMetricDiv.className = "cool-metric"
                    coolMetricDiv.setAttribute("style", "position: relative; right:-34px; top:-15px; opacity: 0.0;")
                    coolMetricDiv.textContent = Math.round(coolMetric*10)
                    questions[i][j][k][0].parentNode.appendChild(coolMetricDiv)
                }
            }
          }
        }
        
        uncompletedquestionspresentcheck = true
    
    //repeat for all three papers
    for (let j = 0; j < 3; j++)
    {
      //place all revisit questions before complete questions
      for (let i = 0; i < questions[j][0].length; i++ )
      {
        if (questions[j][2].length > 0)
        {
          questions[j][2][0][0].parentNode.parentNode.insertBefore(questions[j][0][i][0].parentNode, questions[j][2][0][0].parentNode);
        }

      }

      //place all incomplete questions before revisit questions
      for (let i = 0; i < questions[j][1].length; i++)
      {
        if  (questions[j][0].length > 0)
        {
          questions[j][0][0][0].parentNode.parentNode.insertBefore(questions[j][1][i][0].parentNode, questions[j][0][0][0].parentNode);
        }
      }

      //sort questions by difficulty within incomplete, revisit, and complete groups
      for (let k = 0; k < 3; k++)
      {
        questions[j][k].sort(function(a,b){return a[1]-b[1]})
        for (let i = questions[j][k].length-1; i >= 1; i--)
        {
          questions[j][k][i][0].parentNode.parentNode.insertBefore(questions[j][k][i-1][0].parentNode, questions[j][k][i][0].parentNode );
        }
      }
    }
    // console.log(JSON.stringify(qidlist))
    })
    
    var hoverstyle = document.createElement('style')
    hoverstyle.textContent = `
        .question-item {
            transition: all 0.19s ease-in-out;
        }
        .question-item:hover { 
            border-right-width:19px !important; 
        }
        .question-item:hover .cool-metric {
            opacity: 1.0 !important;
        }
        .scrollNumberClass:hover {
            opacity: 0.66 !important;
        }
    `
    document.head.appendChild(hoverstyle)
    
    
    //the magical scrolllllll
    
    var htmltag = document.getElementsByTagName('html')[0]
    htmltag.style.scrollBehavior = "smooth"
    
    for (let papernumiter = 1; papernumiter < 4; papernumiter++) {
        var papertitles = $("h3").filter(function() {
            return $(this).text() === `Paper ${papernumiter}`
        })
        
        if (papertitles.length > 0) {
            papertitle = papertitles[0]
            
            function allNumberDivs() {
                stringofdivs = ""
                for (let i = 1; i < 10; i++) {
                    stringofdivs += `<div id="scroll_p${papernumiter}_diff${i}" style="padding: 5px 9px; background: #eee; float: left; font-weight: 500; transition: background 0.32s ease-in-out, opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1.0); opacity: 1.0;">${i}</div>\n`
                }
                return stringofdivs
            }
            
            var paperScrollTitle = document.createElement('div')
            paperScrollTitle.innerHTML = `
                                                <table style="width: 100%; max-width: none">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <h3>Paper ${papernumiter}</h3>
                                                            </td>
                                                            <td style="float: right;">
                                                                <div style="overflow: hidden;">
                                                                    <h3 style="float: left; padding: 5px 9px; margin-top: 47px;">Difficulty:</h3>
                                                                    <div style="float: left; margin-top: 50px; border-radius: 4px; overflow: hidden; cursor: default;">
                                                                        ${allNumberDivs()}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                `
            papertitle.parentNode.insertBefore(paperScrollTitle, papertitle)
            
            papertitle.remove()
            
            for (let i = 1; i < 10; i++) {
                if (document.getElementsByClassName(`paper${papernumiter}_difficulty${i}`).length > 0) {
                    let bendDegree = 1.53
                    let coolMetric = 0.1 * i
                    redCode = Math.floor(Math.min(255*((2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                    greenCode = Math.floor(Math.min(255*(-(2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                    document.getElementById(`scroll_p${papernumiter}_diff${i}`).style.background = `#${redCode}${greenCode}00`
                }
                
                document.getElementById(`scroll_p${papernumiter}_diff${i}`).addEventListener('click', function() {
                    if (document.getElementsByClassName(`paper${papernumiter}_difficulty${i}`).length > 0) {
                        var first_element = document.getElementsByClassName(`paper${papernumiter}_difficulty${i}`)[0]
                        var dimensions = first_element.getBoundingClientRect()
                        
                        let scrolloffset = window.pageYOffset
                        let headeroffset = 150
                        
                        let scrollTargetY = dimensions.top + scrolloffset - headeroffset
                        
                        window.scrollTo(window.scrollX, scrollTargetY)
                    }
                })
            }
            
            function checkUncompletedQuestionsPresent() {
                if (uncompletedquestionspresentcheck === false) {
                    window.setTimeout(checkUncompletedQuestionsPresent, 100)
                } else {
                    for (let i = 1; i < 10; i++) {
                        if (document.getElementsByClassName(`paper${papernumiter}_difficulty${i}`).length > 0) {
                            let bendDegree = 1.53
                            let coolMetric = 0.1 * i
                            redCode = Math.floor(Math.min(255*((2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                            greenCode = Math.floor(Math.min(255*(-(2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                            document.getElementById(`scroll_p${papernumiter}_diff${i}`).style.background = `#${redCode}${greenCode}00`
                            document.getElementById(`scroll_p${papernumiter}_diff${i}`).style.cursor = "pointer"
                            document.getElementById(`scroll_p${papernumiter}_diff${i}`).className = "scrollNumberClass"
                        }
                    }
                }
            }
            
            checkUncompletedQuestionsPresent()
        }
    }
    
    //the magical +
    if (document.getElementsByClassName("header-link").length > 0) {
        headerLinkBox = document.getElementsByClassName("header-link")[0]
        headerLinkBox.innerHTML = `<h2>pestle<sup style="transition: all 0.4s ease-in-out; display: inline-block; transform: rotate(0deg);" id="pestleplus">+</sup></h2>`
        
        function rotatePestlePlus() {
            pestleplusrotation = pestleplusrotation + 90
            
            var pestleplus = document.getElementById('pestleplus')
            
            var items = document.querySelectorAll('div.question-id')
            
            if (items.length == 0) {
                clearInterval(rotateID)
            }
            
            else {
                pestleplus.style.transform = `rotate(${pestleplusrotation}deg)`
            }
        }
        
        if (typeof rotateID === 'undefined') {
            var pestleplusrotation = 0
            rotateID = setInterval(rotatePestlePlus, 5000);
        }
        
        else {
            clearInterval(rotateID);
            var pestleplusrotation = 0
            rotateID = setInterval(rotatePestlePlus, 5000);
        }
    }
//    console.log("sorting done")

}
